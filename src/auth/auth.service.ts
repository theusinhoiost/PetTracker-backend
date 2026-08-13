import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './types/jwt-payloads.type';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from '../common/hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async doLogin(body: LoginDto) {
    const user = await this.userService.findByEmailWithPassword(body.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isPasswordValid = await this.hashingService.compare(
      body.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return this.createAuthResponse(user);
  }

  async validateGoogleUser(data: {
    googleId: string;
    email?: string;
    name?: string;
    avatar?: string;
  }) {
    if (!data.email) {
      throw new UnauthorizedException(
        'Não foi possível obter o email da conta Google',
      );
    }

    // 1. Procura pelo Google ID
    let user = await this.userRepository.findOne({
      where: {
        googleId: data.googleId,
      },
    });

    // Usuário já possui essa conta Google vinculada
    if (user) {
      return user;
    }

    // 2. Procura pelo email
    user = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    // Usuário já possui conta no LikeDelivery
    if (user) {
      user.googleId = data.googleId;

      if (!user.avatar && data.avatar) {
        user.avatar = data.avatar;
      }

      return this.userRepository.save(user);
    }

    // 3. Cria novo usuário
    user = this.userRepository.create({
      googleId: data.googleId,
      email: data.email,
      name: data.name ?? 'Usuário',
      avatar: data.avatar ?? null,
      password: null,
    });

    return this.userRepository.save(user);
  }

  async loginWithGoogle(user: User) {
    return this.createAuthResponse(user);
  }

  private async createAuthResponse(user: User) {
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    const hashedRefreshToken = await this.hashingService.hash(
      tokens.refreshToken,
    );

    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

    await this.userService.setForceLogout(user.id, false);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload: jwtPayload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '1h',
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<jwtPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findByID(payload.sub);

      if (!user || user.forceLogout || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      const isValid = await this.hashingService.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!isValid) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      const hashedRefreshToken = await this.hashingService.hash(
        tokens.refreshToken,
      );

      await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }
}

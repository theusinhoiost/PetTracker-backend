import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPayload } from './types/jwt-payloads.type';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    const secret = process.env.JWT_ACCESS_SECRET; // ← MUDAR PARA ACCESS_SECRET

    if (!secret) {
      throw new InternalServerErrorException(
        'JWT_ACCESS_SECRET not found in .env',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: jwtPayload) {
    const user = await this.userService.findByID(payload.sub);
    if (!user || user.forceLogout) {
      throw new UnauthorizedException('Login necessário');
    }
    return user;
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  //Testing phone and email
  async failIfEmailExists(email: string) {
    const exists = await this.userRepository.existsBy({ email });
    if (exists) throw new ConflictException('Email já existe');
  }

  async failIfPhoneExists(phone: string) {
    const exists = await this.userRepository.existsBy({ phone });
    if (exists) throw new ConflictException('Telefone já existe');
  }
  //Finds
  async findOneByOrFail(userData: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOne({
      where: userData,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmailWithPassword(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findByIdWithPassword(id: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
  }
  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findByID(id: string) {
    return this.userRepository.findOneBy({ id });
  }
  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.userRepository.update(
      { id: userId },
      {
        hashedRefreshToken: refreshToken,
      },
    );
  }
  //CRUD
  async findAll(page = 1, limit = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async create(dto: CreateUserDto) {
    const existsEmail = await this.userRepository.exists({
      where: { email: dto.email },
    });

    const existsPhone = await this.userRepository.exists({
      where: { phone: dto.phone },
    });

    if (existsEmail || existsPhone) {
      throw new ConflictException('Email e/ou telefone já existem');
    }

    const hashedPassword = await this.hashingService.hash(dto.password);

    const created = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.userRepository.save(created);
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!dto.name && !dto.email && dto.phone) {
      throw new BadRequestException('Dados não enviados');
    }

    const user = await this.findOneByOrFail({ id });

    if (dto.name) {
      user.name = dto.name;
    }

    if (dto.email && dto.email !== user.email) {
      await this.failIfEmailExists(dto.email);
      user.email = dto.email;
      user.forceLogout = true;
    }

    if (dto.phone && dto.phone !== user.phone) {
      await this.failIfPhoneExists(dto.phone);
      user.phone = dto.phone;
      user.forceLogout = true;
    }

    return this.userRepository.save(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.findByIdWithPassword(id);

    if (!user || !user.password) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const isCurrentPasswordValid = await this.hashingService.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    user.password = await this.hashingService.hash(dto.newPassword);
    user.forceLogout = true;

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    await this.userRepository.softDelete({ id });
  }
  async setForceLogout(userId: string, value: boolean) {
    await this.userRepository.update(userId, {
      forceLogout: value,
    });
  }
}

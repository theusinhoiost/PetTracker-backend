import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly hashingService: HashingService,
  ) {}
  async failIfEmailExists(email: string) {
    const exists = await this.userRepository.existsBy({ email });
    if (exists) throw new ConflictException('Email já existe');
  }
  async findOneByOrFail(userData: Partial<UserEntity>) {
    const user = await this.userRepository.findOneBy(userData);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
  async create(dto: CreateUserDto) {
    const existsEmail = await this.userRepository.exists({
      where: { email: dto.email },
    });
    const existsPhone = await this.userRepository.exists({
      where: { phoneNumber: dto.phoneNumber },
    });
    if (existsEmail || existsPhone) {
      throw new ConflictException('Email ou telefone inválidos');
    }
    const hashedPassword = await this.hashingService.hash(dto.password);
    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: hashedPassword,
    };
    const created = await this.userRepository.save(newUser);
    return created;
  }
  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
  async findByID(id: string) {
    return this.userRepository.findOneBy({ id });
  }
  async update(id: string, dto: UpdateUserDto) {
    if (!dto.name && !dto.email) {
      throw new BadRequestException('Dados não enviados');
    }

    const user = await this.findOneByOrFail({ id });

    user.name = dto.name ?? user.name;

    if (dto.email && dto.email !== user.email) {
      await this.failIfEmailExists(dto.email);
      user.email = dto.email;
      user.forceLogout = true;
    }
    await this.userRepository.save(user);
    return this.save(user);
  }
  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.findOneByOrFail({ id });
    const isCurrentPasswordValid = await this.hashingService.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid)
      throw new UnauthorizedException('Senha inválida');
    user.password = await this.hashingService.hash(dto.newPassword);
    user.forceLogout = true;

    return this.save(user);
  }
  async save(user: UserEntity) {
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = this.findOneByOrFail({ id });
    await this.userRepository.delete({ id });
    return user;
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
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

  async failIfPhoneExists(phoneNumber: string) {
    const exists = await this.userRepository.existsBy({ phoneNumber });
    if (exists) throw new ConflictException('Telefone já existe');
  }
  //Finds
  async findOneByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneBy(userData);

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

  //CRUD
  async create(dto: CreateUserDto) {
    const existsEmail = await this.userRepository.exists({
      where: { email: dto.email },
    });

    const existsPhone = await this.userRepository.exists({
      where: { phoneNumber: dto.phoneNumber },
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
    if (!dto.name && !dto.email && dto.phoneNumber) {
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

    if (dto.phoneNumber && dto.phoneNumber !== user.phoneNumber) {
      await this.failIfPhoneExists(dto.phoneNumber);
      user.phoneNumber = dto.phoneNumber;
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
    const user = await this.findOneByOrFail({ id });

    await this.userRepository.delete({ id });

    return user;
  }
  async setForceLogout(userId: string, value: boolean) {
    await this.userRepository.update(userId, {
      forceLogout: value,
    });
  }
}

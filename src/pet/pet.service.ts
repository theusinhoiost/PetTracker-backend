import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  async failIfNameExists(name: string, userId: string) {
    const exists = await this.petRepository.exists({
      where: {
        name,
        owner: {
          id: userId,
        },
      },
    });

    if (exists) {
      throw new ConflictException('Você já cadastrou um pet com esse nome');
    }
  }

  async create(dto: CreatePetDto, userId: string) {
    await this.failIfNameExists(dto.name, userId);

    const newPet = this.petRepository.create({
      name: dto.name,
      birthDate: dto.birthDate,
      race: dto.race,
      species: dto.species,
      owner: { id: userId },
    });

    if (!newPet) {
      throw new NotAcceptableException('Erro ao criar o Pet');
    }

    const createdPet = await this.petRepository.save(newPet);

    return createdPet;
  }

  async findOneByID(id: string, userId: string) {
    const pet = await this.petRepository.findOne({
      where: {
        id,
        owner: { id: userId },
      },
      relations: ['owner'],
    });

    if (!pet) {
      throw new NotFoundException(
        'Pet não encontrado ou não pertence ao usuário',
      );
    }

    return pet;
  }

  async findAllPetsFromOneUser(userId: string) {
    const pet = await this.petRepository.find({
      where: {
        owner: { id: userId },
      },
      relations: ['owner'],
      order: {
        name: 'asc',
      },
    });

    if (!pet) {
      throw new NotFoundException(
        'Pets não encontrados ou não pertence ao usuário',
      );
    }

    return pet;
  }
  async findAll() {
    const pet = await this.petRepository.find();

    if (!pet) {
      throw new NotFoundException('Pets não encontrados');
    }

    return pet;
  }
  async update(id: string, dto: UpdatePetDto, userId: string) {
    const pet = await this.findOneByID(id, userId);

    if (dto.name) pet.name = dto.name;
    if (dto.birthDate) pet.birthDate = dto.birthDate;
    return this.petRepository.save(pet);
  }

  async remove(id: string, userId: string) {
    await this.findOneByID(id, userId);
    return this.petRepository.delete({ id });
  }
}

import {
  BadRequestException,
  Injectable,
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

  async create(dto: CreatePetDto) {
    const newPet: CreatePetDto = {
      name: dto.name,
      birthDate: dto.birthDate,
      race: dto.race,
      species: dto.species,
    };
    const created = await this.petRepository.save(newPet);
    return created;
  }

  findOne(id: string) {
    return this.petRepository.findOneBy({ id });
  }
  async findOneByIDOrFail(PetData: Partial<Pet>) {
    const pet = await this.petRepository.findOneBy(PetData);

    if (!pet) {
      throw new NotFoundException('Pet não encontrado');
    }

    return pet;
  }

  async update(id: string, dto: UpdatePetDto) {
    if (!dto.name && dto.birthDate) {
      throw new BadRequestException('Dados não enviados');
    }

    const pet = await this.findOneByIDOrFail({ id });

    if (dto.name) {
      pet.name = dto.name;
    }

    if (dto.birthDate) {
      pet.birthDate = dto.birthDate;
    }

    return this.petRepository.save(pet);
  }

  remove(id: string) {
    return this.petRepository.delete({ id });
  }
}

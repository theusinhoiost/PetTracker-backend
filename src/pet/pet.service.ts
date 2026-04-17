import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetEntity } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(PetEntity)
    private readonly petRepository: Repository<PetEntity>,
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

  findAll() {
    return `This action returns all pet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pet`;
  }

  // update(id: number, updatePetDto: UpdatePetDto) {
  //   return `This action updates a #${id} pet`;
  // }

  remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}

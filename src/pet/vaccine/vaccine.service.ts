import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vaccine } from './entities/vaccine.entity';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { Pet } from 'src/pet/entities/pet.entity';

@Injectable()
export class VaccineService {
  constructor(
    @InjectRepository(Vaccine)
    private readonly vaccineRepository: Repository<Vaccine>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  private async getVaccineEntity(id: string, userId: string): Promise<Vaccine> {
    const vaccine = await this.vaccineRepository.findOne({
      where: { id, pet: { owner: { id: userId } } },
      relations: ['pet'],
    });

    if (!vaccine) {
      throw new NotFoundException('Vacina não encontrada');
    }
    return vaccine;
  }

  async create(dto: CreateVaccineDto, userId: string) {
    const pet = await this.petRepository.findOne({
      where: { id: dto.petId, owner: { id: userId } },
    });

    if (!pet) {
      throw new NotFoundException(
        'Pet não encontrado ou não pertence ao usuário',
      );
    }

    const vaccine = this.vaccineRepository.create({
      ...dto,
      pet,
    });

    return this.vaccineRepository.save(vaccine);
  }

  async findAllByPet(petId: string, userId: string) {
    return this.vaccineRepository.find({
      where: { pet: { id: petId, owner: { id: userId } } },
      relations: ['pet'],
      order: { applicationDate: 'DESC' },
    });
  }

  async remove(id: string, userId: string) {
    const vaccine = await this.getVaccineEntity(id, userId);
    await this.vaccineRepository.remove(vaccine);
  }
}

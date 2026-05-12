import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccine } from './entities/vaccine.entity';
import { Repository } from 'typeorm';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { Pet } from 'src/pet/entities/pet.entity';

@Injectable()
export class VaccineService {
  constructor(
    @InjectRepository(Vaccine)
    private readonly vaccineRepo: Repository<Vaccine>,

    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>,
  ) {}
  async create(dto: CreateVaccineDto, userId: string) {
    const pet = await this.petRepo.findOne({
      where: {
        id: dto.petId,
        owner: { id: userId },
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet não encontrado');
    }

    const vaccine = this.vaccineRepo.create({
      ...dto,
      pet,
    });

    return this.vaccineRepo.save(vaccine);
  }
  async findAllByPet(petId: string) {
    return this.vaccineRepo.find({
      where: { pet: { id: petId } },
      order: { applicationDate: 'DESC' },
    });
  }

  async remove(id: string) {
    const vaccine = await this.vaccineRepo.findOne({
      where: { id },
    });

    if (!vaccine) {
      throw new NotFoundException('Vacina não encontrada');
    }

    return this.vaccineRepo.remove(vaccine);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Weight } from './entities/weight.entity';
import { Repository } from 'typeorm';
import { CreateWeightDto } from './dto/create-weight.dto';

@Injectable()
export class WeightService {
  constructor(
    @InjectRepository(Weight)
    private readonly weightRepo: Repository<Weight>,
  ) {}

  async create(weightDto: CreateWeightDto) {
    const weight = this.weightRepo.create(weightDto);
    if (!weight) {
      throw new NotFoundException('Peso não registrado');
    }
    await this.weightRepo.save(weight);
  }

  async findAll() {
    return this.weightRepo.find({
      order: {
        createdAt: 'desc',
      },
    });
  }
  async findAllWeightFromOnePet(petId: string) {
    const weight = await this.weightRepo.find({
      where: {
        pet: { id: petId },
      },
      relations: ['pet'],
      order: {
        createdAt: 'DESC',
      },
    });

    if (weight.length === 0) {
      throw new NotFoundException('Pesos não encontrados');
    }

    return weight;
  }
}

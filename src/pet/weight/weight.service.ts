import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weight } from './entities/weight.entity';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';

@Injectable()
export class WeightService {
  constructor(
    @InjectRepository(Weight)
    private readonly weightRepository: Repository<Weight>,
  ) {}

  private async getWeightEntity(id: string, userId: string): Promise<Weight> {
    const weight = await this.weightRepository.findOne({
      where: { id, pet: { owner: { id: userId } } },
      relations: ['pet'],
    });

    if (!weight) {
      throw new NotFoundException('Registro de peso não encontrado');
    }
    return weight;
  }

  async create(dto: CreateWeightDto, userId: string) {
    const weight = this.weightRepository.create({
      ...dto,
      pet: { id: dto.petId },
    });

    const created = await this.weightRepository.save(weight);
    return created;
  }

  async findAllByUser(userId: string) {
    return this.weightRepository.find({
      where: { pet: { owner: { id: userId } } },
      relations: ['pet'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWeightFromOnePet(petId: string, userId: string) {
    return this.weightRepository.find({
      where: { pet: { id: petId, owner: { id: userId } } },
      relations: ['pet'],
      order: { createdAt: 'DESC' },
    });
  }

  async findLastWeights(petId: string, userId: string, limit = 10) {
    return this.weightRepository.find({
      where: { pet: { id: petId, owner: { id: userId } } },
      relations: ['pet'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async remove(id: string, userId: string) {
    const weight = await this.getWeightEntity(id, userId);
    await this.weightRepository.remove(weight);
  }
}

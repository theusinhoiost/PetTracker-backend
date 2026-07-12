import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { S3Service } from 'src/common/s3/s3.service';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    private readonly s3Service: S3Service,
  ) {}

  // ===========================
  // Helpers
  // ===========================

  private async mapPetWithImageUrl(pet: Pet) {
    const { imageKey, ...petWithoutKey } = pet;

    return {
      ...petWithoutKey,
      imageUrl: imageKey ? await this.s3Service.getSignedUrl(imageKey) : null,
    };
  }

  private async mapPetsWithImageUrl(pets: Pet[]) {
    return Promise.all(pets.map((pet) => this.mapPetWithImageUrl(pet)));
  }

  private async getPetEntity(id: string, userId: string): Promise<Pet> {
    const pet = await this.petRepository.findOne({
      where: {
        id,
        owner: { id: userId },
      },
      relations: ['owner'],
    });

    if (!pet) {
      throw new NotFoundException('Pet não encontrado');
    }

    return pet;
  }

  // ===========================
  // Regras de negócio
  // ===========================

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

  async create(dto: CreatePetDto, userId: string, file?: Express.Multer.File) {
    await this.failIfNameExists(dto.name, userId);

    let imageKey: string | null = null;
    if (file) {
      imageKey = await this.s3Service.uploadFile(file);
    } else {
      console.log('Nenhuma imagem enviada');
    }

    const pet = this.petRepository.create({
      name: dto.name,
      birthDate: dto.birthDate,
      race: dto.race,
      species: dto.species,
      imageKey,
      owner: { id: userId },
    });

    const createdPet = await this.petRepository.save(pet);

    return this.mapPetWithImageUrl(createdPet);
  }

  async getPetImageUrl(petId: string): Promise<string | null> {
    const pet = await this.petRepository.findOne({
      where: { id: petId },
    });

    if (!pet?.imageKey) {
      return null;
    }

    return this.s3Service.getSignedUrl(pet.imageKey);
  }

  // ===========================
  // Consultas
  // ===========================

  async findOneByID(id: string, userId: string) {
    const pet = await this.getPetEntity(id, userId);

    return this.mapPetWithImageUrl(pet);
  }

  async findAllPetsFromOneUser(userId: string) {
    const pets = await this.petRepository.find({
      where: {
        owner: { id: userId },
      },
      relations: ['owner'],
      order: {
        name: 'ASC',
      },
    });

    return this.mapPetsWithImageUrl(pets);
  }

  async findAll() {
    const pets = await this.petRepository.find({
      relations: ['owner'],
    });

    return this.mapPetsWithImageUrl(pets);
  }

  // ===========================
  // Atualização
  // ===========================

  async update(id: string, dto: UpdatePetDto, userId: string) {
    const pet = await this.getPetEntity(id, userId);

    if (dto.race) {
      pet.race = dto.race;
    }

    const updatedPet = await this.petRepository.save(pet);

    return this.mapPetWithImageUrl(updatedPet);
  }

  // ===========================
  // Exclusão
  // ===========================

  async remove(id: string, userId: string) {
    const pet = await this.getPetEntity(id, userId);

    if (pet.imageKey) {
      await this.s3Service.deleteFile(pet.imageKey);
    }

    await this.petRepository.delete({
      id: pet.id,
    });
  }
}

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
import { S3Service } from 'src/common/s3/s3.service';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    private readonly s3Service: S3Service,
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
  async getPetImageUrl(petId: string): Promise<string | null> {
    const pet = await this.petRepository.findOne({ where: { id: petId } });
    if (!pet?.imageKey) return null;

    return this.s3Service.getSignedUrl(pet.imageKey, 3600); // 1 hora
  }
  async create(dto: CreatePetDto, userId: string, file: Express.Multer.File) {
    await this.failIfNameExists(dto.name, userId);

    const imageKey = await this.s3Service.uploadFile(file);

    const newPet = this.petRepository.create({
      name: dto.name,
      birthDate: dto.birthDate,
      race: dto.race,
      species: dto.species,
      imageKey,
      owner: { id: userId },
    });

    const createdPet = await this.petRepository.save(newPet);
    return createdPet;
  }

  async findOneByID(id: string, userId: string) {
    const pet = await this.petRepository.findOne({
      where: {
        id,
        owner: { id: userId },
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet não encontrado');
    }

    let imageUrl: string | null = null;

    if (pet.imageKey) {
      try {
        imageUrl = await this.s3Service.getSignedUrl(pet.imageKey, 3600);
      } catch (error) {
        console.error('Erro ao gerar signed URL:', error);
        imageUrl = null;
      }
    }

    return {
      ...pet,
      imageUrl,
    };
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

    if (dto.race) pet.name = dto.race;

    return this.petRepository.save(pet);
  }

  async remove(id: string, userId: string) {
    const pet = await this.findOneByID(id, userId);

    if (pet.imageKey) {
      try {
        await this.s3Service.deleteFile(pet.imageKey);
      } catch (error) {
        console.error('Erro ao excluir imagem do S3:', error);
      }
    }

    await this.petRepository.remove(pet);
  }
}

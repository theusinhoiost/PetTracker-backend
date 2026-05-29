import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { VaccineModule } from './vaccine/vaccine.module';
import { WeightModule } from './weight/weight.module';
import { Weight } from './weight/entities/weight.entity';
import { Vaccine } from './vaccine/entities/vaccine.entity';
import { S3Service } from 'src/common/s3/s3.service';
import { S3Module } from 'src/common/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet]),
    TypeOrmModule.forFeature([Weight]),
    TypeOrmModule.forFeature([Vaccine]),
    UserModule,
    VaccineModule,
    WeightModule,
    S3Module,
  ],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}

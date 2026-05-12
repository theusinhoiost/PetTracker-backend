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

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet]),
    TypeOrmModule.forFeature([Weight]),
    TypeOrmModule.forFeature([Vaccine]),
    UserModule,
    VaccineModule,
    WeightModule,
  ],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}

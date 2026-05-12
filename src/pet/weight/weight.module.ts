import { Module } from '@nestjs/common';
import { WeightService } from './weight.service';
import { WeightController } from './weight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weight } from './entities/weight.entity';
import { Pet } from '../entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Weight, Pet])],
  controllers: [WeightController],
  providers: [WeightService],
  exports: [WeightService],
})
export class WeightModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WeightService } from './weight.service';
import { CreateWeightDto } from './dto/create-weight.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('weight')
@ApiBearerAuth()
@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}
  @Get()
  finAll() {
    return this.weightService.findAll();
  }
  @Post()
  create(@Body() dto: CreateWeightDto) {
    return this.weightService.create(dto);
  }

  @Get(':petId')
  findByPet(@Param('petId') petId: string) {
    return this.weightService.findAllWeightFromOnePet(petId);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weightService.remove(id);
  }
}

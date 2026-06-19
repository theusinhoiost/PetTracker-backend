import {
  Body,
  Request,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VaccineService } from './vaccine.service';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('vaccines')
@ApiBearerAuth()
@Controller('vaccines')
export class VaccineController {
  constructor(private readonly vaccineService: VaccineService) {}

  @Post()
  create(@Body() dto: CreateVaccineDto, @Request() req: AuthenticatedRequest) {
    return this.vaccineService.create(dto, req.user.id);
  }

  @Get(':petId')
  findAllByPet(@Param('petId') petId: string) {
    return this.vaccineService.findAllByPet(petId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vaccineService.remove(id);
  }
}

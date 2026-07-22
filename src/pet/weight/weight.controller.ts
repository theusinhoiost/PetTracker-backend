import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WeightService } from './weight.service';
import { CreateWeightDto } from './dto/create-weight.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@ApiTags('weight')
@ApiBearerAuth()
@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.weightService.findAllByUser(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateWeightDto, @Req() req: AuthenticatedRequest) {
    return this.weightService.create(dto, req.user.id);
  }

  @Get(':petId')
  findByPet(@Param('petId') petId: string, @Req() req: AuthenticatedRequest) {
    return this.weightService.findAllWeightFromOnePet(petId, req.user.id);
  }

  @Get(':petId/last')
  findLastWeights(
    @Param('petId') petId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.weightService.findLastWeights(petId, req.user.id, 10);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.weightService.remove(id, req.user.id);
  }
}

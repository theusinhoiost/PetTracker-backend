import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Get,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';

@UseGuards(JwtAuthGuard)
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}
  @Post()
  create(@Body() dto: CreatePetDto, @Request() req: AuthenticatedRequest) {
    return this.petService.create(dto, req.user.id);
  }
  @Get(':id')
  getById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.petService.findOneByID(id, req.user.id);
  }
  @Get('all/:id')
  getAllPetsFromUser(@Request() req: AuthenticatedRequest) {
    return this.petService.findAllPetsFromOneUser(req.user.id);
  }
  @Delete()
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.petService.remove(id, req.user.id);
  }
}

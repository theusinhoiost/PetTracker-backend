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
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdatePetDto } from './dto/update-pet.dto';
@ApiBearerAuth()
@ApiTags('pets')
@UseGuards(JwtAuthGuard)
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}
  @Post()
  @UseInterceptors(FileInterceptor('pet-img'))
  create(
    @Body() dto: CreatePetDto,
    @Request() req: AuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(png|jpeg|webp|jpg)$/,
        })
        .addMaxSizeValidator({
          maxSize: 3 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    console.log(file?.mimetype);
    console.log(file?.originalname);
    return this.petService.create(dto, req.user.id, file);
  }
  @Get(':id')
  getById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.petService.findOneByID(id, req.user.id);
  }
  @Get()
  getAllPetsFromUser(@Request() req: AuthenticatedRequest) {
    return this.petService.findAllPetsFromOneUser(req.user.id);
  }
  @Delete(':id')
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.petService.remove(id, req.user.id);
  }
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePetDto: UpdatePetDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.petService.update(id, updatePetDto, req.user.id);
  }
}

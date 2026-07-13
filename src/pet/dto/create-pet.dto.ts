import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxDate,
} from 'class-validator';
import { PetSpecies } from '../types/pet-species';

export class CreatePetDto {
  @IsString({ message: 'Nome inválido' })
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  name!: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @Type(() => Date)
  @IsDate({ message: 'Data inválida' })
  @MaxDate(new Date(), { message: 'Data não pode ser no futuro!' })
  birthDate!: Date;
  @IsOptional()
  @IsString()
  notes?: string;
  @IsString({ message: 'Raça inválida' })
  @IsNotEmpty({ message: 'Raça não pode ser vazia' })
  race!: string;

  @IsEnum(PetSpecies, { message: 'Espécie inválida' })
  species!: PetSpecies;
}

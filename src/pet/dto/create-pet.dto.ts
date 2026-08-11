import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PetSpecies } from '../types/pet-species';
import { IsNotFutureDate } from 'src/common/validators/is-not-future-date';

export class CreatePetDto {
  @IsString({ message: 'Nome inválido' })
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  name!: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @IsDateString({}, { message: 'Data inválida' })
  @IsNotFutureDate()
  birthDate!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString({ message: 'Raça inválida' })
  @IsNotEmpty({ message: 'Raça não pode ser vazia' })
  race!: string;

  @IsEnum(PetSpecies, { message: 'Espécie inválida' })
  species!: PetSpecies;
}

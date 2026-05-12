import { IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateVaccineDto {
  @IsString()
  name!: string;

  @IsDateString()
  applicationDate!: Date;

  @IsUUID()
  petId!: string;
}

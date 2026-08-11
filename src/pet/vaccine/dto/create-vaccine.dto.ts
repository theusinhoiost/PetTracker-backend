import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVaccineDto {
  @IsString()
  vaccineName!: string;

  @IsDateString()
  applicationDate!: string;

  @IsDateString()
  @IsOptional()
  nextDueDate?: string;

  @IsUUID()
  petId!: string;
}

import { IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateVaccineDto {
  @IsString()
  vaccineName!: string;

  @IsDateString()
  applicationDate!: Date;
  @IsDateString()
  nextDueDate!: Date;

  @IsUUID()
  petId!: string;
}

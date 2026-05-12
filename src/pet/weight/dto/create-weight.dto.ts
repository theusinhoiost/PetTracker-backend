import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateWeightDto {
  @IsUUID()
  petId!: string;
  @IsNumber()
  @IsNotEmpty()
  value!: number;
}

import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @IsString({ message: "Não pode ser inválido" })
  @IsNotEmpty({ message: "Não pode ser vazio" })
  currentPassword: string;
  @MinLength(6, { message: "Mínimo de 6 caracteres " })
  @IsString({ message: "Não pode ser inválido" })
  @IsNotEmpty({ message: "Não pode ser vazio" })
  newPassword: string
}

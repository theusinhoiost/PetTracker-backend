import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "Não pode ser inválido" })
  @IsNotEmpty({ message: "Não pode ser vazio" })
  name: string;
  @IsEmail({ allow_ip_domain: false }, { message: "Precisa ser um email válido" })
  @IsNotEmpty({ message: "Não pode ser vazio" })
  email: string;
  @MinLength(6, { message: "Mínimo de 6 caracteres " })
  @IsString({ message: "Não pode ser inválido" })
  @IsNotEmpty({ message: "Não pode ser vazio" })
  password: string;
  @IsPhoneNumber('BR', { message: "Precisa de um telefone válido" })
  phoneNumber: string;
}

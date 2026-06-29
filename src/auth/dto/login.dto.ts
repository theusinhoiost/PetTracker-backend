import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail(
    { allow_ip_domain: false },
    { message: 'Precisa ser um email válido' },
  )
  @IsNotEmpty({ message: 'Precisa ser um email válido' })
  email!: string;
  @IsString({ message: 'Não pode ser uma senha inválida' })
  password!: string;
}

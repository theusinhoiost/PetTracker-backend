import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Não pode ser inválido' })
  @IsNotEmpty({ message: 'Não pode ser vazio' })
  name!: string;

  //

  @IsEmail(
    { allow_ip_domain: false },
    { message: 'Precisa ser um email válido' },
  )
  @IsNotEmpty({ message: 'Não pode ser vazio' })
  email!: string;

  //

  @MinLength(6, { message: 'Mínimo de 6 caracteres ' })
  @MaxLength(32, { message: 'Máximo de 32 caracteres ' })
  @IsString({ message: 'Não pode ser inválido' })
  @IsNotEmpty({ message: 'Não pode ser vazio' })
  @IsStrongPassword(
    { minNumbers: 1, minSymbols: 1, minUppercase: 1 },
    { message: 'Caracteres inválidos ' },
  )
  password!: string;
  //
  @IsMobilePhone(
    'pt-BR',
    { strictMode: false },
    { message: 'Número de telefone inválido' },
  )
  phone!: string;
}

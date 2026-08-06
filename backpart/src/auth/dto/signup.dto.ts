import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(25, { message: '25 caractères maximum.' })
  username: string;

  @IsEmail({}, { message: 'Cet email est invalide.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  email: string;

  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(8, { message: 'Au moins 8 caractères.' })
  password: string;

  @IsOptional()
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @IsEnum(['admin', 'user'], { message: 'Mettre soit admin ou user.' })
  role: 'admin' | 'user';
}

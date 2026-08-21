import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString({ message: 'Ce doit être une chaîne de caractère.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(25, { message: '25 caractères maximum.' })
  username: string;

  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(8, { message: 'Au moins 8 caractères.' })
  @MaxLength(25, { message: '25 caractères maximum.' })
  password: string;

  @IsEmail({}, { message: 'Cet email est invalide.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  email: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Rôle invalide.' })
  role?: Role;
}

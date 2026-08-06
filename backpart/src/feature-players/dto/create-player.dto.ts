import {
  IsString,
  IsInt,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsPositive,
  IsDate,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlayerDto {
  @IsString({ message: 'ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(50, { message: '50 caractères maximum.' })
  firstname: string;

  @IsString({ message: 'ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(50, { message: '50 caractères maximum.' })
  lastname: string;

  @IsEmail({}, { message: 'Cet email est invalide.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  email: string;

  @IsString({ message: 'ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(8, { message: 'Au moins 8 caractères.' })
  @MaxLength(120, { message: '120 caractères maximum.' })
  address: string;

  @IsOptional()
  @IsInt({ message: 'Ce doit être un nombre.' })
  @IsPositive()
  age: number;

  @IsDate({ message: 'Ce doit être une date.' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  dob: Date;

  @IsString({ message: 'ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  position: string;

  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @IsInt({ message: 'Ce doit être un nombre.' })
  @IsPositive()
  nbGoal: number;

  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @IsInt({ message: 'Ce doit être un nombre.' })
  @IsPositive()
  nbAssist: number;

  @IsOptional()
  @IsInt({ message: 'Ce doit être un nombre.' })
  @IsPositive()
  nbGame: number;
}

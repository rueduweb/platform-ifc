import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreatePartnerDto {
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(50, { message: '50 caractères maximum.' })
  name: string;

  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(8, { message: 'Au moins 8 caractères.' })
  @MaxLength(200, { message: '200 caractères maximum.' })
  description: string;

  @IsEmail({}, { message: 'Cet email est invalide.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  logo: string;

  @IsOptional()
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  video: string;

  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(8, { message: 'Au moins 8 caractères.' })
  @MaxLength(2000, { message: '2000 caractères maximum.' })
  activity: string;

  @IsOptional()
  @MinLength(8, { message: 'Au moins 8 caractères.' })
  @MaxLength(120, { message: '120 caractères maximum.' })
  address: string;

  @IsOptional()
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(50, { message: '50 caractères maximum.' })
  contact: string;

  @IsOptional()
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(120, { message: '120 caractères maximum.' })
  socialMedia: string;
}

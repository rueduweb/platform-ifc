import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Cet email est invalide.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  email: string;

  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(8, { message: 'Au moins 8 caractères.' })
  password: string;
}

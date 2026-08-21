import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMeDto {
  @IsOptional()
  @IsString({ message: 'Ce doit être une chaîne de caractère.' })
  @IsNotEmpty({ message: 'Ce champ ne peut pas être vide.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(25, { message: '25 caractères maximum.' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Cet email est invalide.' })
  email?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Ce champ ne peut pas être vide.' })
  @MinLength(8, { message: 'Au moins 8 caractères.' })
  @MaxLength(25, { message: '25 caractères maximum.' })
  password?: string;
}

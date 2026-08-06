import {
  IsString,
  IsInt,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class CreateArticleDto {
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(50, { message: '50 caractères maximum.' })
  title: string;

  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(200, { message: '200 caractères maximum.' })
  description: string;

  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(2000, { message: 'Texte beaucoup trop long.' })
  content: string;

  @IsInt({ message: 'Ce doit être un nombre.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @IsPositive()
  authorId: number;
}

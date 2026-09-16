import {
  IsString,
  IsInt,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsDate,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGameDto {
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(50, { message: '50 caractères maximum.' })
  location: string;

  @IsDate({ message: 'Ce doit être une date.' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  date: string;

  @IsOptional()
  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  gameNum: string;

  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(50, { message: '50 caractères maximum.' })
  homeTeam: string;

  @IsString({ message: 'Ce doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @MinLength(3, { message: 'Au moins 3 caractères.' })
  @MaxLength(50, { message: '50 caractères maximum.' })
  awayTeam: string;

  @IsInt({ message: 'Ce doit être un nombre.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @Min(0)
  nbGoalHome: number;

  @IsInt({ message: 'Ce doit être un nombre.' })
  @IsNotEmpty({ message: 'Ce champ est requis.' })
  @Min(0)
  nbGoalAway: number;

  @IsOptional()
  @IsString()
  note: string;

  @IsBoolean()
  forfeit: boolean;
}

import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateFeatureTeamDto {
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nbW?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nbD?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nbL?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nbGoal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nbConce?: number;
}

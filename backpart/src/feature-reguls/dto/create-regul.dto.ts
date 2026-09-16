import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRegulDto {
  @IsString()
  @IsNotEmpty()
  license!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  amount?: number;
}

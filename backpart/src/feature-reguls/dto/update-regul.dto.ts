import { IsInt, Min } from 'class-validator';

export class UpdateRegulDto {
  @IsInt()
  @Min(1)
  amount!: number;
}

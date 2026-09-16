import { IsInt, Min } from 'class-validator';

export class AddRegulPieceDto {
  @IsInt()
  @Min(1)
  amount!: number;
}

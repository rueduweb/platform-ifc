import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  rank: number;

  @IsInt()
  @Min(0)
  pts: number;

  @IsInt()
  @Min(0)
  nbW: number;

  @IsInt()
  @Min(0)
  nbD: number;

  @IsInt()
  @Min(0)
  nbL: number;

  @IsInt()
  @Min(0)
  nbGoal: number;

  @IsInt()
  @Min(0)
  nbConce: number;

  @IsInt()
  avg: number;
}

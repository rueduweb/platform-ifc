import { IsInt, Min } from 'class-validator';

export class DeleteUserDto {
  @IsInt({
    message: "L'identifiant du nouvel auteur doit être un entier.",
  })
  @Min(1, {
    message: "L'identifiant doit être supérieur à 0.",
  })
  transferArticlesToUserId: number;
}

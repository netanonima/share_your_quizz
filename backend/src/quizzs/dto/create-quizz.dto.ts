import { IsNotEmpty, IsInt, IsDateString } from 'class-validator';

export class CreateQuizzDto {
  @IsNotEmpty()
  @IsInt()
  readonly fk_user_id: number;

  @IsNotEmpty()
  @IsDateString()
  readonly created_on: string;
}

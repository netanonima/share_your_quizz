import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsInt()
  readonly fk_quizz_id: number;

  @IsNotEmpty()
  @IsInt()
  readonly started_on: number;

  @IsNotEmpty()
  @IsInt()
  readonly finished_on: number;

  @IsNotEmpty()
  @IsString()
  readonly winner_username: string;

  @IsNotEmpty()
  @IsInt()
  readonly winner_points: number;
}

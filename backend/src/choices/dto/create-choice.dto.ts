import { IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class CreateChoiceDto {
  @IsNotEmpty()
  readonly choice: string;

  @IsBoolean()
  readonly is_correct: boolean;

  @IsNumber()
  readonly fk_question_id: number;
}

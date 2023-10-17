import {IsNotEmpty, IsBoolean, IsString, IsInt} from 'class-validator';

export class CreateChoiceDto {
  @IsNotEmpty()
  @IsString()
  readonly choice: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_correct: boolean;

  @IsNotEmpty()
  @IsInt()
  readonly fk_question_id: number;
}

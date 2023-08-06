import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsInt,
  ValidateNested,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateChoiceDto {
  @IsNotEmpty()
  @IsString()
  choice: string;

  @IsNotEmpty()
  is_correct: boolean;
}

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsInt()
  quizzId: number;

  @IsNotEmpty()
  @IsString()
  question: string;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChoiceDto)
  choices: CreateChoiceDto[];
}

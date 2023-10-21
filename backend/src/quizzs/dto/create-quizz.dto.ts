import { CreateQuestionDto } from "questions/dto/create-question.dto";
import {IsDateString, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateQuizzDto {
  @IsOptional()
  @IsInt()
  readonly id?: number;

  @IsNotEmpty()
  @IsString()
  readonly quizz: string;

  @IsOptional()
  @IsDateString()
  readonly created_on?: Date;

  @IsOptional()
  @IsDateString()
  readonly modified_on?: Date | null;

  @IsOptional()
  @IsDateString()
  readonly deleted_on?: Date | null;

  @IsNotEmpty()
  @IsInt()
  readonly userId: number;

  readonly questions: CreateQuestionDto[];
}
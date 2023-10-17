import { CreateQuestionDto } from "questions/dto/create-question.dto";
import {IsDateString, IsInt, IsNotEmpty, IsOptional} from "class-validator";

export class CreateQuizzDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsDateString()
  created_on?: Date;

  @IsOptional()
  @IsDateString()
  modified_on?: Date;

  @IsOptional()
  @IsDateString()
  deleted_on?: Date | null;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  question: CreateQuestionDto[];
}
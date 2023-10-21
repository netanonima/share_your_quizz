import { CreateQuestionDto } from "questions/dto/create-question.dto";
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateQuizzDto {
  @IsOptional()
  @IsInt()
  readonly id?: number;

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
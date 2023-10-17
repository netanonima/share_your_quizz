import { CreateQuestionDto } from "questions/dto/create-question.dto";

export class CreateQuizzDto {
  id?: number;
  created_on?: Date;
  modified_on?: Date;
  deleted_on?: Date | null;
  userId: number;
  question: CreateQuestionDto[];
}
import {IsNotEmpty, IsString} from "class-validator";

export class CreateQuizzDto {
  @IsNotEmpty()
  @IsString()
  readonly quizz: string;
}
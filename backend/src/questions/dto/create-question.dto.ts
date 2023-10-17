import { CreateChoiceDto } from "choices/dto/create-choice.dto";
import { CreateMediaDto } from "medias/dto/create-media.dto";
import { CreateImageDto } from "images/dto/create-image.dto";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  readonly question: string;

  readonly choice: CreateChoiceDto[];
  readonly media: CreateMediaDto;
  readonly image: CreateImageDto;
}

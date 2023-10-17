import { CreateChoiceDto } from "choices/dto/create-choice.dto";
import { CreateMediaDto } from "medias/dto/create-media.dto";
import { CreateImageDto } from "images/dto/create-image.dto";

export class CreateQuestionDto {
  question: string;
  choice: CreateChoiceDto[];
  media: CreateMediaDto[];
  image: CreateImageDto[];
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
}

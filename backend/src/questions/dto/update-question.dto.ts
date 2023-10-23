import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import {IsOptional, IsString} from "class-validator";

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
    @IsOptional()
    @IsString()
    readonly media: string;
}

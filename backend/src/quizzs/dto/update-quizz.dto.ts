import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizzDto } from './create-quizz.dto';
import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateQuizzDto extends PartialType(CreateQuizzDto) {
    @IsOptional()
    @IsString()
    readonly quizz: string;

    @IsOptional()
    @IsBoolean()
    readonly param_shuffle_questions: boolean;

    @IsOptional()
    @IsBoolean()
    readonly param_shuffle_choices: boolean;
}

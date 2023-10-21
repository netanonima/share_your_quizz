import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizzDto } from './create-quizz.dto';
import {IsDateString, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateQuizzDto extends PartialType(CreateQuizzDto) {
    deleted?: boolean;

    @IsOptional()
    @IsString()
    readonly quizz: string;

    @IsOptional()
    @IsDateString()
    readonly created_on?: Date | null;
}

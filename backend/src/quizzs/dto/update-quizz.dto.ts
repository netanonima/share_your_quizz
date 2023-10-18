import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizzDto } from './create-quizz.dto';
import {IsDateString, IsInt, IsNotEmpty, IsOptional} from "class-validator";

export class UpdateQuizzDto extends PartialType(CreateQuizzDto) {
    @IsOptional()
    @IsDateString()
    readonly created_on?: Date | null;

    @IsOptional()
    @IsInt()
    readonly userId: number | null;
}

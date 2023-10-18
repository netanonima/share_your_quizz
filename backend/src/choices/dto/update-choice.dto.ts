import { PartialType } from '@nestjs/mapped-types';
import { CreateChoiceDto } from './create-choice.dto';
import {IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateChoiceDto extends PartialType(CreateChoiceDto) {
    id?: number;
    deleted?: boolean;

    @IsOptional()
    @IsString()
    readonly choice: string | null;

    @IsOptional()
    @IsBoolean()
    readonly is_correct: boolean | null;

    @IsOptional()
    @IsInt()
    readonly fk_question_id: number | null;
}

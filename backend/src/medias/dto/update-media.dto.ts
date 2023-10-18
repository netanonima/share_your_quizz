import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaDto } from './create-media.dto';
import {IsInt, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateMediaDto extends PartialType(CreateMediaDto) {
    id?: number;
    deleted?: boolean;

    @IsOptional()
    @IsInt()
    readonly fk_question_id: number | null;

    @IsOptional()
    @IsString()
    readonly file_path: string | null;

    @IsOptional()
    @IsString()
    readonly filename: string | null;

    @IsOptional()
    @IsNumber()
    readonly size: number | null;

    @IsOptional()
    @IsString()
    readonly type: string | null;

    @IsOptional()
    @IsString()
    readonly extension: string | null;
}

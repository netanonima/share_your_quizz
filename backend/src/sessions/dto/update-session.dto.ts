import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-session.dto';
import {IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateSessionDto {
    @IsNotEmpty()
    @IsString()
    readonly winner_username: string;

    @IsNotEmpty()
    @IsInt()
    readonly winner_points: number;
}

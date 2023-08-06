import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsInt()
  readonly fk_question_id: number;

  @IsNotEmpty()
  @IsString()
  readonly file_path: string;

  @IsNotEmpty()
  @IsString()
  readonly filename: string;

  @IsNotEmpty()
  @IsNumber()
  readonly size: number;

  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly extension: string;
}

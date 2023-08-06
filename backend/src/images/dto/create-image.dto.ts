import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateImageDto {
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
  @IsInt()
  readonly size: number;

  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly extension: string;
}

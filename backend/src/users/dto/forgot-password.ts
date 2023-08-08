import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @MinLength(4)
  @MaxLength(24)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsString()
  @IsOptional()
  confirmation_token?: string;
}

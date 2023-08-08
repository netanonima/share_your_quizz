import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class ConfirmAccountDto {
  @IsString()
  @MinLength(4)
  @MaxLength(24)
  username: string;

  @IsString()
  @IsOptional()
  confirmation_token?: string;
}

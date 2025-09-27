import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(24)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'Username: only letters (no accents), numbers, underscores (_) and dashes (-) are allowed',
  })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  language: string;
}

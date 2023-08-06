import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(24)
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
  confirmation_token?: string;

  @IsOptional()
  confirm_before?: Date;

  @IsOptional()
  account_confirmed_on?: Date;

  @IsOptional()
  deleted_on?: Date;

  @IsOptional()
  is_super_admin?: boolean;
}

import {
  IsString,
  IsEmail,
} from 'class-validator';

export class ForgotPasswordRetrieveDto {
  @IsString()
  @IsEmail()
  email: string;
}

import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsInt()
  readonly quizzId: number;
}

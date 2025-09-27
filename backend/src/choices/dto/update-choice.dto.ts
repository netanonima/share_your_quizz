import { PartialType } from '@nestjs/mapped-types';
import { CreateChoiceDto } from './create-choice.dto';

export class UpdateChoiceDto extends PartialType(CreateChoiceDto) {}

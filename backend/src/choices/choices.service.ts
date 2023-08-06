import { Injectable } from '@nestjs/common';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';

@Injectable()
export class ChoicesService {
  create(createChoiceDto: CreateChoiceDto) {
    return 'This action adds a new choice';
  }

  findAll() {
    return `This action returns all choices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} choice`;
  }

  update(id: number, updateChoiceDto: UpdateChoiceDto) {
    return `This action updates a #${id} choice`;
  }

  remove(id: number) {
    return `This action removes a #${id} choice`;
  }
}

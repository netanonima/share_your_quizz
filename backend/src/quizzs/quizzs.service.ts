import { Injectable } from '@nestjs/common';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';

@Injectable()
export class QuizzsService {
  create(createQuizzDto: CreateQuizzDto) {
    return 'This action adds a new quizz';
  }

  findAll() {
    return `This action returns all quizzs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quizz`;
  }

  update(id: number, updateQuizzDto: UpdateQuizzDto) {
    return `This action updates a #${id} quizz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizz`;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';
import { Quizz } from './entities/quizz.entity';
import { User } from "users/entities/user.entity";

@Injectable()
export class QuizzsService {
  constructor(
      @InjectRepository(Quizz)
      private readonly quizzRepository: Repository<Quizz>,
  ) {}
  create(createQuizzDto: CreateQuizzDto) {
    return 'This action adds a new quizz';
  }

  findAll(user: User): Promise<Quizz[]> {
    return this.quizzRepository.find({ where: { user: user } });
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

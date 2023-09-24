import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {Question} from "questions/entities/question.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Quizz} from "quizzs/entities/quizz.entity";

@Injectable()
export class QuestionsService {
  constructor(
      @InjectRepository(Question)
      private readonly questionRepository: Repository<Question>,
      @InjectRepository(Quizz)
      private readonly quizzRepository: Repository<Quizz>,
  ) {}

  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question';
  }

  async findAll(quizzId, user): Promise<Question[]> {
    const quizz = await this.quizzRepository.findOne({ where: { id: quizzId, user: user } });
    if (!quizz) {
      throw new Error('Quizz not found or you do not have permission');
    }

    const question = await this.questionRepository.find({ where: { quizz: quizz } });
    if (!question) {
      throw new Error('Question not found');
    }

    return question;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}

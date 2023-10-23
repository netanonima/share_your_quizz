import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {Question} from "questions/entities/question.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Quizz} from "quizzs/entities/quizz.entity";
import {User} from "users/entities/user.entity";

@Injectable()
export class QuestionsService {
  constructor(
      @InjectRepository(Question)
      private readonly questionRepository: Repository<Question>,
      @InjectRepository(Quizz)
      private readonly quizzRepository: Repository<Quizz>,
  ) {}

  create(createQuestionDto: CreateQuestionDto, user: User) {
    const question = new Question();
    question.question = createQuestionDto.question;
    return this.questionRepository.save(question);
  }

  async findAllByQuizz(quizzId, UpdateQuestionDto:UpdateQuestionDto, user:User): Promise<Question[]> {
    const quizz = await this.quizzRepository.findOne({
      where: {
        id: quizzId, user: user
      }
    });
    if (!quizz) {
      throw new Error('Quizz not found or you do not have permission');
    }

    const question = await this.questionRepository.find({
      where: {
        quizz: quizz
      },
      select: ['id', 'question']
    });
    if (!question) {
      throw new Error('Question not found');
    }

    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto, user:User) {

    return `This action updates a #${id} question`;
  }

  async remove(id: number, user:User) {
    return `This action removes a #${id} question`;
  }
}

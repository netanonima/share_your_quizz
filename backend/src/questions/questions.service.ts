import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
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

  async create(quizzId, createQuestionDto: CreateQuestionDto, user: User) {
    const quizz = await this.quizzRepository.findOne({
        where: {
            id: quizzId, user: { id: user.id }
        }
    });
    if(!quizz) {
        throw new NotFoundException('Quizz not found');
    }
    const question = new Question();
    question.question = createQuestionDto.question;
    question.quizz = quizz;
    return await this.questionRepository.save(question);
  }

  async findAllByQuizz(quizzId, user:User): Promise<Question[]> {
    const quizz = await this.quizzRepository.findOne({
      where: {
        id: quizzId, user: { id: user.id }
      }
    });
    if (!quizz) {
      throw new NotFoundException('Quizz not found');
    }

    const question = await this.questionRepository.find({
      where: {
        quizz: quizz
      },
      select: ['id', 'question']
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto, user:User) {
    const question = await this.questionRepository.findOne({
        where: {
            id: id
        },
        relations: ['quizz', 'quizz.user']
    });
    if(!question) {
        throw new NotFoundException('Question not found');
    }
    if(question.quizz.user.id !== user.id) {
        throw new ForbiddenException('You do not have permission');
    }
    question.question = updateQuestionDto.question;
    return await this.questionRepository.save(question);
  }

  async remove(id: number, user:User) {
    const question = await this.questionRepository.findOne({
      where: {
        id: id
      },
      relations: ['quizz', 'quizz.user']
    });
    if(!question) {
      throw new NotFoundException('Question not found');
    }
    if(question.quizz.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission');
    }
    await this.questionRepository.remove(question);
  }
}

import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {Question} from "questions/entities/question.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Quizz} from "quizzs/entities/quizz.entity";
import {User} from "users/entities/user.entity";
import {Media} from "medias/entities/media.entity";

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
      select: ['id', 'question', 'media'],
      relations: ['media']
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
    question.quizz.modified_on = new Date();
    if(updateQuestionDto.media) {
      let media = new Media();
      // extract mime type from base64 string(media)
      const mimeType = updateQuestionDto.media.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
      // extract extension from mime type

      // todo: convert audio to mp3, video to mp4 and image to png
      // todo: generate the file on the right folder
      // todo: set file_path, filename, size, type and extension
      // todo: add a duration attribute and set it

    }
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

    question.quizz.modified_on = new Date();
    await this.quizzRepository.save(question.quizz);

    await this.questionRepository.remove(question);
  }
}

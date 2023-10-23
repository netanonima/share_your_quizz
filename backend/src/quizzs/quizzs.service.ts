import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateQuizzDto} from './dto/create-quizz.dto';
import {UpdateQuizzDto} from './dto/update-quizz.dto';

import {Quizz} from './entities/quizz.entity';
import {Question} from "questions/entities/question.entity";
import {Choice} from "choices/entities/choice.entity";
import {Media} from "medias/entities/media.entity";
import {User} from "users/entities/user.entity";
import moment from "moment";

@Injectable()
export class QuizzsService {
  constructor(
      @InjectRepository(Quizz)
      private quizzRepository: Repository<Quizz>,
      @InjectRepository(Question)
      private questionRepository: Repository<Question>,
      @InjectRepository(Choice)
      private choiceRepository: Repository<Choice>,
      @InjectRepository(Media)
      private mediaRepository: Repository<Media>
  ) {}
  async create(currentUser: User, createQuizzDto: CreateQuizzDto): Promise<Quizz> {
    const quizz = new Quizz();
    quizz.quizz = createQuizzDto.quizz;
    quizz.user = currentUser;
    quizz.created_on = new Date();

    return await this.quizzRepository.save(quizz);
  }

  async findAll(user: User): Promise<Quizz[]> {
    return this.quizzRepository.find({
      where: { user: { id: user.id } },
      select: ['id', 'quizz', 'created_on', 'modified_on']
    });
  }

  async update(id: number, updateQuizzDto: UpdateQuizzDto, currentUser: User): Promise<Quizz> {
    const quizz = await this.quizzRepository.findOne({
        where: { id: id , user: { id: currentUser.id } },
    });
    if(!quizz) {
        throw new NotFoundException(`Quizz not found`);
    }
    quizz.quizz = updateQuizzDto.quizz;
    quizz.modified_on = new Date();
    return await this.quizzRepository.save(quizz);
  }

  async remove(id: number, currentUser: User): Promise<void> {
    const quizz = await this.quizzRepository.findOne({
      where: { id: id },
      relations: ['user', 'questions', 'questions.choices', 'questions.media'],
    });

    if (!quizz) {
      throw new NotFoundException(`Quizz with ID ${id} not found`);
    }

    if (quizz.user.id !== currentUser.id) {
      throw new ForbiddenException('You do not have permission to delete this quizz.');
    }

    const mediaIdsToRemove = [];

    for (const question of quizz.questions) {
      if (question.choices && question.choices.length > 0) {
        await this.choiceRepository.remove(question.choices);
      }
      if (question.media) {
        mediaIdsToRemove.push(question.media.id);
      }
    }

    if (quizz.questions && quizz.questions.length > 0) {
      await this.questionRepository.remove(quizz.questions);
    }

    if (mediaIdsToRemove.length > 0) {
      await this.mediaRepository.delete(mediaIdsToRemove);
    }

    await this.quizzRepository.remove(quizz);
  }

}

import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';
import { Quizz } from './entities/quizz.entity';
import {Question} from "questions/entities/question.entity";
import {Choice} from "choices/entities/choice.entity";
import {Media} from "medias/entities/media.entity";
import {Image} from "images/entities/image.entity";
import { User } from "users/entities/user.entity";

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
      private mediaRepository: Repository<Media>,
      @InjectRepository(Image)
      private imageRepository: Repository<Image>
  ) {}
  async create(createQuizzDto: CreateQuizzDto): Promise<Quizz> {
    const quizz = new Quizz();

    const questions = createQuizzDto.question.map(questionData => {
      const question = new Question();
      // Assign properties to question from questionData...

      const choices = questionData.choice.map(choiceData => {
        const choice = new Choice();
        // Assign properties to choice from choiceData...
        return choice;
      });

      question.choices = choices;
      return question;
    });

    quizz.questions = questions;

    return this.quizzRepository.save(quizz);
  }

  async findAll(user: User): Promise<Quizz[]> {
    return this.quizzRepository.find({
      where: { user: user },
      relations: ['questions', 'questions.choices', 'questions.media', 'questions.image']
    });
  }

  async findOne(id: number, currentUser: User): Promise<Quizz> {
    const quizz = await this.quizzRepository.findOne({ where: { id: id }, relations: ['user'] });
    if (!quizz) {
      throw new NotFoundException(`Quizz with ID ${id} not found`);
    }
    if (quizz.user.id !== currentUser.id) {
      throw new ForbiddenException('You do not have permission to view this quizz.');
    }
    return quizz;
  }

  async update(id: number, updateQuizzDto: UpdateQuizzDto, currentUser: User): Promise<Quizz> {
    const quizz = await this.quizzRepository.findOne({ where: { id: id }, relations: ['user'] });
    if (!quizz) {
      throw new NotFoundException(`Quizz with ID ${id} not found`);
    }
    if (quizz.user.id !== currentUser.id) {
      throw new ForbiddenException('You do not have permission to update this quizz.');
    }
    // Rest of the update logic...
    return this.quizzRepository.save(quizz);
  }


  async remove(id: number, currentUser: User): Promise<void> {
    const quizz = await this.quizzRepository.findOne({ where: { id: id }, relations: ['user'] });
    if (!quizz) {
      throw new NotFoundException(`Quizz with ID ${id} not found`);
    }
    if (quizz.user.id !== currentUser.id) {
      throw new ForbiddenException('You do not have permission to delete this quizz.');
    }
    await this.quizzRepository.remove(quizz);
  }

}

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
      private imageRepository: Repository<Image>,
      @InjectRepository(User)
      private userRepository: Repository<User>
  ) {}
  async create(createQuizzDto: CreateQuizzDto): Promise<Quizz> {
    const quizz = new Quizz();

    quizz.created_on = new Date(createQuizzDto.created_on);
    quizz.modified_on = createQuizzDto.modified_on ? new Date(createQuizzDto.modified_on) : null;
    quizz.deleted_on = createQuizzDto.deleted_on ? new Date(createQuizzDto.deleted_on) : null;

    const user = await this.userRepository.findOne({ where: { id: createQuizzDto.userId }});
    if (!user) {
      throw new NotFoundException(`User with id ${createQuizzDto.userId} not found`);
    }
    quizz.user = user;

    if(createQuizzDto.question){
      const questions = createQuizzDto.question.map(questionData => {
        const question = new Question();
        question.question = questionData.question;

        const choices = questionData.choice ? questionData.choice.map(choiceData => {
          const choice = new Choice();
          choice.choice = choiceData.choice;
          choice.is_correct = choiceData.is_correct;
          choice.question = question;
          return choice;
        }) : [];
        question.choices = choices;

        if(questionData.media){
          const media = new Media();
          media.file_path = questionData.media.file_path;
          media.filename = questionData.media.filename;
          media.size = questionData.media.size;
          media.type = questionData.media.type;
          media.extension = questionData.media.extension;
          question.media = media;
        }

        if(questionData.image){
          const image = new Image();
          image.file_path = questionData.image.file_path;
          image.filename = questionData.image.filename;
          image.size = questionData.image.size;
          image.type = questionData.image.type;
          image.extension = questionData.image.extension;
          question.image = image;
        }

        return question;
      });

      quizz.questions = questions;
    }

    let returnQuizz = await this.quizzRepository.save(quizz);
    returnQuizz.questions = null;
    return returnQuizz;
  }

  async findAll(user: User): Promise<Quizz[]> {
    return this.quizzRepository.find({
      where: { user: user },
      relations: ['questions', 'questions.choices', 'questions.medias', 'questions.images']
    });
  }

  async findOne(id: number, currentUser: User): Promise<Quizz> {
    const quizz = await this.quizzRepository.findOne({
      where: { id: id },
      relations: ['user', 'questions', 'questions.choices', 'questions.medias', 'questions.images']
    });
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

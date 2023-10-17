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

    const questions = createQuizzDto.question.map(questionData => {
      const question = new Question();
      question.question = questionData.question;

      const choices = questionData.choice.map(choiceData => {
        const choice = new Choice();
        choice.choice = choiceData.choice;
        choice.is_correct = choiceData.is_correct;
        choice.question = question; // Link the choice to the question
        return choice;
      });
      question.choices = choices;

      const medias = questionData.media.map(mediaData => {
        const media = new Media();
        media.file_path = mediaData.file_path;
        media.filename = mediaData.filename;
        media.size = mediaData.size;
        media.type = mediaData.type;
        media.extension = mediaData.extension;
        media.question = question;
        return media;
      });
      question.medias = medias;

      const images = questionData.image.map(imageData => {
        const image = new Image();
        image.file_path = imageData.file_path;
        image.filename = imageData.filename;
        image.size = imageData.size;
        image.type = imageData.type;
        image.extension = imageData.extension;
        image.question = question;
        return image;
      });
      question.images = images;

      question.quizz = quizz;

      return question;
    });

    quizz.questions = questions;

    return this.quizzRepository.save(quizz);
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

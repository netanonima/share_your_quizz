import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';

import { UpdateQuestionDto } from '../questions/dto/update-question.dto';
import { UpdateChoiceDto } from '../choices/dto/update-choice.dto';
import { UpdateMediaDto } from '../medias/dto/update-media.dto';
import { UpdateImageDto } from '../images/dto/update-image.dto';

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

    if(createQuizzDto.questions){
      const questions = createQuizzDto.questions.map(questionData => {
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
      where: { user: { id: user.id } },
      relations: ['questions', 'questions.choices', 'questions.media', 'questions.image']
    });
  }

  async findOne(id: number, currentUser: User): Promise<Quizz> {
    const quizz = await this.quizzRepository.findOne({
      where: { id: id },
      relations: ['user', 'questions', 'questions.choices', 'questions.media', 'questions.image']
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
    const quizz = await this.quizzRepository.findOne({ where: { id: id }, relations: ['user', 'questions', 'questions.choices', 'questions.media', 'questions.image'] });
    if (!quizz) {
      throw new NotFoundException(`Quizz with ID ${id} not found`);
    }
    if (quizz.user.id !== currentUser.id) {
      throw new ForbiddenException('You do not have permission to update this quizz.');
    }

    quizz.created_on = updateQuizzDto.created_on ? new Date(updateQuizzDto.created_on) : quizz.created_on;
    quizz.modified_on = updateQuizzDto.modified_on ? new Date(updateQuizzDto.modified_on) : quizz.modified_on;
    quizz.deleted_on = updateQuizzDto.deleted_on ? new Date(updateQuizzDto.deleted_on) : quizz.deleted_on;

    console.warn('_-Y-_');
    console.log(updateQuizzDto); // returns the whole input
    console.log(updateQuizzDto.questions); // returns : undefined
    if(updateQuizzDto.questions){
      console.warn('_-Z-_');
      for (const questionData of updateQuizzDto.questions as UpdateQuestionDto[]) {
        if (questionData.deleted) {
          const questionToDelete = quizz.questions.find(q => q.id === questionData.id);
          if (questionToDelete) {
            await this.questionRepository.remove(questionToDelete);
          }
          continue;
        }

        let question = quizz.questions.find(q => q.id === questionData.id);
        if (!question) {
          question = new Question();
          quizz.questions.push(question);
        }
        question.question = questionData.question || question.question;

        console.warn('_-0-_');
        if (questionData.choice) {
          for (const choiceData of questionData.choice as UpdateChoiceDto[]) {
            console.log('_-1-_');
            if (choiceData.deleted) {
              console.log('_-2-_');
              const choiceToDelete = question.choices.find(c => c.id === choiceData.id);

              if (choiceToDelete) {
                console.log('_-3-_');
                question.choices = question.choices.filter(c => c.id !== choiceData.id);

                await this.choiceRepository.remove(choiceToDelete);
              }
              continue;
            }

            let choice = question.choices.find(c => c.id === choiceData.id);
            if (!choice) {
              choice = new Choice();
              question.choices.push(choice);
            }
            choice.choice = choiceData.choice;
            choice.is_correct = choiceData.is_correct;
          }
        }


        if (questionData.media && 'deleted' in questionData.media) {
          const mediaData = questionData.media as UpdateMediaDto;
          if (mediaData.deleted && question.media) {
            await this.mediaRepository.remove(question.media);
            question.media = null;
          } else if (!mediaData.deleted) {
            if (!question.media) {
              question.media = new Media();
            }
            Object.assign(question.media, mediaData);
          }
        }

        if (questionData.image && 'deleted' in questionData.image) {
          const imageData = questionData.image as UpdateImageDto;
          if (imageData.deleted && question.image) {
            const imageToDelete = question.image;

            question.image = null;
            await this.questionRepository.save(question);

            await this.imageRepository.remove(imageToDelete);
            question.image = null;
          } else if (!imageData.deleted) {
            if (!question.image) {
              question.image = new Image();
            }
            Object.assign(question.image, imageData);
          }
        }

      }
    }

    return await this.quizzRepository.save(quizz);
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

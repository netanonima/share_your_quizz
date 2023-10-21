import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateQuizzDto} from './dto/create-quizz.dto';
import {UpdateQuizzDto} from './dto/update-quizz.dto';

import {UpdateQuestionDto} from '../questions/dto/update-question.dto';
import {UpdateChoiceDto} from '../choices/dto/update-choice.dto';
import {UpdateMediaDto} from '../medias/dto/update-media.dto';
import {UpdateImageDto} from '../images/dto/update-image.dto';

import {Quizz} from './entities/quizz.entity';
import {Question} from "questions/entities/question.entity";
import {Choice} from "choices/entities/choice.entity";
import {Media} from "medias/entities/media.entity";
import {Image} from "images/entities/image.entity";
import {User} from "users/entities/user.entity";

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
    quizz.quizz = createQuizzDto.quizz;
    if(!createQuizzDto.created_on) {
      quizz.created_on = new Date();
    }else{
        quizz.created_on = new Date(createQuizzDto.created_on);
    }
    quizz.modified_on = createQuizzDto.modified_on ? new Date(createQuizzDto.modified_on) : null;
    quizz.deleted_on = createQuizzDto.deleted_on ? new Date(createQuizzDto.deleted_on) : null;
    quizz.user = await this.userRepository.findOne({ where: { id: createQuizzDto.userId } });

    if (createQuizzDto.questions) {
      quizz.questions = [];
      for (const questionData of createQuizzDto.questions) {
        const question = new Question();
        question.question = questionData.question;

        if (questionData.choices) {
          question.choices = [];
          for (const choiceData of questionData.choices) {
            const choice = new Choice();
            choice.choice = choiceData.choice;
            choice.is_correct = choiceData.is_correct;
            question.choices.push(choice);
          }
        }

        if (questionData.media) {
          const media = new Media();
          Object.assign(media, questionData.media);
          question.media = media;
        }

        if (questionData.image) {
          const image = new Image();
          Object.assign(image, questionData.image);
          question.image = image;
        }

        quizz.questions.push(question);
      }
    }

    return await this.quizzRepository.save(quizz);
  }

  async findAll(user: User): Promise<Quizz[]> {
    return this.quizzRepository.find({
      where: { user: { id: user.id }, deleted_on: null },
      select: ['id', 'quizz', 'created_on', 'modified_on']
    });
  }

  async findOne(id: number, currentUser: User): Promise<Quizz> {
    const quizz = await this.quizzRepository.findOne({
      where: { id: id, deleted_on: null },
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
    if (!quizz || quizz.deleted_on!=null){
      throw new NotFoundException(`Quizz with ID ${id} not found`);
    }
    if (quizz.user.id !== currentUser.id) {
      throw new ForbiddenException('You do not have permission to update this quizz.');
    }

    if (updateQuizzDto.deleted) {
      // Supprimer les choix, médias, images, etc. associés à chaque question
      for (const question of quizz.questions) {
        // Supprimer les choix
        for (const choice of question.choices) {
          await this.choiceRepository.remove(choice);
        }
        // Supprimer les médias et images si présents
        if (question.media) {
          await this.mediaRepository.remove(question.media);
        }
        if (question.image) {
          await this.imageRepository.remove(question.image);
        }
        // Supprimer la question elle-même
        await this.questionRepository.remove(question);
      }
      // Supprimer le quizz
      await this.quizzRepository.remove(quizz);

      return new Quizz();
    }

    quizz.quizz = updateQuizzDto.quizz || quizz.quizz;
    quizz.created_on = updateQuizzDto.created_on ? new Date(updateQuizzDto.created_on) : quizz.created_on;
    quizz.modified_on = new Date();
    quizz.deleted_on = quizz.deleted_on;

    console.log('-3');
    if (updateQuizzDto.questions) {
      const questionsToUpdate = (updateQuizzDto.questions as UpdateQuestionDto[]).filter(q => !q.deleted);
      for (const questionData of updateQuizzDto.questions as UpdateQuestionDto[]) {
        console.log('-2');
        if (questionData.deleted) {
          const questionToDelete = quizz.questions.find(q => q.id === questionData.id);
          console.log('-1');
          if (questionToDelete) {
            console.log('0');
            for (const choice of questionToDelete.choices) {
              await this.choiceRepository.remove(choice);
              console.log('1');
            }
            await this.questionRepository.remove(questionToDelete);
            quizz.questions = quizz.questions.filter(q => q.id !== questionToDelete.id);
            console.log('2');
          }
          continue;
        }

        let question = quizz.questions.find(q => q.id === questionData.id);
        console.log('3');
        console.log(question);
        console.log(questionData.deleted);
        if (!question) {
          question = new Question();
          console.log('4');
          console.log(question);
          quizz.questions.push(question);
        }

        question.question = questionData.question || question.question;

        if (questionData.choices) {
          for (const choiceData of questionData.choices as UpdateChoiceDto[]) {
            if (choiceData.deleted) {
              const choiceToDelete = question.choices.find(c => c.id === choiceData.id);
              if (choiceToDelete) {
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
    const quizz = await this.quizzRepository.findOne({
      where: { id: id },
      relations: ['user', 'questions', 'questions.choices', 'questions.media', 'questions.image'],
    });

    if (!quizz) {
      throw new NotFoundException(`Quizz with ID ${id} not found`);
    }

    if (quizz.user.id !== currentUser.id) {
      throw new ForbiddenException('You do not have permission to delete this quizz.');
    }

    const mediaIdsToRemove = [];
    const imageIdsToRemove = [];

    for (const question of quizz.questions) {
      if (question.choices && question.choices.length > 0) {
        await this.choiceRepository.remove(question.choices);
      }
      if (question.media) {
        mediaIdsToRemove.push(question.media.id);
      }
      if (question.image) {
        imageIdsToRemove.push(question.image.id);
      }
    }

    if (quizz.questions && quizz.questions.length > 0) {
      await this.questionRepository.remove(quizz.questions);
    }

    if (mediaIdsToRemove.length > 0) {
      await this.mediaRepository.delete(mediaIdsToRemove);
    }
    if (imageIdsToRemove.length > 0) {
      await this.imageRepository.delete(imageIdsToRemove);
    }

    await this.quizzRepository.remove(quizz);
  }

}

import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
import {User} from "users/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Question} from "questions/entities/question.entity";
import {Repository} from "typeorm";
import {Choice} from "choices/entities/choice.entity";

@Injectable()
export class ChoicesService { // NotFoundException ForbiddenException
  constructor(
      @InjectRepository(Choice)
      private readonly choiceRepository: Repository<Choice>,
      @InjectRepository(Question)
      private readonly questionRepository: Repository<Question>,
  ) {
  }
  async create(questionId:number, createChoiceDto: CreateChoiceDto, user:User) {
    let choice = new Choice();

    const question = await this.questionRepository.findOne({
        where: {
            id: questionId,
            quizz: { user: { id: user.id } }
        },
        relations: ['quizz', 'quizz.user']
    });

    if(!question) {
        throw new NotFoundException('Question not found');
    }

    choice.choice = createChoiceDto.choice;
    choice.question = question;
    choice.is_correct = createChoiceDto.is_correct;

    return await this.choiceRepository.save(choice);
  }

  async findAllByQuestion(questionId:number, user:User) {
    const question = await this.questionRepository.findOne({
      where: {
        id: questionId,
        quizz: { user: { id: user.id } }
      },
      relations: ['quizz', 'quizz.user']
    });

    if(!question) {
      throw new NotFoundException('Question not found');
    }

    const choices = await this.choiceRepository.find({
        where: {
            question: { id: question.id }
        }
    });

    if(!choices) {
        throw new NotFoundException('Choices not found');
    }

    return choices;
  }

  async update(id: number, updateChoiceDto: UpdateChoiceDto, user:User) {
    let choice = await this.choiceRepository.findOne({
        where: {
            id: id,
            question: { quizz: { user: { id: user.id } } }
        },
        relations: ['question', 'question.quizz', 'question.quizz.user']
    });
    if(!choice) {
        throw new NotFoundException('Choice not found');
    }

    choice.choice = updateChoiceDto.choice;
    choice.is_correct = updateChoiceDto.is_correct;
    choice.question.quizz.modified_on = new Date();

    return await this.choiceRepository.save(choice);
  }

  async remove(id: number, user:User) {
    const choice = await this.choiceRepository.findOne({
      where: {
        id: id,
        question: { quizz: { user: { id: user.id } } }
      },
      relations: ['question', 'question.quizz', 'question.quizz.user']
    });
    if(!choice) {
      throw new NotFoundException('Choice not found');
    }

    choice.question.quizz.modified_on = new Date();
    await this.questionRepository.save(choice.question);

    await this.choiceRepository.remove(choice);
  }
}

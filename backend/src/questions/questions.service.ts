import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {Question} from "questions/entities/question.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Quizz} from "quizzs/entities/quizz.entity";
import {User} from "users/entities/user.entity";
import {Media} from "medias/entities/media.entity";
import {MediasService} from "medias/medias.service";

@Injectable()
export class QuestionsService {
  constructor(
      @InjectRepository(Question)
      private readonly questionRepository: Repository<Question>,
      @InjectRepository(Quizz)
      private readonly quizzRepository: Repository<Quizz>,
      private readonly mediaService: MediasService,
      @InjectRepository(Media)
      private readonly mediaRepository: Repository<Media>,
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
        relations: ['quizz', 'quizz.user', 'media']
    });
    if(!question) {
        throw new NotFoundException('Question not found');
    }
    if(question.quizz.user.id !== user.id) {
        throw new ForbiddenException('You do not have permission');
    }
    question.question = updateQuestionDto.question;
    question.quizz.modified_on = new Date();

    if(updateQuestionDto.media && updateQuestionDto.mediaName) {
      if(question.media) {
        await this.mediaService.eraseFile(question.media.file_path);
        await this.mediaRepository.remove(question.media);
      }
      let media = new Media();
      // extract mime type from base64 string(media)
      const mimeType = updateQuestionDto.media.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
      const type = mimeType.split('/')[0];
      const mediaName = updateQuestionDto.mediaName;
      const filename = mediaName.split('.').slice(0, -1).join('.');
      const extension = mediaName.split('.').slice(-1).join('.');
      let duration = "";
      let newExtension = '';
      if(type === 'image') newExtension = 'png';
      if(type === 'audio') newExtension = 'mp3';
      if(type === 'video') newExtension = 'mp4';
      const filePath = 'quizzesMedias/'+question.quizz.id+'/questions/'+question.id+'/'+filename+'.'+newExtension;
      // file conversion
      let newBuffer = null;
      if(type === 'image'){
        newBuffer = await this.mediaService.convertAndResizeImage(updateQuestionDto.media);
      }
      if(type === 'audio'){
        newBuffer = await this.mediaService.convertAudio(updateQuestionDto.media);
      }
      if(type === 'video'){
        newBuffer = await this.mediaService.convertVideo(updateQuestionDto.media);
        duration = await this.mediaService.getVideoDuration(newBuffer);
      }
      // get buffer size in Mo
      const size = newBuffer.length / 1024 / 1024;
      await this.mediaService.writeBufferToFile(newBuffer, filePath);

        media.file_path = filePath;
        media.filename = filename;
        media.size = size;
        media.type = type;
        media.extension = newExtension;
        media.duration = duration;
        await this.mediaRepository.save(media);
    }
    return await this.questionRepository.save(question);
  }

  async remove(id: number, user:User) {
    const question = await this.questionRepository.findOne({
      where: {
        id: id
      },
      relations: ['quizz', 'quizz.user', 'media']
    });
    if(!question) {
      throw new NotFoundException('Question not found');
    }
    if(question.quizz.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission');
    }

    question.quizz.modified_on = new Date();
    await this.quizzRepository.save(question.quizz);

    if(question.media) {
      await this.mediaService.eraseFile(question.media.file_path);
      await this.mediaRepository.remove(question.media);
    }

    await this.questionRepository.remove(question);
  }
}

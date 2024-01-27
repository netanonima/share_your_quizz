import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateQuestionDto} from './dto/create-question.dto';
import {UpdateQuestionDto} from './dto/update-question.dto';
import {Question} from "questions/entities/question.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Quizz} from "quizzs/entities/quizz.entity";
import {User} from "users/entities/user.entity";
import {Media} from "medias/entities/media.entity";
import {MediasService} from "medias/medias.service";
import {ConfigService} from "@nestjs/config";


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
      private config: ConfigService
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
        await this.mediaService.eraseFile(question.media.file_path, question.media.filename, question.media.extension);
        await this.mediaRepository.remove(question.media);
      }

      let media = new Media();
      const mimeType = updateQuestionDto.media.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
      const type = mimeType.split('/')[0];
      const mediaName = updateQuestionDto.mediaName;
      console.log('mediaName', mediaName);
      let filename = mediaName.split('.').slice(0, -1).join('.');
      const oldExtension = mediaName.split('.').slice(-1).join('.');
      let duration = "";
      let newExtension = '';
      if(type === 'image') newExtension = 'png';
      if(type === 'audio' || mimeType.split('/')[1] == 'ogg') newExtension = 'mp3';
      if(type === 'video' && mimeType.split('/')[1] != 'ogg') newExtension = 'mp4';
      const newMediaName = filename+'.'+newExtension;
      const filePath = this.config.get('MEDIA_PATH')+'/quizzesMedias/'+question.quizz.id+'/questions/'+question.id+'/';
      let newBuffer = null;
      let size = 0;
      let thisExtension = '';
      if(type === 'image'){
        newBuffer = await this.mediaService.convertAndResizeImage(updateQuestionDto.media);
        await this.mediaService.writeBufferToFile(newBuffer, filePath, newMediaName);
        size = Math.round(newBuffer.length / 1024 / 1024 * 100) / 100;
        thisExtension = newExtension;
      }
      if(type === 'audio' || mimeType.split('/')[1] == 'ogg'){
        duration = await this.mediaService.saveFile(updateQuestionDto.media, filePath + filename+ '.' + oldExtension);
        size = Math.round(updateQuestionDto.media.length / 1024 / 1024 * 100) / 100;
        const currentAudioFilePath = filePath + filename+ '.' + oldExtension;
        filename = filename+'1';
        const newAudioFilePath = filePath + filename+ '.' + newExtension;
        await this.mediaService.convertFile(currentAudioFilePath, newAudioFilePath);
        thisExtension = newExtension;
      }
      if(type === 'video' && mimeType.split('/')[1] != 'ogg'){
        duration = await this.mediaService.saveFile(updateQuestionDto.media, filePath + filename+ '.' + oldExtension);
        size = Math.round(updateQuestionDto.media.length / 1024 / 1024 * 100) / 100;
        const currentAudioFilePath = filePath + filename+ '.' + oldExtension;
        filename = filename+'1';
        const newAudioFilePath = filePath + filename+ '.' + newExtension;
        await this.mediaService.convertFile(currentAudioFilePath, newAudioFilePath);
        thisExtension = newExtension;
      }
        media.file_path = filePath;
        media.filename = filename;
        media.size = size;
        media.type = type;
        media.extension = thisExtension;
        media.duration = duration;
        question.media = await this.mediaRepository.save(media);
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
      await this.mediaRepository.remove(question.media);
      await this.mediaService.eraseFile(question.media.file_path, question.media.filename, question.media.extension);
    }

    await this.questionRepository.remove(question);
  }

  async removeMedia(id: number, user:User) {
    const media = await this.mediaRepository.findOne({
      where: {
        id: id
      },
      relations: ['question', 'question.quizz', 'question.quizz.user']
    });
    if(!media) {
      throw new NotFoundException('Media not found');
    }
    if(media.question.quizz.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission');
    }

    const question = await this.questionRepository.findOne({
        where: {
            media: { id: media.id }
        },
        relations: ['quizz', 'quizz.user', 'media']
    });
    if(!question) {
        throw new NotFoundException('Question not found');
    }
    if(question.quizz.user.id !== user.id) {
        throw new ForbiddenException('You do not have permission');
    }
    question.media = null;
    await this.questionRepository.save(question);
    await this.mediaRepository.remove(media);
    await this.mediaService.eraseFile(media.file_path, media.filename, media.extension);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from "sessions/entities/session.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Quizz} from "quizzs/entities/quizz.entity";
import {Repository} from "typeorm";

@Injectable()
export class SessionsService {
  constructor(
      @InjectRepository(Quizz)
      private quizzRepository: Repository<Quizz>,
      @InjectRepository(Session)
      private sessionRepository: Repository<Session>,
  ) {}
  async create(createSessionDto: CreateSessionDto) {
    const session = new Session();
    const currentQuizz = await this.quizzRepository.findOne({
      where: { id: createSessionDto.quizzId }
    });
    if(!currentQuizz) {
      throw new Error('Quizz not found');
    }
    session.quizz = currentQuizz;
    session.started_on = new Date();

    const oldSessions = await this.sessionRepository.find({
        where: { quizz: currentQuizz, finished_on: null }
    });
    if(oldSessions.length > 0) {
        for (const oldSession of oldSessions) {
          await this.sessionRepository.delete(oldSession.id);
        }
    }

    return await this.sessionRepository.save(session);
  }

  findAll() {
    return `This action returns all sessions`;
  }

  async findOne(id: number) {
    const thisSession = await this.sessionRepository.findOne({
        where: { id: id }
    });
    if(!thisSession) {
      throw new Error('Session not found');
    }
    return thisSession;
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const thisSession = await this.sessionRepository.findOne({
        where: { id: id }
    });
    if(!thisSession) {
      throw new Error('Session not found');
    }
    if(!updateSessionDto.winner_username || !updateSessionDto.winner_points) {
        throw new Error('Winner username or winner points not found');
    }
    thisSession.winner_username = updateSessionDto.winner_username;
    thisSession.winner_points = updateSessionDto.winner_points;
    thisSession.finished_on = new Date();
    return await this.sessionRepository.save(thisSession);
  }

  async remove(id: number) {
    const thisSession = await this.sessionRepository.findOne({
        where: { id: id }
    });
    if(!thisSession) {
      throw new Error('Session not found');
    }
    return this.sessionRepository.delete(id);
  }

}

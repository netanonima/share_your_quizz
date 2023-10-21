import {Module} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Quizz} from "quizzs/entities/quizz.entity";
import {Session} from "sessions/entities/session.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
    Session,
    Quizz,
  ])],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}

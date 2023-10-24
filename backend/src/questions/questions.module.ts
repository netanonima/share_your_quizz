import {forwardRef, Module} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Question} from "questions/entities/question.entity";
import {Quizz} from "quizzs/entities/quizz.entity";
import {MediasModule} from "medias/medias.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([
        Question,
        Quizz
      ]),
      forwardRef(() => MediasModule),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}

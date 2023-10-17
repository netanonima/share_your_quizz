import { Module } from '@nestjs/common';
import { QuizzsService } from './quizzs.service';
import { QuizzsController } from './quizzs.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Quizz} from "quizzs/entities/quizz.entity";
import {Question} from "questions/entities/question.entity";
import {Choice} from "choices/entities/choice.entity";
import {Media} from "medias/entities/media.entity";
import {Image} from "images/entities/image.entity";
import {User} from "users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
    Quizz,
      Question,
      Choice,
      Media,
      Image,
      User
  ])],
  controllers: [QuizzsController],
  providers: [QuizzsService],
})
export class QuizzsModule {}

import { Module } from '@nestjs/common';
import { QuizzsService } from './quizzs.service';
import { QuizzsController } from './quizzs.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Quizz} from "quizzs/entities/quizz.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Quizz])],
  controllers: [QuizzsController],
  providers: [QuizzsService],
})
export class QuizzsModule {}

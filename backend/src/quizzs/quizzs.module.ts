import { Module } from '@nestjs/common';
import { QuizzsService } from './quizzs.service';
import { QuizzsController } from './quizzs.controller';

@Module({
  controllers: [QuizzsController],
  providers: [QuizzsService],
})
export class QuizzsModule {}

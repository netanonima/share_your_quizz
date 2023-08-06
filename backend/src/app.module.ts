import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { QuizzsModule } from './quizzs/quizzs.module';
import { QuestionsModule } from './questions/questions.module';
import { ChoicesModule } from './choices/choices.module';
import { ImagesModule } from './images/images.module';
import { MediasModule } from './medias/medias.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    UsersModule,
    QuizzsModule,
    QuestionsModule,
    ChoicesModule,
    ImagesModule,
    MediasModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { Quizz } from './quizzs/entities/quizz.entity';
import { Question } from './questions/entities/question.entity';
import { Choice } from './choices/entities/choice.entity';
import { Media } from './medias/entities/media.entity';
import { Session } from './sessions/entities/session.entity';
import { UsersModule } from './users/users.module';
import { QuizzsModule } from './quizzs/quizzs.module';
import { QuestionsModule } from './questions/questions.module';
import { ChoicesModule } from './choices/choices.module';
import { MediasModule } from './medias/medias.module';
import { SessionsModule } from './sessions/sessions.module';
import { AuthModule } from './auth/auth.module';
import { PlaySocketsModule } from './play-sockets/play-sockets.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'phpmyadmin',
      password: 'phpmyadmin',
      database: 'share_your_quizz',
      entities: [User, Quizz, Question, Choice, Media, Session],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    QuizzsModule,
    QuestionsModule,
    ChoicesModule,
    MediasModule,
    SessionsModule,
    AuthModule,
    PlaySocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

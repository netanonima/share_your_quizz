import {forwardRef, Module} from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Media} from "medias/entities/media.entity";
import {QuestionsModule} from "questions/questions.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Media]),
    forwardRef(() => QuestionsModule),
  ],
  controllers: [MediasController],
  providers: [MediasService],
  exports: [
    MediasService,
    TypeOrmModule
  ]
})
export class MediasModule {}

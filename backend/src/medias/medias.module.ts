import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Media} from "medias/entities/media.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MediasController],
  providers: [MediasService],
  exports: [
    MediasService,
    TypeOrmModule
  ]
})
export class MediasModule {}

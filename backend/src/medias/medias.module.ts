import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import {ConfigService} from "@nestjs/config";

@Module({
  controllers: [MediasController],
  providers: [MediasService],
  exports: [MediasService]
})
export class MediasModule {}

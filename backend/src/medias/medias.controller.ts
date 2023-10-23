import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MediasService } from './medias.service';

@Controller('medias')
@UseInterceptors(ClassSerializerInterceptor)
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

}

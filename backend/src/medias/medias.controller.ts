import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor, UseGuards, Delete, Param,
} from '@nestjs/common';
import { MediasService } from './medias.service';
import {JwtAuthGuard} from "auth/guards/jwt-auth.guard";
import {GetUser} from "decorators/user.decorator";
import {User} from "users/entities/user.entity";

@Controller('medias')
@UseInterceptors(ClassSerializerInterceptor)
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
      @Param('id') id: string,
      @GetUser() user: User
  ) {
    return this.mediasService.remove(+id, user);
  }
}

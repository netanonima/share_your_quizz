import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards, UseInterceptors, ClassSerializerInterceptor,
} from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {GetUser} from "decorators/user.decorator";
import {User} from "users/entities/user.entity";

@Controller('choices')
@UseInterceptors(ClassSerializerInterceptor)
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':questionId')
  create(
      @Param('questionId') questionId: number,
      @Body() createChoiceDto: CreateChoiceDto,
      @GetUser() user: User
  ) {
    return this.choicesService.create(questionId, createChoiceDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('question/:questionId')
  findAllByQuestion(
      @Param('questionId') questionId: number,
      @GetUser() user: User
  ) {
    return this.choicesService.findAllByQuestion(questionId, user);
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
      @Param('id') id: string,
      @Body() updateChoiceDto: UpdateChoiceDto,
      @GetUser() user: User
  ) {
    return this.choicesService.update(+id, updateChoiceDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
      @Param('id') id: string,
        @GetUser() user: User
  ) {
    return this.choicesService.remove(+id, user);
  }
}

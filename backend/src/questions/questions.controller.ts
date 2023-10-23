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
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {GetUser} from "decorators/user.decorator";
import {User} from "users/entities/user.entity";

@Controller('questions')
@UseInterceptors(ClassSerializerInterceptor)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
      @Body() createQuestionDto: CreateQuestionDto,
      @GetUser() user: User
  ) {
    return this.questionsService.create(createQuestionDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('quizz/:quizzId')
  findAllByQuizz(
      @Param('quizzId') quizzId: number,
      @Body() updateQuestionDto: UpdateQuestionDto,
      @GetUser() user: User
  ) {
    return this.questionsService.findAllByQuizz(quizzId, updateQuestionDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @GetUser() user: User
  ) {
    return this.questionsService.update(+id, updateQuestionDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
      @Param('id') id: string,
      @GetUser() user: User
  ) {
    return this.questionsService.remove(+id, user);
  }
}

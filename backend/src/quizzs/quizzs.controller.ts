import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, UseInterceptors, ClassSerializerInterceptor,
} from '@nestjs/common';
import { QuizzsService } from './quizzs.service';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { GetUser } from './../decorators/user.decorator';
import {User} from "users/entities/user.entity";
import {Quizz} from "quizzs/entities/quizz.entity";

@Controller('quizzs')
@UseInterceptors(ClassSerializerInterceptor)
export class QuizzsController {
  constructor(private readonly quizzsService: QuizzsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@GetUser() user: User, @Body() createQuizzDto: CreateQuizzDto) {
    return this.quizzsService.create(user, createQuizzDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@GetUser() user: User) {
    return this.quizzsService.findAll(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number, @GetUser() user: User): Promise<Quizz> {
    return this.quizzsService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateQuizzDto: UpdateQuizzDto, @GetUser() user: User): Promise<Quizz> {
    return this.quizzsService.update(id, updateQuizzDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.quizzsService.remove(id, user);
  }
}

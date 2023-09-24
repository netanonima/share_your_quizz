import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuizzsService } from './quizzs.service';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { GetUser } from './../decorators/user.decorator';
import {User} from "users/entities/user.entity";

@Controller('quizzs')
export class QuizzsController {
  constructor(private readonly quizzsService: QuizzsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createQuizzDto: CreateQuizzDto) {
    return this.quizzsService.create(createQuizzDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@GetUser() user: User) {
    return this.quizzsService.findAll(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizzDto: UpdateQuizzDto) {
    return this.quizzsService.update(+id, updateQuizzDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzsService.remove(+id);
  }
}

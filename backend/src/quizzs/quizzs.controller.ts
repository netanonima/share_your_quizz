import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuizzsService } from './quizzs.service';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';

@Controller('quizzs')
export class QuizzsController {
  constructor(private readonly quizzsService: QuizzsService) {}

  @Post()
  create(@Body() createQuizzDto: CreateQuizzDto) {
    return this.quizzsService.create(createQuizzDto);
  }

  @Get()
  findAll() {
    return this.quizzsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizzDto: UpdateQuizzDto) {
    return this.quizzsService.update(+id, updateQuizzDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzsService.remove(+id);
  }
}

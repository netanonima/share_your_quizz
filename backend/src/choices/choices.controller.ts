import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';

@Controller('choices')
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @Post()
  create(@Body() createChoiceDto: CreateChoiceDto) {
    return this.choicesService.create(createChoiceDto);
  }

  @Get()
  findAll() {
    return this.choicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.choicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChoiceDto: UpdateChoiceDto) {
    return this.choicesService.update(+id, updateChoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.choicesService.remove(+id);
  }
}

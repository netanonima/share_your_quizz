import { Module } from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { ChoicesController } from './choices.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Choice} from "choices/entities/choice.entity";
import {Question} from "questions/entities/question.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Choice, Question])],
  controllers: [ChoicesController],
  providers: [ChoicesService],
})
export class ChoicesModule {}

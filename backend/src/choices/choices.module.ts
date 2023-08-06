import { Module } from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { ChoicesController } from './choices.controller';

@Module({
  controllers: [ChoicesController],
  providers: [ChoicesService],
})
export class ChoicesModule {}

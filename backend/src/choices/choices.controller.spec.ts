import { Test, TestingModule } from '@nestjs/testing';
import { ChoicesController } from './choices.controller';
import { ChoicesService } from './choices.service';

describe('ChoicesController', () => {
  let controller: ChoicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChoicesController],
      providers: [ChoicesService],
    }).compile();

    controller = module.get<ChoicesController>(ChoicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

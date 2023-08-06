import { Test, TestingModule } from '@nestjs/testing';
import { QuizzsController } from './quizzs.controller';
import { QuizzsService } from './quizzs.service';

describe('QuizzsController', () => {
  let controller: QuizzsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizzsController],
      providers: [QuizzsService],
    }).compile();

    controller = module.get<QuizzsController>(QuizzsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

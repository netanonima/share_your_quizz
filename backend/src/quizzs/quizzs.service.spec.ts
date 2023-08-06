import { Test, TestingModule } from '@nestjs/testing';
import { QuizzsService } from './quizzs.service';

describe('QuizzsService', () => {
  let service: QuizzsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizzsService],
    }).compile();

    service = module.get<QuizzsService>(QuizzsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

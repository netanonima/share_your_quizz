import { Test, TestingModule } from '@nestjs/testing';
import { ChoicesService } from './choices.service';

describe('ChoicesService', () => {
  let service: ChoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChoicesService],
    }).compile();

    service = module.get<ChoicesService>(ChoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

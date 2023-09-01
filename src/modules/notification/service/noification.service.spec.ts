import { Test, TestingModule } from '@nestjs/testing';
import { NoificationService } from './noification.service';

describe('NoificationService', () => {
  let service: NoificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoificationService],
    }).compile();

    service = module.get<NoificationService>(NoificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

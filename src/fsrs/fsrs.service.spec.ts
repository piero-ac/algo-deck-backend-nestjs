import { Test, TestingModule } from '@nestjs/testing';
import { FsrsService } from './fsrs.service';

describe('FsrsService', () => {
  let service: FsrsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FsrsService],
    }).compile();

    service = module.get<FsrsService>(FsrsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

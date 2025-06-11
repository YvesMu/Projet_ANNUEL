import { Test, TestingModule } from '@nestjs/testing';
import { PostulationService } from './postulation.service';

describe('PostulationService', () => {
  let service: PostulationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostulationService],
    }).compile();

    service = module.get<PostulationService>(PostulationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

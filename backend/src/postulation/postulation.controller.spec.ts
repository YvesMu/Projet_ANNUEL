import { Test, TestingModule } from '@nestjs/testing';
import { PostulationController } from './postulation.controller';

describe('PostulationController', () => {
  let controller: PostulationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostulationController],
    }).compile();

    controller = module.get<PostulationController>(PostulationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

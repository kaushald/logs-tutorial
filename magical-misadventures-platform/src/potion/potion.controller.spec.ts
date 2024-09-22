import { Test, TestingModule } from '@nestjs/testing';
import { PotionController } from './potion.controller';

describe('PotionController', () => {
  let controller: PotionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PotionController],
    }).compile();

    controller = module.get<PotionController>(PotionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

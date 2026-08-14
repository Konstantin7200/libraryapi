import { Test, TestingModule } from '@nestjs/testing';
import { MixedListController } from './mixed-list.controller';
import { MixedListService } from './mixed-list.service';

describe('MixedListController', () => {
  let controller: MixedListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MixedListController],
      providers: [MixedListService],
    }).compile();

    controller = module.get<MixedListController>(MixedListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

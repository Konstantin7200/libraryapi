import { Test, TestingModule } from '@nestjs/testing';
import { MixedListService } from './mixed-list.service';

describe('MixedListService', () => {
  let service: MixedListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MixedListService],
    }).compile();

    service = module.get<MixedListService>(MixedListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

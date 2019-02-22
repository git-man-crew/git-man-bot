import { Test, TestingModule } from '@nestjs/testing';
import { GreetingController } from './greeting-controller';

describe('GreetingController', () => {
  let provider: GreetingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GreetingController],
    }).compile();

    provider = module.get<GreetingController>(GreetingController);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

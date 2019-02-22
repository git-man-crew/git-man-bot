import { Test, TestingModule } from '@nestjs/testing';
import { GreetingView } from './greeting-view';

describe('GreetingView', () => {
  let provider: GreetingView;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GreetingView],
    }).compile();

    provider = module.get<GreetingView>(GreetingView);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { Bot } from './bot';

describe('Bot', () => {
  let provider: Bot;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Bot],
    }).compile();
    provider = module.get<Bot>(Bot);
  });
  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

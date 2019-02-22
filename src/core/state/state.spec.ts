import { Test, TestingModule } from '@nestjs/testing';
import { State } from './state';

describe('State', () => {
  let provider: State;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [State],
    }).compile();
    provider = module.get<State>(State);
  });
  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

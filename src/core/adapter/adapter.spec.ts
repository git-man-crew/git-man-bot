import { Test, TestingModule } from '@nestjs/testing';
import { Adapter } from './adapter';

describe('Adapter', () => {
  let provider: Adapter;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Adapter],
    }).compile();
    provider = module.get<Adapter>(Adapter);
  });
  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { Adapter } from './adapter';
import { CoreModule } from '../core.module';

describe('Adapter', () => {
  let provider: Adapter;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();
    provider = module.get<Adapter>(Adapter);
  });
  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

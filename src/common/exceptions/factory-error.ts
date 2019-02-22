import { Type } from '@nestjs/common';

export class FactoryError extends Error {
  constructor(public type: string) {
    super(`Expected class type ${type} for factory is missing`);
  }
}

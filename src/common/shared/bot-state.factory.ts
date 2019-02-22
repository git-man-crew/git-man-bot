import { ConversationState, MemoryStorage, Storage, BotState, UserState } from 'botbuilder';
import { Type } from '@nestjs/common';
import { FactoryError } from '../exceptions/factory-error';

export function createState(BotStateType: Type<BotState>, storage: Storage): BotState {
    switch (BotStateType) {
        case ConversationState:
            return new ConversationState(storage);
        case UserState:
            return new UserState(storage);
        default:
            throw new FactoryError(BotStateType.toString());
    }
}

export function createStorage(Type: Type<Storage>): Storage {
    switch (Type) {
      case MemoryStorage:
        return new MemoryStorage();
      default:
        throw new FactoryError(Type.toString());
    }
  }
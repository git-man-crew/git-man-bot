import { ConversationState, MemoryStorage, Storage, BotState } from 'botbuilder';
import { Type } from '@nestjs/common';
import { FactoryError } from '../exceptions/factory-error';

export function createState(BotStateType: Type<BotState>, StorageType: Type<Storage>): BotState {
    switch (BotStateType) {
        case ConversationState:
            return new ConversationState(createStorage(StorageType));
        default:
            throw new FactoryError("Storage");
    }
}

function createStorage(Type: Type<Storage>): Storage {
    switch (Type) {
      case MemoryStorage:
        return new MemoryStorage();
      default:
        throw new FactoryError("Storage");
    }
  }
import { Module } from '@nestjs/common';
import { Bot } from './bot';
import { Adapter } from './adapter/adapter';
import { ConfigModule } from 'src/config/config.module';
import { ConversationState, MemoryStorage } from 'botbuilder';
import { createState } from 'src/common/shared/bot-state.factory';
import { State } from './state/state';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: State,
      useValue: new State(BotModule.conversationState)
    },
    Adapter,
    Bot,
  ],
  exports: [Bot, Adapter, State],
})
export class BotModule {
  public static readonly conversationState: ConversationState = createState(
    ConversationState,
    MemoryStorage,
  ) as ConversationState;
}

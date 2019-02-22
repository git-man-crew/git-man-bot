import { Module } from '@nestjs/common';
import { Bot } from './bot/bot';
import { Adapter } from './adapter/adapter';
import { ConfigModule } from 'src/config/config.module';
import { ConversationState, MemoryStorage, UserState } from 'botbuilder';
import {
  createState,
  createStorage,
} from 'src/common/shared/bot-state.factory';
import { State } from './state/state';
import { MessagesController } from './messages/messages.controller';
import { DialogModule } from 'src/dialog/dialog.module';
import { DialogSet } from 'botbuilder-dialogs';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [ConfigModule, DialogModule],
  providers: [
    {
      provide: State,
      useValue: new State(CoreModule.conversationState, CoreModule.userState),
    },
    Adapter,
    {
      provide: Bot,
      useFactory: (configService: ConfigService, state: State) => {
        const conversationState = state.getConversationState();
        const userState = state.getUserState();
        const userProfileAccessor = userState.createProperty(
          CoreModule.USER_PROFILE_PROPERTY,
        );
        const dialogState = conversationState.createProperty(
          CoreModule.DIALOG_STATE_PROPERTY,
        );
        const dialogs = new DialogSet(dialogState);
        return new Bot(
          configService,
          conversationState,
          userState,
          dialogState,
          userProfileAccessor,
          dialogs,
        );
      },
      inject: [ConfigService, State],
    },
  ],
  exports: [Bot, Adapter, State],
  controllers: [MessagesController],
})
export class CoreModule {
  public static readonly storage: MemoryStorage = createStorage(
    MemoryStorage,
  ) as MemoryStorage;
  public static readonly conversationState: ConversationState = createState(
    ConversationState,
    CoreModule.storage,
  ) as ConversationState;
  public static readonly userState: UserState = createState(
    UserState,
    CoreModule.storage,
  ) as UserState;
  private static readonly DIALOG_STATE_PROPERTY = 'dialogState';
  private static readonly USER_PROFILE_PROPERTY = 'userStateProperty';
}

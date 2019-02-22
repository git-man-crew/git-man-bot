import { Injectable, Logger } from '@nestjs/common';
import path = require('path');
import { BotFrameworkAdapter, ConversationState, MemoryStorage } from 'botbuilder';
import { ConfigService } from 'src/config/config.service';
import { BotConfiguration } from 'botframework-config';

@Injectable()
export class Adapter {
  private botConfig: any;
  private conversationState: ConversationState;
  constructor(
      private configService: ConfigService,
      
  ) {
    const DEV_ENVIRONMENT = 'dev';
    const BOT_CONFIGURATION = process.env.NODE_ENV || DEV_ENVIRONMENT;
    
    const endpointConfig = this.configService.findBotConfiguration(BOT_CONFIGURATION);
    const adapter = new BotFrameworkAdapter({
      appId: endpointConfig.appId || process.env.microsoftAppID,
      appPassword:
        endpointConfig.appPassword || process.env.microsoftAppPassword,
    });
    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    adapter.onTurnError = async (context, error) => {
      // This check writes out errors to console log .vs. app insights.
      Logger.error(`\n [onTurnError]: ${error}`);
      // Send a message to the user
      await context.sendActivity(`Oops. Something went wrong!`);
      // Clear out state
      await this.conversationState.delete(context);
    };
  }
}

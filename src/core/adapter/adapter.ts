import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { BotFrameworkAdapter, ConversationState } from 'botbuilder';
import { ConfigService } from 'src/config/config.service';
import { State } from 'src/core/state/state';
import { Bot } from 'src/core/bot/bot';
import { ComponentDialog } from 'botbuilder-dialogs';
import { IComponentDialog } from 'src/common/shared/dialog-config';

@Injectable()
export class Adapter implements OnModuleInit {
  @Inject('ConfigService') private configService: ConfigService;
  @Inject('State') private state: State;
  @Inject('Bot') private bot: Bot;

  private conversationState: ConversationState;
  private botFrameworkAdapter: BotFrameworkAdapter;

  onModuleInit() {
    this.conversationState = this.state.getConversationState();
    const DEV_ENVIRONMENT = 'dev';
    const BOT_CONFIGURATION = process.env.NODE_ENV || DEV_ENVIRONMENT;

    const endpointConfig = this.configService.findBotConfiguration(
      BOT_CONFIGURATION,
    );
    this.botFrameworkAdapter = new BotFrameworkAdapter({
      appId: endpointConfig.appId || process.env.microsoftAppID,
      appPassword:
        endpointConfig.appPassword || process.env.microsoftAppPassword,
    });
    this.botFrameworkAdapter.onTurnError = async (context, error) => {
      Logger.error(`\n [onTurnError]: ${error}`);
      await context.sendActivity(`Oops. Etwas ist falsch gelaufen.`);
      await this.conversationState.delete(context);
    };
  }

  public processActivities(req: any, res: any) {
    this.botFrameworkAdapter.processActivity(req, res, async turnContext => {
      await this.bot.onTurn(turnContext);
    });
  }

  public registerDialog(componentDialog: IComponentDialog) {
    this.bot.registerDialogComponent(componentDialog);
  }
}

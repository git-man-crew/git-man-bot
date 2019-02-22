import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { State } from 'src/bot/state/state';
import {
  ConversationState,
  StatePropertyAccessor,
  ActivityTypes,
} from 'botbuilder';
import { LuisService } from 'botframework-config';
import {
  LuisRecognizer,
  LuisApplication,
  LuisPredictionOptions,
} from 'botbuilder-ai';

@Injectable()
export class Bot implements OnModuleInit {
  private readonly TURN_COUNTER_PROPERTY = 'turnCounterProperty';

  @Inject('ConfigService') private configService: ConfigService;
  @Inject('State') private state: State;

  private conversationState: ConversationState;
  private countProperty: StatePropertyAccessor<number>;
  private luisConfig: LuisService;
  private luisRecognizer: LuisRecognizer;
  private luisPredictionOptions: LuisPredictionOptions = {
    includeAllIntents: true,
    log: true,
    staging: false,
  };

  public onModuleInit() {
    const LUIS_CONFIGURATION: string = 'git-man';
    this.luisConfig = this.configService.findLuisService(LUIS_CONFIGURATION);
    if (!this.luisConfig || !this.luisConfig.appId) {
      throw Error(
        'Missing LUIS configuration. Please follow README.MD to create required LUIS applications.\n\n',
      );
    }
    const luisApplication: LuisApplication = {
      applicationId: this.luisConfig.appId,
      endpoint: this.luisConfig.getEndpoint(),
      endpointKey: this.luisConfig.authoringKey,
    };
    this.luisRecognizer = new LuisRecognizer(
      luisApplication,
      this.luisPredictionOptions,
      true,
    );
    this.conversationState = this.state.getConversationState();
    this.countProperty = this.conversationState.createProperty<number>(
      this.TURN_COUNTER_PROPERTY,
    );
  }

  public async onTurn(turnContext) {
    if (turnContext.activity.type === ActivityTypes.Message) {
      const results = await this.luisRecognizer.recognize(turnContext);
      const topIntent = LuisRecognizer.topIntent(results);
      let count = await this.countProperty.get(turnContext);
      count = count === undefined ? 1 : ++count;
      await turnContext.sendActivity(
        `${count}: You said "${turnContext.activity.text}"`,
      );
      await this.countProperty.set(turnContext, count);
    } else {
      await turnContext.sendActivity(
        `[${turnContext.activity.type} event detected]`,
      );
    }
    await this.conversationState.saveChanges(turnContext);
  }
}

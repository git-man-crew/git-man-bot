import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { State } from 'src/core/state/state';
import {
  ConversationState,
  StatePropertyAccessor,
  ActivityTypes,
  UserState,
  RecognizerResult,
  CardFactory,
} from 'botbuilder';
import { LuisService } from 'botframework-config';
import {
  LuisRecognizer,
  LuisApplication,
  LuisPredictionOptions,
} from 'botbuilder-ai';
import {
  DialogSet,
  ComponentDialog,
  DialogTurnResult,
  DialogContext,
  DialogTurnStatus,
  Dialog,
} from 'botbuilder-dialogs';
import { IComponentDialog } from 'src/common/shared/dialog-config';

@Injectable()
export class Bot implements OnModuleInit {
  private luisRecognizer: LuisRecognizer;
  private luisPredictionOptions: LuisPredictionOptions = {
    includeAllIntents: true,
    log: true,
    staging: false,
  };

  constructor(
    private configService: ConfigService,
    private conversationState: ConversationState,
    private userState: UserState,
    private dialogState: StatePropertyAccessor<any>,
    private userProfileAccessor: StatePropertyAccessor<any>,
    private dialogs: DialogSet,
  ) {}

  public onModuleInit() {
    const LUIS_CONFIGURATION: string = 'git-man';
    const luisConfig: LuisService = this.configService.findLuisService(
      LUIS_CONFIGURATION,
    );
    if (!luisConfig || !luisConfig.appId) {
      throw Error(
        'Missing LUIS configuration. Please follow README.MD to create required LUIS applications.\n\n',
      );
    }
    const luisApplication: LuisApplication = {
      applicationId: luisConfig.appId,
      endpoint: luisConfig.getEndpoint(),
      endpointKey: luisConfig.authoringKey,
    };
    this.luisRecognizer = new LuisRecognizer(
      luisApplication,
      this.luisPredictionOptions,
      true,
    );
  }

  public async onTurn(turnContext): Promise<void> {
    if (turnContext.activity.type === ActivityTypes.Message) {
      let dialogResult: DialogTurnResult;
      const dialogContext = await this.dialogs.createContext(turnContext);
      const results = await this.luisRecognizer.recognize(turnContext);
      const topIntent = LuisRecognizer.topIntent(results);

      const interrupted = await this.isTurnInterrupted(dialogContext, results);
      if (interrupted) {
        if (dialogContext.activeDialog !== undefined) {
          await dialogContext.repromptDialog();
        }
      } else {
        dialogResult = await dialogContext.continueDialog();
      }

      if (!dialogContext.context.responded) {
        switch (dialogResult.status) {
          case DialogTurnStatus.empty:
            dialogContext.beginDialog(
              this.configService.findDialogRoute(topIntent).dialogId,
            );
            break;
          case DialogTurnStatus.waiting:
            Logger.log(
              'The active dialog is waiting for a response from the user, so do nothing.',
            );
            break;
          case DialogTurnStatus.complete:
            Logger.log('All child dialogs have ended.');
            dialogContext.context.sendActivity;
            break;
          default:
            Logger.log(
              'Unrecognized status from child dialog. Cancel all dialogs.',
            );
            await dialogContext.cancelAllDialogs();
            break;
        }
      }
    } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
      if (turnContext.activity.membersAdded.length !== 0) {
        for (const index in turnContext.activity.membersAdded) {
          if (
            turnContext.activity.membersAdded[index].id !==
            turnContext.activity.recipient.id
          ) {
            //const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
            //await turnContext.sendActivity({ attachments: [welcomeCard] });
            await turnContext.sendActivity('Herzlich Willkommen!');
          }
        }
      }
    }

    await this.conversationState.saveChanges(turnContext);
    await this.userState.saveChanges(turnContext);
  }

  public registerDialogComponent<T extends IComponentDialog>(
    componentDialog: T,
  ): void {
    componentDialog.initializeUserProfileAccessor(this.userProfileAccessor);
    this.dialogs.add(componentDialog);
  }

  private isTurnInterrupted = async (
    dc: DialogContext,
    luisResults: RecognizerResult,
  ) => {
    const topIntent = LuisRecognizer.topIntent(luisResults);

    if (topIntent === 'Cancel') {
      if (dc.activeDialog) {
        await dc.cancelAllDialogs();
        await dc.context.sendActivity(`Ok. Wir beginnen nun von vorne!`);
      } else {
        await dc.context.sendActivity(`Es gibt nichts zum abbrechen!`);
      }
      return true;
    }

    if (topIntent === 'Help') {
      await dc.context.sendActivity(`Lass mich versuchen, dir zu helfen.`);
      await dc.context.sendActivity(`Ich verstehe Grüße und sonst nichts xD`);
      return true;
    }
    return false;
  };
}

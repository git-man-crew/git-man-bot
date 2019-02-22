import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ComponentDialog, WaterfallDialog, WaterfallStepContext } from 'botbuilder-dialogs';
import { StatePropertyAccessor } from 'botbuilder';
import { ConfigService } from 'src/config/config.service';
import { State } from 'src/core/state/state';
import { GreetingView } from 'src/dialog/views/greeting/greeting-view';

@Injectable()
export class GreetingController extends ComponentDialog
  implements OnModuleInit {

  private userProfileAccessor: StatePropertyAccessor<any>;

  constructor(private configService: ConfigService, private view: GreetingView) {
    super(configService.findDialogRoute('Greeting').dialogId);
  }

  public onModuleInit() {
      this.view.initializeView();
      this.view.communicationBus.subscribe('greet', (step: WaterfallStepContext<any>): any => {
        this.initializeStateStep(step);
      })
      this.addDialog(new WaterfallDialog('Greeting', this.view))
  }

  public initializeUserProfileAccessor(
    userProfileAccessor: StatePropertyAccessor<any>,
  ) {
    this.userProfileAccessor = userProfileAccessor;
  }

  private initializeStateStep = async (step: WaterfallStepContext<any>) => {
    const userProfile = await this.userProfileAccessor.get(step.context);
    if (userProfile === undefined) {
        await this.userProfileAccessor.set(step.context, {});
    }
    await step.context.sendActivity('Hallo du, wie geht es dir?');
    return await step.cancelAllDialogs();
}
}

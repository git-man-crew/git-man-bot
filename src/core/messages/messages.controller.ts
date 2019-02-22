import {
  Controller,
  Post,
  Request,
  Response,
  Inject,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { Routes } from 'src/common/shared/dialog-config';
import { Adapter } from 'src/core/adapter/adapter';
import { GreetingController } from 'src/dialog/controllers/greeting/greeting-controller';

@Controller(Routes.BASE)
export class MessagesController implements OnModuleInit {
  @Inject() private adapter: Adapter;

  constructor(private greetingController: GreetingController) {}

  public onModuleInit() {
    this.adapter.registerDialog(this.greetingController);
  }

  @Post('/messages')
  public messages(@Request() req, @Response() res) {
    this.adapter.processActivities(req, res);
  }
}

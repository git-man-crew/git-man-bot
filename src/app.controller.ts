import { Controller, Get, Inject, OnModuleInit, Post, Request, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { Adapter } from './bot/adapter/adapter';

@Controller()
export class AppController {
  @Inject('Adapter') private adapter: Adapter;
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/api/messages')
  messages(@Request() req, @Response() res) {
    this.adapter.processActivities(req, res);
  }
}

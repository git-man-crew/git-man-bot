import { Module } from '@nestjs/common';
import { Bot } from './bot';
import { Adapter } from './adapter/adapter';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [Bot, Adapter],
  exports: [Bot, Adapter],
})
export class BotModule {}

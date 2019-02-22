import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from './config/config.module';
import { DialogModule } from './dialog/dialog.module';

@Module({
  imports: [BotModule, ConfigModule, DialogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

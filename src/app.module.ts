import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [BotModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

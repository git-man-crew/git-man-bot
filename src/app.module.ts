import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { ConfigModule } from './config/config.module';
import { DialogModule } from './dialog/dialog.module';

@Module({
  imports: [CoreModule, ConfigModule, DialogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

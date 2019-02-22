import { Module } from '@nestjs/common';
import { GreetingController } from './greeting/greeting-controller';
import { ViewsModule } from '../views/views.module';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule, ViewsModule],
  providers: [GreetingController],
  exports: [GreetingController]
})
export class ControllersModule {}

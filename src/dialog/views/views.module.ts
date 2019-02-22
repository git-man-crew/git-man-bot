import { Module } from '@nestjs/common';
import { GreetingView } from './greeting/greeting-view';

@Module({
  providers: [GreetingView],
  exports: [GreetingView]
})
export class ViewsModule {}

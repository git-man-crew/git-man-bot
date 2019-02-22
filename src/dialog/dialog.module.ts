import { Module } from '@nestjs/common';
import { ControllersModule } from './controllers/controllers.module';
import { ViewsModule } from './views/views.module';

@Module({
  imports: [ControllersModule, ViewsModule]
})
export class DialogModule {}

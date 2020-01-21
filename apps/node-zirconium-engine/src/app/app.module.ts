import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsoleGameEngineService } from './console-game-engine/console-game-engine.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ConsoleGameEngineService]
})
export class AppModule {}

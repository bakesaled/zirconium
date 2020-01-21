import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConsoleGameEngineService } from './console-game-engine/console-game-engine.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private consoleGameEngineService: ConsoleGameEngineService) {}
  getData(): { message: string } {
    return { message: 'Welcome to node-zirconium-engine!' };
  }

  onApplicationBootstrap(): any {
    this.consoleGameEngineService.initTerminal(80, 80);
    this.consoleGameEngineService.drawChar(0, 0, '##');
  }
}

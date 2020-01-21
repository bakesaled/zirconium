import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleGameEngineService } from './console-game-engine.service';

describe('ConsoleGameEngineService', () => {
  let service: ConsoleGameEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsoleGameEngineService],
    }).compile();

    service = module.get<ConsoleGameEngineService>(ConsoleGameEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

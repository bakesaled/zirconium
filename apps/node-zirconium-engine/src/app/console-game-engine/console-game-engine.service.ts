import { Injectable } from '@nestjs/common';
import { terminal, ScreenBuffer, Terminal } from 'terminal-kit';

@Injectable()
export class ConsoleGameEngineService {
  private term: Terminal;
  private buffer: ScreenBuffer;

  initTerminal(height: number, width: number) {
    this.term = terminal;
    this.term.height = height;
    this.term.width = width;
    this.term.clear();
    this.buffer = new ScreenBuffer({
      dst: this.term,
      width: this.term.width,
      height: this.term.height
    });
  }
  drawChar(x: number, y: number, char: string, color: string = 'white') {
    this.buffer.put(
      <any>{
        x: x,
        y: y,
        attr: {
          color: <any>color
        },
        wrap: false,
        newLine: true
      },
      char
    );
    this.buffer.draw();
  }
}

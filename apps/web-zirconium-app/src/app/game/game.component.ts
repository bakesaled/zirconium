import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { GamePlayScene } from './scenes/game-play.scene';

@Component({
  selector: 'zirconium-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 640,
      width: 640,
      scene: [GamePlayScene],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          // gravity: { y: 100 }
          // debug: true
        }
      }
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
}

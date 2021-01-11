import { Component, Inject, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { GamePlayScene } from './scenes/game-play.scene';
import { GameOverScene } from './scenes/game-over.scene';
import { GameIntroScene } from './scenes/game-intro.scene';
import { PreloadScene } from './scenes/preload.scene';
import { WINDOW } from '../window.service';
import { GameLifeLostScene } from './scenes/game-life-lost.scene';

@Component({
  selector: 'zir-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  soundEnabled: boolean;

  constructor(@Inject(WINDOW) private window: Window) {
    window.addEventListener('resize', this.moveButton);

    this.config = {
      type: Phaser.AUTO,
      height: 640,
      width: 640,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.NO_CENTER
      },
      autoFocus: true,
      backgroundColor: 0x000000,
      scene: [
        PreloadScene,
        GameIntroScene,
        GamePlayScene,
        GameLifeLostScene,
        GameOverScene
      ],
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          // gravity: { y: 100 }
          // debug: true
        }
      },
      audio: {}
    };

    const soundEnabledString = localStorage.getItem('sound-enabled');
    if (soundEnabledString && soundEnabledString.length) {
      this.soundEnabled = JSON.parse(soundEnabledString);
    }
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
    window.dispatchEvent(new Event('resize'));
  }

  volumeToggle() {
    const scene: any = this.phaserGame.scene.getScenes(true);
    scene[0].soundEnabled = !scene[0].soundEnabled;
    this.soundEnabled = !this.soundEnabled;
  }

  private moveButton() {
    const div = document.querySelector(
      '.zir-navigation-container'
    ) as HTMLElement;
    const canvas = document.querySelector('canvas');
    const muteEl = document.querySelector('.zir-mute-button') as HTMLElement;
    canvas.style.height = div.offsetHeight - 64 + 'px';
    // noinspection JSSuspiciousNameCombination
    canvas.style.width = canvas.style.height;

    setTimeout(() => {
      const newCanvas = document.querySelector('canvas');
      muteEl.style.top = newCanvas.offsetHeight - 64 + 'px';
      muteEl.style.left = newCanvas.offsetWidth - 64 + 'px';
    });
  }
}

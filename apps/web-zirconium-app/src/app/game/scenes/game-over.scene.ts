import { SceneSound } from './scene-sound';
import BaseSound = Phaser.Sound.BaseSound;

export class GameOverScene extends Phaser.Scene implements SceneSound {
  private sndEnabled: boolean;

  newHighScore;
  highScore = 0;
  endMusic: BaseSound;

  get soundEnabled(): boolean {
    const soundEnabledString = localStorage.getItem('sound-enabled');
    if (soundEnabledString && soundEnabledString.length) {
      this.sndEnabled = JSON.parse(soundEnabledString);
    }
    return this.sndEnabled;
  }
  set soundEnabled(newValue: boolean) {
    this.sndEnabled = newValue;
    if (this.sndEnabled) {
      this.endMusic.resume();
    } else {
      this.endMusic.pause();
    }
    localStorage.setItem('sound-enabled', JSON.stringify(newValue));
  }

  constructor() {
    super({
      key: 'game-over'
    });
  }

  preload() {
    this.load.audio('end-music', 'assets/end-music.mp3', {
      instances: 1
    });
  }

  create() {
    this.add.rectangle(
      0,
      0,
      this.game.canvas.width * 2,
      this.game.canvas.height * 2,
      0,
      0.5
    );
    const text = this.add.text(
      this.physics.world.bounds.centerX,
      this.physics.world.bounds.centerY,
      'GAME OVER',
      {
        fontFamily: 'Arial',
        fontSize: '48px',
        fill: '#fff',
        align: 'center'
      }
    );
    text.setOrigin(0.5);

    if (this.newHighScore) {
      const highScoreText = this.add.text(
        this.physics.world.bounds.centerX,
        this.physics.world.bounds.centerY + 40,
        `NEW HIGH SCORE! ${this.highScore}`,
        {
          fontFamily: 'Arial',
          fontSize: '32px',
          fill: '#fff',
          align: 'center'
        }
      );
      highScoreText.setOrigin(0.5);
    }

    const restartButton = this.add.text(
      this.physics.world.bounds.centerX,
      this.physics.world.bounds.centerY + 100,
      'RESTART',
      {
        fontFamily: 'Arial',
        fontSize: '32px',
        fill: '#0f0'
      }
    );
    restartButton
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        this.scene.stop('game-play');
        this.endMusic.stop();
        this.sound.stopAll();
        this.scene.stop('game-over');
        this.game.scene.start('game-intro');
      });

    this.endMusic = this.sound.add('end-music');
    this.endMusic.play({
      volume: 0.3,
      loop: true
    });

    if (!this.soundEnabled) {
      this.endMusic.pause();
    }
  }
}

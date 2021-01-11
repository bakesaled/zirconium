import { SceneSound } from './scene-sound';
import BaseSound = Phaser.Sound.BaseSound;
import { GamePlayScene } from './game-play.scene';
import { GameOverScene } from './game-over.scene';

export class GameLifeLostScene extends Phaser.Scene implements SceneSound {
  private sndEnabled: boolean;

  lives: number;
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
    this.sound.mute = !this.sndEnabled;
    localStorage.setItem('sound-enabled', JSON.stringify(newValue));
  }

  constructor() {
    super({
      key: 'game-life-lost'
    });
  }

  preload() {}

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
      `${this.lives} LIVES REMAINING`,
      {
        fontFamily: 'Arial',
        fontSize: '48px',
        fill: '#fff',
        align: 'center'
      }
    );
    text.setOrigin(0.5);

    const continueButton = this.add.text(
      this.physics.world.bounds.centerX,
      this.physics.world.bounds.centerY + 110,
      'CONTINUE',
      {
        fontFamily: 'Arial',
        fontSize: '32px',
        fill: '#0f0'
      }
    );
    continueButton
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        const gamePlayScene = this.game.scene.getScene(
          'game-play'
        ) as GamePlayScene;
        this.endMusic.stop();
        this.sound.stopAll();
        this.scene.stop('game-life-lost');
        this.scene.setActive(false);
        gamePlayScene.reset();
        this.scene.resume('game-play');
      });

    const quitButton = this.add.text(
      this.physics.world.bounds.centerX,
      this.physics.world.bounds.centerY + 210,
      'QUIT',
      {
        fontFamily: 'Arial',
        fontSize: '32px',
        fill: '#0f0'
      }
    );
    quitButton
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        this.scene.stop('game-life-lost');
        this.scene.setActive(false);
        const scene: GameOverScene = this.game.scene.getScene(
          'game-over'
        ) as GameOverScene;
        scene.newHighScore = this.newHighScore;
        scene.highScore = this.highScore;
        // scene.scene.setActive(true);
        this.game.scene.start('game-over');
      });

    this.endMusic = this.sound.add('end-music');
    this.endMusic.play({
      volume: 0.4,
      loop: true
    });

    if (!this.soundEnabled) {
      this.sound.mute = true;
    }
  }
}

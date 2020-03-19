import BaseSound = Phaser.Sound.BaseSound;
import { SceneSound } from './scene-sound';

export class GameIntroScene extends Phaser.Scene implements SceneSound {
  private sndEnabled: boolean;

  startSound: BaseSound;

  get soundEnabled(): boolean {
    const soundEnabledString = localStorage.getItem('sound-enabled');
    if (soundEnabledString && soundEnabledString.length) {
      this.sndEnabled = JSON.parse(soundEnabledString);
    }
    return this.sndEnabled;
  }
  set soundEnabled(newValue: boolean) {
    this.sndEnabled = newValue;
    localStorage.setItem('sound-enabled', JSON.stringify(newValue));
  }

  constructor() {
    super({
      key: 'game-intro'
    });
  }

  preload() {
    const soundEnabledString = localStorage.getItem('sound-enabled');
    if (soundEnabledString && soundEnabledString.length) {
      this.soundEnabled = JSON.parse(soundEnabledString);
    }
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
      'ZIRCONIUM',
      {
        fontFamily: 'Arial',
        fontSize: '64px',
        fill: '#fff',
        align: 'center'
      }
    );
    text.setOrigin(0.5);

    let count = 3000;
    const countText = this.add
      .text(
        this.physics.world.bounds.centerX,
        this.physics.world.bounds.centerY + 50,
        `STARTING IN ${count / 1000}`,
        {
          fontFamily: 'Arial',
          fontSize: '32px',
          fill: '#fff',
          align: 'center'
        }
      )
      .setOrigin(0.5)
      .setVisible(false);
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (count <= 0) {
          this.scene.stop();
          this.scene.setActive(false);
          const scene = this.game.scene.getScene('game-play');
          scene.scene.setActive(true);
          this.game.scene.start('game-play');
          return;
        }
        countText.setVisible(true);
        countText.text = `STARTING IN ${count / 1000}`;
        if (this.soundEnabled) {
          this.startSound.play({ volume: 0.2 });
        }
        count -= 1000;
      }
    });

    this.startSound = this.sound.add('start-sound');
  }
}

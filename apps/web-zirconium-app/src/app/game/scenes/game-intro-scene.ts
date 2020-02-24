import { GameOverScene } from './game-over.scene';

export class GameIntroScene extends Phaser.Scene {
  newHighScore;
  highScore = 0;
  constructor() {
    super({
      key: 'game-intro'
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
        count -= 1000;
      }
    });
  }
}

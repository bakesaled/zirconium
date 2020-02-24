export class GameOverScene extends Phaser.Scene {
  newHighScore;
  highScore = 0;
  constructor() {
    super({
      key: 'game-over'
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
        this.scene.setActive(false);
        this.scene.stop();
        const scene: GameOverScene = this.game.scene.getScene(
          'game-play'
        ) as GameOverScene;
        scene.scene.setActive(true);
        this.game.scene.start('game-play');
      });
  }
}

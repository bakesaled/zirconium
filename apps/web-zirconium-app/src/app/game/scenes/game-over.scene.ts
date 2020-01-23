export class GameOverScene extends Phaser.Scene {
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
  }
}

import Phaser from 'phaser';

export enum CarState {
  IDLE,
  MOVING
}
export enum CarDirection {
  NORTH,
  EAST,
  SOUTH,
  WEST
}
export class CarEntity extends Phaser.Physics.Arcade.Sprite {
  static carSize = 32;
  carState: CarState;
  direction: CarDirection;

  movingSpeed: number;

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'car');
    this.movingSpeed = 0;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  startMoving() {
    this.carState = CarState.MOVING;
    this.movingSpeed = 100;
    this.setVelocityX(this.movingSpeed).setBounceX(0);
    // this.setVelocityY(this.movingSpeed).setBounceX(0);
  }

  startIdle() {
    this.carState = CarState.IDLE;
    this.movingSpeed = 0;
    this.setVelocityX(this.movingSpeed);
  }

  overlaps(targetCar: CarEntity): boolean {
    if (!targetCar) {
      return false;
    }
    const rect = targetCar.getBounds();
    return (
      this.x + CarEntity.carSize >= rect.left &&
      this.x + CarEntity.carSize <= rect.right &&
      this.y >= rect.top &&
      this.y <= rect.bottom
    );
  }
}

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

  movingSpeed: number;

  constructor(
    public scene: Phaser.Scene,
    public name: string,
    private direction: CarDirection,
    x: number,
    y: number
  ) {
    super(scene, x, y, name);
    this.movingSpeed = 0;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  startMoving() {
    this.carState = CarState.MOVING;
    this.movingSpeed = 100;
    this.setVelocityByDirection(this.movingSpeed);
  }

  startIdle() {
    this.carState = CarState.IDLE;
    this.movingSpeed = 0;
    this.setVelocityX(this.movingSpeed);
  }

  overlaps(otherCars: Phaser.Physics.Arcade.Group): boolean {
    if (!otherCars || !otherCars.getChildren().length) {
      return false;
    }
    const overlap = otherCars.getChildren().find((car: CarEntity) => {
      const rect = car.getBounds();
      return (
        this.x >= rect.left &&
        this.x <= rect.right &&
        this.y >= rect.top &&
        this.y <= rect.bottom
      );
    });

    return overlap !== undefined;
  }

  private setVelocityByDirection(speed: number) {
    switch (this.direction) {
      case CarDirection.EAST:
        this.setVelocityX(-speed).setBounceX(0);
        break;
      case CarDirection.NORTH:
        this.setVelocityY(speed).setBounceY(0);
        break;
      case CarDirection.WEST:
        this.setVelocityX(speed).setBounceX(0);
        break;
      case CarDirection.SOUTH:
        this.setVelocityY(-speed).setBounceY(0);
        break;
    }
  }
}

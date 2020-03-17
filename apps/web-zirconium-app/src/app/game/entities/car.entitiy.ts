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
export enum CarStart {
  SOUTH,
  WEST,
  NORTH,
  EAST
}
export class CarEntity extends Phaser.Physics.Arcade.Sprite {
  static carSize = 32;
  static collisionBounce = 0;
  static accelerationRate = 10;
  carState: CarState;

  movingSpeed: number;

  constructor(
    public scene: Phaser.Scene,
    public name: string,
    public direction: CarDirection,
    public start: Phaser.Types.Tilemaps.TiledObject,
    x: number,
    y: number
  ) {
    super(scene, x, y, name);
    this.movingSpeed = 0;
    this.carState = CarState.IDLE;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  startInitialMoving() {
    this.carState = CarState.MOVING;
    this.movingSpeed = 100;
    this.setVelocityByDirection(this.movingSpeed, false);
  }

  startMoving() {
    this.carState = CarState.MOVING;
    this.movingSpeed = 100;
    this.setImmovable(false);
    this.setVelocityByDirection(this.movingSpeed, true);
  }

  startIdle() {
    this.carState = CarState.IDLE;
    this.movingSpeed = 0;
    this.body.stop();
    this.setImmovable(true);
    // (<any>this.body).setAllowGravity(false);
  }

  overlaps(otherCars: Phaser.Physics.Arcade.Group): boolean {
    if (!otherCars || !otherCars.getChildren().length) {
      return false;
    }
    const overlap = otherCars.getChildren().find((car: CarEntity) => {
      const rect = car.getBounds();
      return (
        this.body.x >= rect.left &&
        this.body.x <= rect.right &&
        this.body.y >= rect.top &&
        this.body.y <= rect.bottom
      );
    });

    return overlap !== undefined;
  }

  inBounds() {
    return (
      this.body.x < this.body.world.bounds.width &&
      this.body.x > this.body.world.bounds.x &&
      this.body.y < this.body.world.bounds.height &&
      this.body.y > this.body.world.bounds.y
    );
  }

  private setVelocityByDirection(speed: number, accelerate: boolean) {
    switch (this.direction) {
      case CarDirection.EAST:
        this.setVelocityX(-speed).setBounceX(CarEntity.collisionBounce);
        if (accelerate) {
          this.setAccelerationX(-CarEntity.accelerationRate);
        }
        break;
      case CarDirection.NORTH:
        this.setVelocityY(speed).setBounceY(CarEntity.collisionBounce);
        if (accelerate) {
          this.setAccelerationY(CarEntity.accelerationRate);
        }
        break;
      case CarDirection.WEST:
        this.setVelocityX(speed).setBounceX(CarEntity.collisionBounce);
        if (accelerate) {
          this.setAccelerationX(CarEntity.accelerationRate);
        }
        break;
      case CarDirection.SOUTH:
        this.setVelocityY(-speed).setBounceY(CarEntity.collisionBounce);
        if (accelerate) {
          this.setAccelerationY(-CarEntity.accelerationRate);
        }
        break;
    }
  }
}

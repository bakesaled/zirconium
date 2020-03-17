import Phaser from 'phaser';
import { GamePlayScene } from '../scenes/game-play.scene';
import { CarDirection, CarEntity } from './car.entitiy';

export enum TrafficLightPhase {
  STOP,
  GO,
  CAUTION
}

export class TrafficLightEntity extends Phaser.Physics.Arcade.Sprite {
  static cautionTime = 2000;
  static goDelay = 1000;
  collider: Phaser.Physics.Arcade.Collider;
  overlap: Phaser.Physics.Arcade.Collider;
  phase: TrafficLightPhase;
  stoppedCar: CarEntity;
  lastCarThrough: CarEntity;

  constructor(
    public scene: GamePlayScene,
    public name: string,
    x: number,
    y: number,
    initialPhase: TrafficLightPhase
  ) {
    super(scene, x, y, name);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.immovable = true;

    switch (initialPhase) {
      case TrafficLightPhase.CAUTION:
        this.setCautionPhase();
        break;
      case TrafficLightPhase.GO:
        this.setGoPhase();
        break;
      default:
        this.setStopPhase();
    }
  }

  startStopPhase() {
    this.setCautionPhase();
    this.scene.time.addEvent({
      delay: TrafficLightEntity.cautionTime,
      loop: false,
      callback: () => {
        this.setStopPhase();
      }
    });
  }

  startGoPhase() {
    this.scene.time.addEvent({
      delay: TrafficLightEntity.cautionTime + TrafficLightEntity.goDelay,
      loop: false,
      callback: () => {
        this.setGoPhase();
      }
    });
  }

  setGoPhase() {
    this.phase = TrafficLightPhase.GO;
    this.setFrame(1);
    if (this.collider) {
      try {
        this.collider.destroy();
      } catch (e) {
        // sometimes this fails; eat it
      }
    }

    this.overlap = this.scene.physics.add.overlap(
      this.scene.cars,
      this,
      (light: TrafficLightEntity, car: CarEntity) => {
        this.onOverlap(light, car);
      }
    );

    if (this.stoppedCar) {
      this.stoppedCar.startMoving();
      const carsBehind = this.scene.cars
        .getChildren()
        .filter((c: CarEntity) => {
          return (
            c !== this.stoppedCar &&
            c.inBounds() &&
            c.start === this.stoppedCar.start
          );
        });
      for (let i = 0; i < carsBehind.length; i++) {
        const car: CarEntity = carsBehind[i] as CarEntity;
        const delay = 300 * (i + 1);
        this.scene.time.delayedCall(delay, () => {
          car.startMoving();
        });
      }
    }
  }

  setStopPhase() {
    this.phase = TrafficLightPhase.STOP;
    this.setFrame(2);
    if (this.overlap) {
      this.overlap.destroy();
    }
    this.collider = this.scene.physics.add.collider(
      this.scene.cars,
      this,
      (light: TrafficLightEntity, car: CarEntity) => {
        this.onCollide(light, car);
      }
    );
  }

  setCautionPhase() {
    this.phase = TrafficLightPhase.CAUTION;
    this.setFrame(0);
  }

  private onOverlap(light: TrafficLightEntity, car: CarEntity) {
    // only want to score points when overlap ends.
    const touching = !car.body.touching.none;
    // const wasTouching = !car.body.wasTouching.none;

    if (
      this.lastCarThrough !== car &&
      (!this.lastCarThrough ||
        ((this.lastCarThrough.direction === CarDirection.EAST &&
          this.lastCarThrough.body.x + 32 <= car.body.x) ||
          (this.lastCarThrough.direction === CarDirection.WEST &&
            this.lastCarThrough.body.x - 32 >= car.body.x) ||
          (this.lastCarThrough.direction === CarDirection.NORTH &&
            this.lastCarThrough.body.y - 32 >= car.body.y) ||
          (this.lastCarThrough.direction === CarDirection.SOUTH &&
            this.lastCarThrough.body.y + 32 <= car.body.y)))
    ) {
      if (touching) {
        this.lastCarThrough = car;
        this.scene.changeScore(100);
        this.scene.carCrossCount++;
        this.scene.changeLevel();
      }
    }
  }

  private onCollide(light: TrafficLightEntity, car: CarEntity) {
    this.stoppedCar = car;
  }
}

import Phaser from 'phaser';
import { GamePlayScene } from '../scenes/game-play.scene';
import { CarEntity } from './car.entitiy';

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
    this.enableBody(false, this.x, this.y, true, true);
    this.phase = TrafficLightPhase.GO;
    this.setFrame(1);
    if (this.collider) {
      this.collider.destroy();
    }

    this.overlap = this.scene.physics.add.overlap(
      this.scene.cars,
      this,
      (light: TrafficLightEntity) => {
        this.onOverlap(light);
      }
    );
  }

  setStopPhase() {
    this.enableBody(false, this.x, this.y, true, true);
    this.phase = TrafficLightPhase.STOP;
    this.setFrame(2);
    if (this.overlap) {
      this.overlap.destroy();
    }
    this.collider = this.scene.physics.add.collider(this.scene.cars, this);
  }

  setCautionPhase() {
    this.phase = TrafficLightPhase.CAUTION;
    this.setFrame(0);
  }

  private onOverlap(light: TrafficLightEntity) {
    // only want to score points when overlap ends.
    const touching = !light.body.touching.none;
    const wasTouching = !light.body.wasTouching.none;
    if (!touching && wasTouching) {
      light.disableBody(false, false);
    }
    if (touching && !wasTouching) {
      this.scene.changeScore(100);
      light.enableBody(false, light.x, light.y, true, true);
    }
  }
}

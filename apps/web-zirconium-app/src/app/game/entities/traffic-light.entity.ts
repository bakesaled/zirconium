import Phaser from 'phaser';
import { GamePlayScene } from '../scenes/game-play.scene';

export enum TrafficLightPhase {
  STOP,
  GO,
  CAUTION
}

export class TrafficLightEntity extends Phaser.Physics.Arcade.Sprite {
  static cautionTime = 2000;
  static goDelay = 1000;
  collider;
  phase: TrafficLightPhase;
  constructor(
    public scene: Phaser.Scene,
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
      this.collider.destroy();
    }
  }

  setStopPhase() {
    this.phase = TrafficLightPhase.STOP;
    this.setFrame(2);
    this.collider = this.scene.physics.add.collider(
      (<GamePlayScene>this.scene).cars,
      this
    );
  }

  setCautionPhase() {
    this.phase = TrafficLightPhase.CAUTION;
    this.setFrame(0);
  }
}

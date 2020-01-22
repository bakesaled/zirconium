import Phaser from 'phaser';
import { GamePlayScene } from '../scenes/game-play.scene';

export enum TrafficLightPhase {
  STOP,
  GO,
  CAUTION
}

export class TrafficLightEntity extends Phaser.Physics.Arcade.Sprite {
  collider;
  phase: TrafficLightPhase;
  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'light-east');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.immovable = true;
    this.startStopPhase();
    this.startGoPhase();
  }

  startStopPhase() {
    this.phase = TrafficLightPhase.STOP;
    this.setFrame(2);
    this.collider = this.scene.physics.add.collider(
      (<GamePlayScene>this.scene).cars,
      this
    );
  }

  startGoPhase() {
    this.phase = TrafficLightPhase.GO;
    this.setFrame(1);
    if (this.collider) {
      this.collider.destroy();
      // this.scene.physics.add.overlap((<GamePlayScene>this.scene).car, this);
    }
  }
}

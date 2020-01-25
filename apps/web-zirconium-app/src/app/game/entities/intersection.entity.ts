import * as Phaser from 'phaser';
import { TrafficLightEntity, TrafficLightPhase } from './traffic-light.entity';
import { GamePlayScene } from '../scenes/game-play.scene';

export enum IntersectionPhase {
  NORTH_SOUTH,
  EAST_WEST
}

export class IntersectionEntity extends Phaser.GameObjects.Zone {
  lights: Phaser.Physics.Arcade.StaticGroup;
  phase: IntersectionPhase;

  constructor(
    public scene: GamePlayScene,
    public name: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y, width, height);
    this.setOrigin(0.5, 0.5);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setInteractive();
    this.on('pointerdown', this.onPointerDown);

    const lightLocations = this.scene.lightsLayer.filter(o =>
      o.name.startsWith(this.name)
    );
    this.lights = this.scene.physics.add.staticGroup();
    lightLocations.forEach(loc => {
      let initialLightPhase = TrafficLightPhase.STOP;
      switch (loc.name.split('-')[2]) {
        case 'east':
        case 'west':
          initialLightPhase = TrafficLightPhase.GO;
      }
      const light = new TrafficLightEntity(
        this.scene,
        `light-${loc.name.split('-')[2]}`,
        loc.x,
        loc.y,
        initialLightPhase
      );
      this.lights.add(light);
    });
  }

  onPointerDown() {
    this.advanceLightCycle();
  }

  private advanceLightCycle() {
    this.lights.getChildren().forEach((light: TrafficLightEntity) => {
      if (light.phase === TrafficLightPhase.STOP) {
        light.startGoPhase();
      } else if (light.phase === TrafficLightPhase.GO) {
        light.startStopPhase();
      }
    });
  }
}

import * as Phaser from 'phaser';
import { TrafficLightEntity, TrafficLightPhase } from './traffic-light.entity';
import { GamePlayScene } from '../scenes/game-play.scene';

export enum IntersectionPhase {
  NORTH_SOUTH,
  EAST_WEST
}

export class IntersectionEntity extends Phaser.GameObjects.Zone {
  lights: TrafficLightEntity[];
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
    this.lights = [];
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
      this.lights.push(light);
    });

    // this.changeLights(light);
    // this.initLightCycle();
  }

  onPointerDown() {
    this.advanceLightCycle();
  }

  private advanceLightCycle() {
    this.lights.forEach(light => {
      if (light.phase === TrafficLightPhase.STOP) {
        light.startGoPhase();
      } else if (light.phase === TrafficLightPhase.GO) {
        light.startStopPhase();
      }
    });
  }
}

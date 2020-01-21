import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'main'
};

class MainScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  private car;
  constructor() {
    super(sceneConfig);
  }
  preload() {
    this.load.image('tiles', 'assets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/level-1.json');
    this.load.image('car', 'assets/car-red-east.png');
  }
  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tiles');
    const background = map.createStaticLayer('Background', tileset, 0, 0);
    const trees = map.createStaticLayer('Trees', tileset, 0, 0);

    // this.square = this.add.rectangle(400, 400, 100, 100, 0xffffff) as any;
    // this.physics.add.existing(this.square);

    this.car = this.add.sprite(16, 336, 'car');
    this.physics.add.existing(this.car);
  }
  update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();

    // if (cursorKeys.up.isDown) {
    //   this.square.body.setVelocityY(-500);
    // } else if (cursorKeys.down.isDown) {
    //   this.square.body.setVelocityY(500);
    // } else {
    //   this.square.body.setVelocityY(0);
    // }
    //
    // if (cursorKeys.right.isDown) {
    //   this.square.body.setVelocityX(500);
    // } else if (cursorKeys.left.isDown) {
    //   this.square.body.setVelocityX(-500);
    // } else {
    //   this.square.body.setVelocityX(0);
    // }
    this.car.body.setVelocityX(100);
  }
}

@Component({
  selector: 'zirconium-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 640,
      width: 640,
      scene: [MainScene],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          // gravity: { y: 100 }
          // debug: true
        }
      }
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
}

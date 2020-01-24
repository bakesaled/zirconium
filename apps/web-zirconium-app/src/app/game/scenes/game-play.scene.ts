import { CarEntity } from '../entities/car.entitiy';
import { IntersectionEntity } from '../entities/intersection.entity';

export class GamePlayScene extends Phaser.Scene {
  cars: Phaser.Physics.Arcade.Group;
  lightsLayer: Phaser.Types.Tilemaps.TiledObject[];
  tileset;
  constructor() {
    super({
      key: 'game-play'
    });
  }
  preload() {
    this.load.image('tiles', 'assets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/level-1.json');
    this.load.image('car', 'assets/car-red-east.png');
    this.load.spritesheet('light-west', 'assets/light-east.png', {
      frameWidth: 24,
      frameHeight: 24
    });
    this.load.spritesheet('light-east', 'assets/light-west.png', {
      frameWidth: 24,
      frameHeight: 24
    });
    this.load.spritesheet('light-south', 'assets/light-north.png', {
      frameWidth: 24,
      frameHeight: 24
    });
    this.load.spritesheet('light-north', 'assets/light-south.png', {
      frameWidth: 24,
      frameHeight: 24
    });
  }
  create() {
    const map = this.make.tilemap({ key: 'map' });
    this.tileset = map.addTilesetImage('tileset', 'tiles');
    const background = map.createStaticLayer('Background', this.tileset, 0, 0);
    const trees = map.createStaticLayer('Trees', this.tileset, 0, 0);
    const startsLayer = map.getObjectLayer('Starts')['objects'];
    this.lightsLayer = map.getObjectLayer('Lights')['objects'];
    const intersectionsLayer = map.getObjectLayer('Intersections')['objects'];
    // this.square = this.add.rectangle(400, 400, 100, 100, 0xffffff) as any;
    // this.physics.add.existing(this.square);
    // const light = new TrafficLightEntity(this, 284, 336);
    this.cars = this.physics.add.group();

    const intersection = new IntersectionEntity(
      this,
      intersectionsLayer[0].name,
      intersectionsLayer[0].x + intersectionsLayer[0].width / 2,
      intersectionsLayer[0].y + intersectionsLayer[0].height / 2,
      intersectionsLayer[0].width,
      intersectionsLayer[0].height
    );

    this.physics.add.collider(this.cars, this.cars);
    const start = startsLayer.find(o => o.name === 'west-0');
    this.spawnCars(start);
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
    // this.car.body.setVelocityX(100);
  }

  private spawnCars(start) {
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        const car = new CarEntity(this, start.x, start.y);

        const lastCar: CarEntity = this.cars.getLast(true);
        this.cars.add(car);
        if (car.overlaps(lastCar)) {
          this.endGame();
        }
        car.startMoving();
      }
    });
  }

  private endGame() {
    this.scene.pause('game-play');
    const scene = this.game.scene.getScene('game-over');
    scene.scene.setActive(true);
    this.game.scene.start('game-over');
  }
}

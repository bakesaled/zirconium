import { CarDirection, CarEntity } from '../entities/car.entitiy';
import { IntersectionEntity } from '../entities/intersection.entity';
import { GameOverScene } from './game-over.scene';
import TimerEvent = Phaser.Time.TimerEvent;

export class GamePlayScene extends Phaser.Scene {
  cars: Phaser.Physics.Arcade.Group;
  intersections: Phaser.Physics.Arcade.StaticGroup;
  startsLayer: Phaser.Types.Tilemaps.TiledObject[];
  lightsLayer: Phaser.Types.Tilemaps.TiledObject[];
  tileset;
  score;
  scoreText;
  highScore;
  highScoreText;
  newHighScore;
  level;
  levelText;
  carSpawnDelay;
  carCrossCount;
  carSpawnEvent: TimerEvent;
  constructor() {
    super({
      key: 'game-play'
    });
    this.score = 0;
    this.highScore = 0;
    this.level = 1;
    this.carSpawnDelay = 10000;
    this.carCrossCount = 0;
  }
  preload() {
    this.load.image('tiles', 'assets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/level-1.json');
    this.load.image('car-red-east', 'assets/car-red-east.png');
    this.load.image('car-red-west', 'assets/car-red-west.png');
    this.load.image('car-red-north', 'assets/car-red-north.png');
    this.load.image('car-red-south', 'assets/car-red-south.png');
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
    this.newHighScore = false;
    this.score = 0;
    this.level = 1;
    this.carSpawnDelay = 10000;
    this.carCrossCount = 0;
    this.cars = this.physics.add.group();
    this.intersections = this.physics.add.staticGroup();

    const map = this.make.tilemap({ key: 'map' });
    this.tileset = map.addTilesetImage('tileset', 'tiles');
    map.createStaticLayer('Background', this.tileset, 0, 0);
    map.createStaticLayer('Trees', this.tileset, 0, 0);
    this.startsLayer = map.getObjectLayer('Starts')['objects'];
    this.lightsLayer = map.getObjectLayer('Lights')['objects'];
    const intersectionsLayer = map.getObjectLayer('Intersections')['objects'];
    // this.square = this.add.rectangle(400, 400, 100, 100, 0xffffff) as any;
    // this.physics.add.existing(this.square);
    // const light = new TrafficLightEntity(this, 284, 336);

    const intersection = new IntersectionEntity(
      this,
      intersectionsLayer[0].name,
      intersectionsLayer[0].x + intersectionsLayer[0].width / 2,
      intersectionsLayer[0].y + intersectionsLayer[0].height / 2,
      intersectionsLayer[0].width,
      intersectionsLayer[0].height
    );
    this.intersections.add(intersection);

    this.initCars();

    this.scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '16px',
      fill: '#fff',
      stroke: '#333',
      strokeThickness: '2'
    });

    this.highScoreText = this.add.text(
      624,
      16,
      `high score: ${this.highScore}`,
      {
        fontSize: '16px',
        fill: '#fff',
        stroke: '#333',
        strokeThickness: '2',
        align: 'right',
        boundsAlignH: 'right',
        rtl: true
      }
    );

    this.add.text(16, 610, 'HINT: Tap the intersection.', {
      fontSize: '16px',
      fill: '#fff',
      stroke: '#333',
      strokeThickness: '2'
    });

    this.levelText = this.add.text(16, 40, 'level: 1', {
      fontSize: '16px',
      fill: '#fff',
      stroke: '#333',
      strokeThickness: '2'
    });
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

  changeScore(delta: number) {
    this.score += delta * this.level;
    this.scoreText.setText('score: ' + this.score);

    if (this.score > this.highScore) {
      this.newHighScore = true;
      this.highScore = this.score;
      this.highScoreText.setText('high score: ' + this.highScore);
    }
  }

  changeLevel() {
    if (this.carSpawnDelay === 0) {
      return;
    }
    if (this.carCrossCount % 10 === 0) {
      this.level++;
      this.carSpawnDelay -= 1000;
      this.carSpawnEvent.remove(false);
      this.spawnCars();
      this.levelText.setText('level: ' + this.level);
    }
  }

  private initCars() {
    this.physics.add.collider(this.cars, this.cars);
    this.startsLayer.forEach(start => {
      this.spawnCar(start);
    });
    this.spawnCars();
  }

  private spawnCars() {
    this.carSpawnEvent = this.time.addEvent({
      delay: this.carSpawnDelay,
      loop: true,
      callbackScope: this,
      callback: () => {
        this.startsLayer.forEach(start => {
          this.spawnCar(start);
        });
      }
    });
  }

  private spawnCar(start) {
    const direction: CarDirection =
      CarDirection[
        start.name.split('-')[0].toUpperCase() as keyof typeof CarDirection
      ];
    const car = new CarEntity(
      this,
      `car-red-${CarDirection[direction].toLowerCase()}`,
      direction,
      start,
      start.x,
      start.y
    );

    // const lastCar: CarEntity = this.cars.getLast(true);

    if (car.overlaps(this.cars)) {
      this.endGame();
    }
    this.cars.add(car);
    car.startInitialMoving();
  }

  private endGame() {
    this.scene.pause('game-play');
    const scene: GameOverScene = this.game.scene.getScene(
      'game-over'
    ) as GameOverScene;
    scene.newHighScore = this.newHighScore;
    scene.highScore = this.highScore;
    scene.scene.setActive(true);
    this.game.scene.start('game-over');
  }
}

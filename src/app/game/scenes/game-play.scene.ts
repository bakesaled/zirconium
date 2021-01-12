import { CarDirection, CarEntity, CarStart } from '../entities/car.entitiy';
import { IntersectionEntity } from '../entities/intersection.entity';
import { GameOverScene } from './game-over.scene';
import TimerEvent = Phaser.Time.TimerEvent;
import BaseSound = Phaser.Sound.BaseSound;
import { SceneSound } from './scene-sound';
import { GameLifeLostScene } from './game-life-lost.scene';
import { ZirConfig } from '../config';
import Sprite = Phaser.GameObjects.Sprite;

const INITIAL_LEVEL = 1;
const INITIAL_LIVES = 3;

export class GamePlayScene extends Phaser.Scene implements SceneSound {
  private sndEnabled: boolean;
  private collisionOccurred = false;

  cars: Phaser.Physics.Arcade.Group;
  intersections: Phaser.Physics.Arcade.StaticGroup;
  startsLayer: Phaser.Types.Tilemaps.TiledObject[];
  lightsLayer: Phaser.Types.Tilemaps.TiledObject[];
  tileset;
  score;
  scoreText;
  highScr = 0;
  highScoreText;
  newHighScore;
  level;
  levelText;
  lives;
  livesText;
  livesCars: Sprite[];
  carSpawnDelay;
  carCrossCount;
  carSpawnEvent: TimerEvent;
  bgMusic: BaseSound;
  crashSound: BaseSound;
  levelUpSound: BaseSound;
  tapSound: BaseSound;
  scoreSound: BaseSound;

  get soundEnabled(): boolean {
    const soundEnabledString = localStorage.getItem('sound-enabled');
    if (soundEnabledString && soundEnabledString.length) {
      this.sndEnabled = JSON.parse(soundEnabledString);
    }
    return this.sndEnabled;
  }
  set soundEnabled(newValue: boolean) {
    this.sndEnabled = newValue;
    this.sound.mute = !this.sndEnabled;
    localStorage.setItem('sound-enabled', JSON.stringify(newValue));
  }

  get highScore(): number {
    const soundEnabledString = localStorage.getItem('high-score');
    if (soundEnabledString && soundEnabledString.length) {
      this.highScr = JSON.parse(soundEnabledString);
    }
    return this.highScr;
  }
  set highScore(newValue: number) {
    this.highScr = newValue;
    localStorage.setItem('high-score', JSON.stringify(newValue));
  }

  constructor() {
    super({
      key: 'game-play'
    });
    this.score = 0;
    // this.highScore = 0;
    this.level = INITIAL_LEVEL;
    this.lives = INITIAL_LIVES;
    this.carSpawnDelay = 10000 - INITIAL_LEVEL * 1000;
    this.carCrossCount = 0;
  }
  preload() {}
  create() {
    this.collisionOccurred = false;
    this.newHighScore = false;
    this.score = 0;
    this.level = INITIAL_LEVEL;
    this.lives = INITIAL_LIVES;
    this.carSpawnDelay = 10000 - INITIAL_LEVEL * 1000;
    this.carCrossCount = 0;
    this.cars = this.physics.add.group();
    this.intersections = this.physics.add.staticGroup();

    this.bgMusic = this.sound.add('bg-music');
    this.crashSound = this.sound.add('crash-sound');
    this.levelUpSound = this.sound.add('level-up-sound');
    this.scoreSound = this.sound.add('start-sound');
    this.tapSound = this.sound.add('tap-sound');

    const map = this.make.tilemap({ key: 'map' });
    this.tileset = map.addTilesetImage('tileset', 'tiles');
    map.createStaticLayer('Background', this.tileset, 0, 0);
    map.createStaticLayer('Trees', this.tileset, 0, 0);
    this.startsLayer = map.getObjectLayer('Starts').objects;
    this.lightsLayer = map.getObjectLayer('Lights').objects;
    const intersectionsLayer = map.getObjectLayer('Intersections').objects;
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

    this.scoreText = this.add.text(16, 16, [`SCORE`, '0'], {
      fontSize: ZirConfig.GAME_FONT_SIZE,
      fontFamily: ZirConfig.GAME_FONT_FAMILY,
      fill: '#fff',
      stroke: '#333',
      strokeThickness: 1,
      lineSpacing: 1
    });

    this.highScoreText = this.add.text(
      624,
      16,
      [`HIGH SCORE`, this.highScore.toString()],
      {
        fontSize: ZirConfig.GAME_FONT_SIZE,
        fontFamily: ZirConfig.GAME_FONT_FAMILY,
        fill: '#fff',
        stroke: '#333',
        strokeThickness: 1,
        align: 'right',
        boundsAlignH: 'right',
        rtl: true,
        lineSpacing: 1
      }
    );

    this.add.text(16, 570, ['HINT:', 'Tap the intersection'], {
      fontSize: ZirConfig.GAME_FONT_SIZE,
      fontFamily: ZirConfig.GAME_FONT_FAMILY,
      fill: '#fff',
      stroke: '#333',
      strokeThickness: 1,
      lineSpacing: 1
    });

    this.levelText = this.add.text(16, 84, ['LEVEL', this.level.toString()], {
      fontSize: ZirConfig.GAME_FONT_SIZE,
      fontFamily: ZirConfig.GAME_FONT_FAMILY,
      fill: '#ffdb4d',
      stroke: '#333',
      strokeThickness: 1,
      lineSpacing: 1
    });

    this.livesText = this.add.text(130, 16, ['CARS'], {
      fontSize: ZirConfig.GAME_FONT_SIZE,
      fontFamily: ZirConfig.GAME_FONT_FAMILY,
      fill: '#fff',
      stroke: '#333',
      strokeThickness: 1,
      lineSpacing: 1
    });

    this.updateLivesText();

    this.bgMusic.play({
      volume: 0.4,
      loop: true
    });

    if (!this.soundEnabled) {
      this.sound.mute = true;
    }
  }
  update() {}

  updateLivesText() {
    if (this.livesCars) {
      this.livesCars.forEach(car => {
        car.destroy(true);
      });
    }
    this.livesCars = [];
    for (let i = 0; i < this.lives; i++) {
      this.livesCars.push(this.add.sprite(145 + i * 32, 56, 'car-red-east'));
    }
  }

  reset() {
    this.cars.clear(true, false);
    this.collisionOccurred = false;

    if (this.soundEnabled) {
      this.bgMusic.play({
        volume: 0.4,
        loop: true
      });
    }
  }

  changeScore(delta: number) {
    this.score += delta * this.level;
    this.scoreText.setText(['SCORE', this.score]);
    if (this.soundEnabled) {
      this.scoreSound.play({
        volume: 0.1,
        detune: 1000
      });
    }

    if (this.score > this.highScore) {
      this.newHighScore = true;
      this.highScore = this.score;
      this.highScoreText.setText(['HIGH SCORE', this.highScore]);
    }
  }

  changeLevel() {
    if (this.carSpawnDelay === 0) {
      return;
    }
    if (this.carCrossCount % 10 === 0) {
      this.level++;
      if (this.carSpawnDelay <= 1000) {
        this.carSpawnDelay -= 100;
      } else if (this.carSpawnDelay > 0) {
        this.carSpawnDelay -= 1000;
      }
      this.carSpawnEvent.remove(false);
      this.spawnCars();
      this.levelText.setText(['LEVEL', this.level]);
      if (this.soundEnabled) {
        this.levelUpSound.play({
          volume: 0.2
        });
      }
      const bigLevelUpText = this.add.text(70, 84, 'LEVEL UP', {
        fontSize: '42px',
        fontFamily: ZirConfig.GAME_FONT_FAMILY,
        fill: '#ffdb4d',
        stroke: '#333',
        strokeThickness: 2
      });

      this.add.tween({
        targets: [bigLevelUpText],
        ease: 'Linear',
        duration: 2000,
        delay: 0,
        alpha: {
          from: 1,
          to: 0
        }
      });
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
      `car-red-${CarStart[direction].toLowerCase()}`,
      direction,
      start,
      start.x,
      start.y
    );

    // const lastCar: CarEntity = this.cars.getLast(true);

    if (car.overlaps(this.cars)) {
      car.destroy(true);
      if (!this.collisionOccurred) {
        this.collisionOccurred = true;
        this.reduceLife();
      }
      return;
    }
    this.cars.add(car);
    car.startInitialMoving();
  }

  private reduceLife() {
    this.bgMusic.pause();
    if (this.soundEnabled) {
      this.crashSound.play({
        volume: 0.3
      });
    }
    this.lives--;
    this.updateLivesText();
    if (this.lives === 0) {
      this.endGame();
    } else {
      this.scene.pause('game-play');
      this.scene.setActive(false);
      const scene: GameLifeLostScene = this.game.scene.getScene(
        'game-life-lost'
      ) as GameLifeLostScene;
      scene.lives = this.lives;
      scene.newHighScore = this.newHighScore;
      scene.highScore = this.highScore;
      scene.scene.setActive(true);
      this.game.scene.start('game-life-lost');
    }
  }

  private endGame() {
    this.scene.pause('game-play');
    this.scene.setActive(false);
    const scene: GameOverScene = this.game.scene.getScene(
      'game-over'
    ) as GameOverScene;
    scene.newHighScore = this.newHighScore;
    scene.highScore = this.highScore;
    // scene.scene.setActive(true);
    this.game.scene.start('game-over');
  }
}

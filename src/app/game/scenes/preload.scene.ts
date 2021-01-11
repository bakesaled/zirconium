import { ZirConfig } from '../config';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'game-preload'
    });
  }

  preload() {
    this.progress();

    this.load.audio('start-sound', 'assets/43_select_4.wav');
    this.load.audio('bg-music', 'assets/game-play-music.mp3');
    this.load.audio('crash-sound', 'assets/24_boom_5.wav');
    this.load.audio('level-up-sound', 'assets/37_score.wav');
    this.load.audio('tap-sound', 'assets/28_item_1.wav');
    this.load.audio('end-music', 'assets/end-music.mp3', {
      instances: 1
    });

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
    this.scene.stop();
    this.game.scene.start('game-intro');
  }

  private progress() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'LOADING...',
      style: {
        fontFamily: ZirConfig.GAME_FONT_FAMILY,
        fontSize: '20px',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        fontFamily: ZirConfig.GAME_FONT_FAMILY,
        fontSize: '20px',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        fontFamily: ZirConfig.GAME_FONT_FAMILY,
        fontSize: '20px',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', value => {
      percentText.setText(value * 100 + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', file => {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }
}

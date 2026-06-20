import { Level1Scene } from './scenes/Level1Scene.js';
import { W, H } from './config.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#14241a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: W,
    height: H,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1100 }, debug: true },
  },
  scene: [Level1Scene],
};

new Phaser.Game(config);

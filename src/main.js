import { Level1Scene } from './scenes/Level1Scene.js';
import { W, H } from './config.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#87ceeb',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: W,
    height: H,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [Level1Scene],
};

// eslint-disable-next-line no-new
new Phaser.Game(config);

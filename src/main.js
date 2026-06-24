import { Level1Scene } from './scenes/Level1Scene.js';

const config = {
  type: Phaser.AUTO,
  parent: document.body,
  backgroundColor: '#14241a',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1100 }, debug: false },
  },
  scene: [Level1Scene],
};

new Phaser.Game(config);

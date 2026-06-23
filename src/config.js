export const W = 960;
export const H = 540;
export const TILE = 128;           // tilemap cell size in pixels
export const WORLD_W = 14080;      // 110 * TILE
export const WORLD_H = 1536;       // 12 * TILE
export const LOW = 1280;           // row 10 * TILE — top surface of ground tiles
export const HIGH = 896;           // row 7 * TILE (placeholder for upper ledges)

export const HEROES = {
  fire:  { name: 'Fire',   color: 0xff5a3c, letter: 'F', atk: 'ranged', cd: 1300, kills: ['ice'] },
  water: { name: 'Water',  color: 0x3aa0ff, letter: 'W', atk: 'ranged', cd: 480,  kills: ['fireD', 'poisonD'], cross: 'water' },
  earth: { name: 'Earth',  color: 0xc08a4e, letter: 'E', atk: 'melee',  cd: 300,  kills: [] },
  stone: { name: 'Stone',  color: 0x9a8c7a, letter: 'S', atk: 'ranged', cd: 800,  kills: ['waterD'] },
  poison:{ name: 'Poison', color: 0x7ad14a, letter: 'P', atk: 'ranged', cd: 430,  kills: ['acidD'], cross: 'acid' },
  rubber:{ name: 'Rubber', color: 0xe85aa0, letter: 'R', atk: 'melee',  cd: 300,  kills: [] },
};

export const ORDER = ['fire', 'water', 'earth', 'stone', 'poison', 'rubber'];

export const COUNTER = {
  ice:     'Fire',
  fireD:   'Water',
  waterD:  'Stone',
  poisonD: 'Water',
  acidD:   'Poison',
};

export const ENEMY_TINT = {
  ice:     0x9fe3ff,
  fireD:   0xff6a4d,
  waterD:  0x4d8dff,
  poisonD: 0x86e05a,
  acidD:   0xc9e84a,
};

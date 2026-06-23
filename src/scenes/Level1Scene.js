import { W, H, TILE, LOW, HIGH, WORLD_W, WORLD_H, HEROES, ORDER, COUNTER, ENEMY_TINT } from '../config.js';
import { saveSystem } from '../systems/save.js';
import { audioManager } from '../systems/audio.js';

export class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
  }

  preload() {
    // real sprites
    this.load.image('hero_fire',   'assets/sprites/fire-300.png');
    this.load.image('hero_water',  'assets/sprites/water-300.png');
    this.load.image('hero_earth',  'assets/sprites/earth-300.png');
    this.load.image('hero_stone',  'assets/sprites/stone-300.png');
    this.load.image('hero_poison', 'assets/sprites/poison-300.png');
    this.load.image('hero_ice',    'assets/sprites/ice-300.png');
    this.load.image('hero_rubber', 'assets/sprites/rubber.png');

    // parallax background layers
    this.load.image('1-1-back',  'assets/sprites/1-1-back.png');
    this.load.image('1-1-mid',   'assets/sprites/1-1-mid.png');
    this.load.image('1-1-front', 'assets/sprites/1-1-front.png');
    this.load.image('1-2-back',  'assets/sprites/1-2-back.png');
    this.load.image('1-2-mid',   'assets/sprites/1-2-mid.png');
    this.load.image('1-2-front', 'assets/sprites/1-2-front.png');

    // environment / props
    this.load.image('ground-tile',  'assets/sprites/ground-tile.png');
    this.load.image('mound',        'assets/sprites/mound.png');
    this.load.image('platform',     'assets/sprites/platform.png');
    this.load.image('golden-apple', 'assets/sprites/golden-apple.png');
    this.load.image('acid',         'assets/sprites/acid.png');
    this.load.image('aqua',         'assets/sprites/aqua.png');
    this.load.image('chasm',        'assets/sprites/chasm.png');
    this.load.image('bridge',        'assets/sprites/bridge.png');
    this.load.image('master-dragon', 'assets/sprites/master-dragon.png');
    this.load.image('tree',          'assets/sprites/tree.png');
    this.load.image('fire-bush',     'assets/sprites/fire-bush.png');
    this.load.on('loaderror', () => {});

    // dragon enemies
    this.load.image('d_ice',     'assets/sprites/ice-dragon.png');
    this.load.image('d_water',   'assets/sprites/water-dragon.png');
    this.load.image('d_poison',  'assets/sprites/poison-dragon.png');
    this.load.image('d_acid',    'assets/sprites/acid-dragon.png');
    this.load.image('d_regular', 'assets/sprites/regular-dragon.png');

    // tilemap JSON + per-tile images (gid → flat filename in assets/tiles/)
    this.load.json('mapdata', 'assets/maps/first.json');
    const TILE_FILES = {
      1: 'ground-below',       2: 'ground-top-left',     3: 'ground-top-mid',
      4: 'ground-top-right',   5: 'ground-cliff-left',   6: 'ground-cliff-right',
      7: 'ground-cliff-water-bottom', 8: 'ground-cliff-water-top',
      9: 'water-bottom',       10: 'water-top',
      11: 'village-barrel',    12: 'village-bush-1',     13: 'village-bush-2',
      14: 'village-bush-3',    15: 'village-canon',      16: 'village-crate',
      17: 'village-maces',     18: 'village-shield-crest', 19: 'village-shield-round',
      20: 'village-spears',    21: 'village-swords',
      36: 'Well',              37: 'tree-2',
    };
    Object.entries(TILE_FILES).forEach(([gid, f]) =>
      this.load.image('tile_' + gid, `assets/tiles/${f}.png`));

    // placeholder textures for heroes without art yet
    const h = this.make.graphics({ add: false });
    h.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, 30, 42, 8);
    h.generateTexture('hero', 30, 42);

    const d = this.make.graphics({ add: false });
    d.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, 46, 32, 9);
    d.generateTexture('dragon', 46, 32);

    const b = this.make.graphics({ add: false });
    b.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, 90, 70, 16);
    b.generateTexture('boss', 90, 70);

    const p = this.make.graphics({ add: false });
    p.fillStyle(0xffffff, 1).fillRect(0, 0, 1, 1);
    p.generateTexture('px', 1, 1);
  }

  create() {
    this._resetState();

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H + 260);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.enemies = this.physics.add.group();
    this.shots   = this.physics.add.group();

    this._buildParallax();
    this._buildTilemap();
    this._buildPlayer();   // must exist before any overlap/collider references it
    this._buildGates();
    this._buildEnemies();
    this._buildPickups();
    this._buildBoss();
    this._buildHUD();
    this._buildMenu();
    this._bindInput();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.gates.waterPool.solid, null, () => this.cur === 'water');
    this.physics.add.collider(this.player, this.gates.acidPool.solid,  null, () => this.cur === 'poison');
    this.physics.add.overlap(this.player, this.enemies, (pl, e) => { if (e.active) this._hurt(1, e.x); });
    this.physics.add.overlap(this.shots,  this.enemies, (shot, e) => this._hitEnemy(shot, e));

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(240, 400);

    const best = this.saveData.bestTime;
    const bestLine = best ? `\nBest time: ${this._fmtTime(best)}` : '';
    this._showPanel('ELEMENTAL HEROES',
      `LEVEL 1 — The Jungle\nReach the cave at the end.\nEvery obstacle has one hero that beats it.${bestLine}\n\nPress any key or tap to begin`);
    this.physics.pause();
  }

  update(time, delta) {
    if (!this.started) {
      if (this._anyKey() || this.input.activePointer.isDown) this._startGame();
      return;
    }
    if (this.over) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.r)) { this.scene.restart(); return; }
      return;
    }

    this.timeLeft -= delta / 1000;
    if (this.timeLeft <= 0) { this.timeLeft = 0; this._updateTimer(); return this._loseHard('TIME UP'); }
    this._updateTimer();
    this._updateParallax();

    if (Phaser.Input.Keyboard.JustDown(this.keys.tab)) this._toggleMenu();
    if (this.menuOpen) { this._menuKeys(); return; }
    ORDER.forEach((k, i) => { if (Phaser.Input.Keyboard.JustDown(this.keys['n' + (i + 1)])) this._swap(k); });

    if (this.gates.grapple.busy) return;

    // movement
    const left  = this.cursors.left.isDown  || this.keys.a.isDown;
    const right = this.cursors.right.isDown || this.keys.d.isDown;
    if (left)       { this.player.setAccelerationX(-1900); this.player.facing = -1; }
    else if (right) { this.player.setAccelerationX(1900);  this.player.facing =  1; }
    else            { this.player.setAccelerationX(0); }

    // jump
    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    if ((this._jp(this.cursors.up) || this._jp(this.keys.w) || this._jp(this.keys.space)) && onGround)
      this.player.setVelocityY(-560);

    // attack & ability
    if (this._jp(this.keys.e) && time > this.nextShot) { this.nextShot = time + HEROES[this.cur].cd; this._attack(); }
    if (this._jp(this.keys.q)) this._ability();

    this.enemies.children.iterate(e => { if (e && e.active) this._tickEnemy(e); });
    this._tickBoss(time, delta);

    this.player.setAlpha(this.time.now < this.invulnUntil ? (Math.floor(this.time.now / 80) % 2 ? 0.4 : 1) : 1);

    // advance checkpoint (forward only, in-session only)
    for (let i = this.cp + 1; i < this.checkpoints.length; i++) {
      if (this.player.x > this.checkpoints[i].x) this.cp = i;
    }

    if (this.player.y > WORLD_H + 90 && !this.over) this._respawn(true);

    this._updateHint();
  }

  // -------------------------------------------------------------------------
  // Build helpers
  // -------------------------------------------------------------------------

  _buildParallax() {
    // two parallax sets: section 1 (jungle floor) and section 2 (1-2, the boss
    // bridge area). Both lock to the camera; the second crossfades in near x≈3500.
    this.SECTION2_X = 3500;   // world x where the 1-2 backdrop has fully taken over
    const factors = [
      { suffix: 'back',  factor: 0.15, depth: -30 },
      { suffix: 'mid',   factor: 0.40, depth: -20 },
      { suffix: 'front', factor: 0.75, depth: -10 },
    ];
    const buildSet = (prefix, baseAlpha, depthShift) => {
      const layers = [];
      factors.forEach(d => {
        const key = `${prefix}-${d.suffix}`;
        if (!this.textures.exists(key)) return;
        const ts = this.add.tileSprite(0, 0, W, H, key)
          .setOrigin(0, 0).setScrollFactor(0).setDepth(d.depth + depthShift).setAlpha(baseAlpha);
        const src = this.textures.get(key).getSourceImage();
        const scale = H / src.height;
        ts.tileScaleX = scale; ts.tileScaleY = scale; ts.factor = d.factor;
        layers.push(ts);
      });
      return layers;
    };
    this.bgLayers  = buildSet('1-1', 1, 0);
    this.bgLayers2 = buildSet('1-2', 0, 1);   // sits just in front, faded out at start
  }

  _updateParallax() {
    if (!this.bgLayers) return;
    const sx = this.cameras.main.scrollX;
    this.bgLayers.forEach(l => { l.tilePositionX = (sx * l.factor) / l.tileScaleX; });
    if (this.bgLayers2 && this.bgLayers2.length) {
      // fade 1-2 in over a 600px band ending at SECTION2_X
      const t = Phaser.Math.Clamp((this.player.x - (this.SECTION2_X - 600)) / 600, 0, 1);
      this.bgLayers2.forEach(l => {
        l.tilePositionX = (sx * l.factor) / l.tileScaleX;
        l.setAlpha(t);
      });
    }
  }

  _buildTilemap() {
    const GID_MASK = 0x1FFFFFFF;
    const FLIP_H   = 0x80000000;
    const mapData  = this.cache.json.get('mapdata');
    const mapCols  = mapData.width;  // 110

    // Render every tile layer — decorative images only, no per-tile physics
    mapData.layers.forEach((layer, li) => {
      if (layer.type !== 'tilelayer') return;
      for (let i = 0; i < layer.data.length; i++) {
        const raw = layer.data[i];
        if (!raw) continue;
        const gid   = raw & GID_MASK;
        const flipH = !!(raw & FLIP_H);
        const col   = i % mapCols;
        const row   = Math.floor(i / mapCols);
        const key   = 'tile_' + gid;
        if (this.textures.exists(key)) {
          const img = this.add.image(col * TILE, (row + 1) * TILE, key)
            .setOrigin(0, 1).setDepth(li - 5);
          if (flipH) img.setFlipX(true);
        }
      }
    });

    // ONE solid physics strip covering cols 5-52 (the continuous ground span across
    // both the "ground" layer and the "buildings" layer fill at cols 25-41).
    // Top of strip = LOW = 1280, matching the tilemap's row-10 surface.
    const gSC = 5, gEC = 52;
    const gW  = (gEC - gSC + 1) * TILE;   // 6144 px
    const gX  = gSC * TILE + gW / 2;       // 3712
    const gY  = LOW + TILE / 2;            // 1344 (center of row-10 tile)
    const strip = this.add.rectangle(gX, gY, gW, TILE, 0, 0);
    this.physics.add.existing(strip, true);
    this.platforms.push(strip);

    // Apple ledge — collision top aligns with LOW - 74
    const ledge = this._block(1180, LOW - 65, 140, 18, 0x6b5235);
    ledge.setVisible(false);
    this._platformArt(1180, 0, 200);

    // Fall-through kill net at the bottom of the world
    const net = this.add.rectangle(WORLD_W / 2, WORLD_H + 200, WORLD_W, 40, 0, 0);
    this.physics.add.existing(net, true);
    this.platforms.push(net);
  }

  // A fire bush: fire-bush art (falls back to a tinted tree) plus a flickering
  // glow and a collision+damage zone. Returns a handle with { sprite, glow, zone,
  // x, doused }. While not doused it BLOCKS the player and BURNS on contact.
  _fireBush(x, dispW, opts = {}) {
    const hasBush = this.textures.exists('fire-bush');
    const key = hasBush ? 'fire-bush' : (this.textures.exists('tree') ? 'tree' : null);
    const sprite = key ? this._propImg(key, x, LOW, dispW, 2) : null;
    if (sprite && !hasBush) sprite.setTint(0xff6620);
    const glow = this.add.rectangle(x, LOW - dispW * 0.5, dispW * 0.85, dispW * 1.1, 0xff4400, 0.18).setDepth(1);
    this.tweens.add({ targets: glow, alpha: { from: 0.10, to: 0.30 }, duration: 280, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    // collision/damage zone covers the burning trunk (a bit narrower than the art).
    // Tall zones can't be jumped (must be doused); short ones can be hopped over.
    const zh = opts.zh || 70;
    const zw = Math.max(34, dispW * (opts.zwFactor || 0.5));
    const zone = this._zone(x, LOW - zh / 2 + 6, zw, zh, 0, 0);
    const bush = { sprite, glow, zone, x, doused: false };
    this.physics.add.collider(this.player, zone, null, () => !bush.doused);
    this.physics.add.overlap(this.player, zone, () => this._hurt(1, x), () => !bush.doused);
    this.fireBushes.push(bush);
    return bush;
  }

  // douse a fire bush (Earth) — stops it blocking/burning and fades the art out
  _douseBush(bush) {
    if (!bush || bush.doused) return;
    bush.doused = true;
    const fades = [bush.sprite, bush.glow].filter(Boolean);
    if (fades.length) this.tweens.add({ targets: fades, alpha: 0, duration: 240, onComplete: () => fades.forEach(o => o.destroy()) });
  }

  // a tree.png decoration (no collision) for non-fire scenery
  _decorTree(x, dispW) {
    if (this.textures.exists('tree')) this._propImg('tree', x, LOW, dispW, -1);
  }

  // a bottom-anchored decorative image (returns the image)
  _propImg(key, x, baseY, dispW, depth) {
    const src = this.textures.get(key).getSourceImage();
    const scale = dispW / src.width;
    return this.add.image(x, baseY, key)
      .setOrigin(0.5, 1)
      .setDisplaySize(dispW, src.height * scale)
      .setDepth(depth);
  }

  _prop(key, x, baseY, dispW, depth) {
    this._propImg(key, x, baseY, dispW, depth);
  }

  // platform art: bottom anchored at baseY, top surface approximately at surfaceY
  _platformArt(x, surfaceY, dispW) {
    const src = this.textures.get('platform').getSourceImage();
    const scale = dispW / src.width;
    const dispH = src.height * scale;
    this.add.image(x, LOW, 'platform')
      .setOrigin(0.5, 1)
      .setDisplaySize(dispW, dispH)
      .setDepth(-1);
  }

  _buildGates() {
    // 1) CRACK — solid mound wall, taller than a jump so it must be broken by Earth
    // +12 pushes the 28px transparent bottom margin below LOW so the dirt sits on the ground
    const moundImg = this._propImg('mound', 820, LOW + 12, 260, 2);
    const wall = this._block(820, LOW - 85, 92, 170, 0x355640);
    wall.setVisible(false);
    this.gates.crack = { obj: wall, mound: moundImg, x: 820, broken: false };
    this.physics.add.collider(this.player, wall, null, () => !this.gates.crack.broken);
    this.physics.add.collider(this.enemies, wall, null, () => !this.gates.crack.broken);

    // 2) FIRE WALL — two fire bushes side by side, too tall to jump, so the
    // player must douse them with Earth. Each is a real burning hazard.
    const fwL = this._fireBush(1500, 70, { zh: 150, zwFactor: 0.7 });
    const fwR = this._fireBush(1548, 70, { zh: 150, zwFactor: 0.7 });
    this.gates.fireWall = { x: 1524, doused: false, bushes: [fwL, fwR] };

    // big mid-level fire bush between the water and acid pools (jump-over hazard)
    this._fireBush(3380, 150);

    // 3) GRAPPLE CHASM (gap 1950–2300)
    this._poolImg('chasm', 2125, LOW, 380);
    this.add.star(2125, LOW - 220, 4, 5, 12, 0xffe27a).setDepth(3);
    this.gates.grapple = { x1: 1860, x2: 1948, from: 2125, to: 2330, busy: false };

    // 4) STONE CRUSH
    this.gates.stoneSpot = { x: 2700, used: false };

    // 5) ACID POOL (3750–4050) — moved right to allow burning-tree section
    const ax = (3750 + 4050) / 2, aw = 300;
    this._poolImg('acid', ax, LOW, aw + 20);
    const acidSolid = this._zone(ax, LOW + 8,  aw, 16, 0, 0);
    const acidWater = this._zone(ax, LOW + 34, aw, 70, 0, 0);
    this.gates.acidPool = { solid: acidSolid, water: acidWater, x: ax };
    this.physics.add.overlap(this.player, acidWater, () => this._hurt(1, this.player.x + 1, true), () => this.cur !== 'poison');

    // 2b) WATER POOL (~2980)
    const wx = 2980, ww = 240;
    this._poolImg('aqua', wx, LOW, ww + 20);
    const waterSolid = this._zone(wx, LOW + 8,  ww, 16, 0, 0);
    const waterWater = this._zone(wx, LOW + 34, ww, 70, 0, 0);
    this.gates.waterPool = { solid: waterSolid, water: waterWater, x: wx };
    this.physics.add.overlap(this.player, waterWater, () => this._hurt(1, this.player.x + 1, true), () => this.cur !== 'water');
  }

  _buildEnemies() {
    // Section 1 (pre-chasm)
    this._addEnemy(1000, LOW - 20, 'ice',     'patrol',  940, 1120);
    this._addEnemy(1740, LOW - 20, 'fireD',   'patrol', 1680, 1860);

    // Section 2 (post-chasm)
    this._addEnemy(2480, LOW - 20, 'waterD',  'patrol', 2400, 2560);
    for (let i = 0; i < 2; i++) this._addEnemy(2640 + i * 80, LOW - 20, 'ice', 'advance', 2560, 2760);
    this._addEnemy(2860, LOW - 20, 'poisonD', 'patrol', 2800, 2930);

    // Section 3 — burning-tree zone (between water pool and acid pool)
    this._addEnemy(3200, LOW - 20, 'waterD', 'patrol', 3120, 3320);  // left of tree
    this._addEnemy(3550, LOW - 20, 'ice',    'patrol', 3420, 3640);  // right of tree
    this._addEnemy(3680, LOW - 20, 'fireD',  'patrol', 3600, 3750);  // approaching acid

    // Section 3b — acid pool flankers
    this._addEnemy(3780, LOW - 20, 'acidD', 'patrol', 3755, 3840);
    this._addEnemy(4020, LOW - 20, 'acidD', 'patrol', 3970, 4050);

    // Section 4 — post-acid landing pad leading into the boss arena
    this._addEnemy(4110, LOW - 20, 'waterD', 'advance', 4055, 4240);
    this._addEnemy(4180, LOW - 20, 'ice',    'advance', 4055, 4240);
  }

  _buildPickups() {
    // chest — use the apple sprite as pickup visual, hidden zone for collision
    const chestZone = this._zone(950, LOW - 28, 40, 40, 0, 0);
    this.gates.chestSprite = this.add.image(950, LOW - 28, 'golden-apple').setDisplaySize(38, 38).setDepth(2);
    this.gates.chest = { obj: chestZone, opened: false };
    this.physics.add.overlap(this.player, chestZone, () => this._openChest());

    // apple at the platform ledge (ledge top = LOW-87)
    this.gates.apple = this.physics.add.sprite(1180, LOW - 105, 'golden-apple').setDisplaySize(34, 34);
    this.gates.apple.body.setAllowGravity(false);
    this.gates.apple.disableBody(true, true);
    this.physics.add.overlap(this.player, this.gates.apple, () => this._getApple());

    [1290, 2380, 3300, 3700, 4140, 4600].forEach(x => this._addRegen(x, LOW - 26));
  }

  _buildBoss() {
    const bossTex = this.textures.exists('master-dragon') ? 'master-dragon' : 'boss';
    this.boss = this.physics.add.sprite(5400, LOW - 90, bossTex);
    if (bossTex === 'master-dragon') {
      // preserve native 917:500 aspect ratio — display 220px wide
      const src = this.textures.get('master-dragon').getSourceImage();
      const dispW = 220, dispH = Math.round(dispW * src.height / src.width);
      this.boss.setDisplaySize(dispW, dispH);
      // body in display pixels (world space) — NOT texture pixels which get scaled
      this.boss.body.setSize(dispW * 0.7, dispH * 0.7)
        .setOffset(dispW * 0.15, dispH * 0.15);
    } else {
      this.boss.setTint(0x6b7280);
    }
    this.boss.body.setAllowGravity(false);
    this.boss.setImmovable(true);
    this.boss.setDepth(6);   // always in front of background art
    this.boss.hp = 10; this.boss.state = 'sleep'; this.boss.t = 0;
    // arena span on the ground in front of the cave portal
    this.boss.arenaL = 4980; this.boss.arenaR = 5500;
    this.boss.homeX = 5400; this.boss.targetX = 5400;
    this.boss.hurtUntil = 0;  // per-hit cooldown (800 ms between valid hits)
    // floating HP hearts that hover above the dragon (world-space, follow it)
    this.boss.maxHp = 10;
    this.boss.hearts = this.add.graphics().setDepth(41).setVisible(false);
    this.physics.add.overlap(this.player, this.boss, () => { if (!this.bossDead) this._hurt(1, this.boss.x); });
    this.physics.add.overlap(this.shots, this.boss, (shot) => this._hitBoss(shot));
    // portal — hidden until boss dies
    this.gates.cave = { x: 5760, open: false };
    this.gates.cave.portal = this._buildPortal(5760, LOW - 50);
    this.gates.cave.block = this._zone(5760, LOW - 40, 50, 90, 0xff5a3c, 0.7).setDepth(3);
    this.physics.add.overlap(this.player, this.gates.cave.block,
      () => { if (this.bossDead) this._win(); else this._hurt(1, 5760); });
  }

  _buildPlayer() {
    const startCp = this.checkpoints[this.cp];
    this.player = this.physics.add.sprite(startCp.x, startCp.y, 'hero');
    this.player.setCollideWorldBounds(true).setMaxVelocity(270, 950).setDragX(1500);
    this.player.body.setSize(28, 40).setOffset(1, 1);
    this.player.facing = 1;
    this._applyHero('fire');
  }

  _buildHUD() {
    this.hud.bossBar = this.add.graphics().setScrollFactor(0).setDepth(40).setVisible(false);
    this.hud.bossLabel = this.add.text(W / 2, H - 70, 'MASTER DRAGON',
      { fontFamily: 'Trebuchet MS', fontSize: '11px', color: '#ffd2c2' })
      .setOrigin(0.5, 1).setScrollFactor(0).setDepth(40).setVisible(false);
    this.hud.hearts = this.add.graphics().setScrollFactor(0).setDepth(40);
    this.hud.timer  = this.add.text(W / 2, 16, '10:00',
      { fontFamily: 'Trebuchet MS', fontSize: '18px', color: '#e8efe6' })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(40);
    this.hud.saves = this.add.text(W / 2, 40, '',
      { fontFamily: 'Trebuchet MS', fontSize: '12px', color: '#ffd23f' })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(40);
    this.hud.dmg = this.add.text(W - 14, 14, '',
      { fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#ffd23f' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(40);

    this.hud.bar = [];
    const bw = 150, gap = 6, total = bw * 6 + gap * 5, sx = W / 2 - total / 2, by = H - 34;
    ORDER.forEach((k, i) => {
      const x = sx + i * (bw + gap);
      const box = this.add.rectangle(x + bw / 2, by + 14, bw, 26, 0x0c1812, 0.85)
        .setStrokeStyle(2, HEROES[k].color).setScrollFactor(0).setDepth(40);
      this.add.circle(x + 14, by + 14, 6, HEROES[k].color).setScrollFactor(0).setDepth(41);
      const txt = this.add.text(x + 26, by + 14, `${i + 1} ${HEROES[k].name}`,
        { fontFamily: 'Trebuchet MS', fontSize: '12px', color: '#e8efe6' })
        .setOrigin(0, 0.5).setScrollFactor(0).setDepth(41);
      this.hud.bar.push({ k, box, txt });
    });

    this.hud.hintBg = this.add.rectangle(W / 2, 66, 560, 28, 0x0c1812, 0.6)
      .setScrollFactor(0).setDepth(40).setVisible(false);
    this.hud.hint = this.add.text(W / 2, 66, '',
      { fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#cfe0d2' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(41);

    this._drawHearts(); this._refreshBar(); this._refreshDmg(); this._refreshSaves();
  }

  _buildMenu() {
    this.menu.dim   = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.55)
      .setScrollFactor(0).setDepth(60).setVisible(false);
    this.menu.title = this.add.text(W / 2, 120, 'Choose your hero',
      { fontFamily: 'Trebuchet MS', fontSize: '20px', color: '#fff' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(61).setVisible(false);
    this.menu.cards = [];
    const cw = 140, gap = 12, total = cw * 6 + gap * 5, sx = W / 2 - total / 2;
    ORDER.forEach((k, i) => {
      const x = sx + i * (cw + gap) + cw / 2, y = H / 2;
      const card = this.add.rectangle(x, y, cw, 150, 0x132219, 0.98)
        .setStrokeStyle(3, HEROES[k].color).setScrollFactor(0).setDepth(61)
        .setInteractive({ useHandCursor: true }).setVisible(false);
      const dot = this.add.circle(x, y - 34, 20, HEROES[k].color)
        .setScrollFactor(0).setDepth(62).setVisible(false);
      const nm  = this.add.text(x, y + 16, HEROES[k].name,
        { fontFamily: 'Trebuchet MS', fontSize: '16px', color: '#fff' })
        .setOrigin(0.5).setScrollFactor(0).setDepth(62).setVisible(false);
      const ky  = this.add.text(x, y + 44, `press ${i + 1}`,
        { fontFamily: 'Trebuchet MS', fontSize: '11px', color: '#8fa593' })
        .setOrigin(0.5).setScrollFactor(0).setDepth(62).setVisible(false);
      card.on('pointerdown', () => { this._swap(k); this._toggleMenu(); });
      this.menu.cards.push({ k, card, dot, nm, ky });
    });
  }

  _bindInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys    = this.input.keyboard.addKeys({
      a: 'A', d: 'D', w: 'W', s: 'S', space: 'SPACE',
      e: 'E', q: 'Q', r: 'R', tab: 'TAB', esc: 'ESC',
      n1: 'ONE', n2: 'TWO', n3: 'THREE', n4: 'FOUR', n5: 'FIVE', n6: 'SIX',
    });
    this.input.keyboard.on('keydown-TAB', e => e.preventDefault());
  }

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  _applyHero(k) {
    this.cur = k;
    // Each 300x300 sprite has the character at a different vertical position.
    // feetY / cx are measured (alpha bounding box) in TEXTURE pixels.
    const SPRITE_MAP = {
      fire:   { tex: 'hero_fire',   feetY: 295, cx: 156 },
      water:  { tex: 'hero_water',  feetY: 295, cx: 158 },
      earth:  { tex: 'hero_earth',  feetY: 279, cx: 151 },
      stone:  { tex: 'hero_stone',  feetY: 297, cx: 158 },
      poison: { tex: 'hero_poison', feetY: 292, cx: 154 },
      rubber: { tex: 'hero_rubber', feetY: 280, cx: 150 },
    };
    const s = SPRITE_MAP[k];
    if (s) {
      this.player.setTexture(s.tex).setDisplaySize(54, 54).clearTint();
      // Body is sized in TEXTURE px. Scale = 54/300, so a 28x40 DISPLAY body
      // = 156x222 texture px. Anchor its bottom at the measured feet line.
      const bw = 156, bh = 222;
      this.player.body.setSize(bw, bh).setOffset(Math.round(s.cx - bw / 2), s.feetY - bh);
    } else {
      this.player.setTexture('hero').setDisplaySize(30, 42).setTint(HEROES[k].color);
      this.player.body.setSize(28, 40).setOffset(1, 1);
    }
  }

  _swap(k) {
    if (k === this.cur) return;
    this._applyHero(k);
    this._flash(this.player.x, this.player.y, HEROES[k].color);
    this._refreshBar();
  }

  _attack() {
    const dir = this.player.facing || 1;
    if (HEROES[this.cur].atk === 'ranged') {
      const s = this.shots.create(this.player.x + dir * 22, this.player.y, 'px')
        .setDisplaySize(14, 8).setTint(HEROES[this.cur].color);
      s.body.setAllowGravity(false);
      s.setVelocityX(dir * 560);
      s.element = this.cur;
      s.kills   = HEROES[this.cur].kills.slice();
      this.time.delayedCall(1100, () => { if (s.active) s.destroy(); });
    } else {
      const ax = this.player.x + dir * 30, ay = this.player.y;
      const slash = this.add.rectangle(ax, ay, 30, 34, HEROES[this.cur].color, 0.55).setDepth(6);
      this.tweens.add({ targets: slash, alpha: 0, scaleX: 1.4, duration: 160, onComplete: () => slash.destroy() });
      const box = new Phaser.Geom.Rectangle(ax - 18, ay - 20, 36, 40);
      this.enemies.children.iterate(e => {
        if (e && e.active && Phaser.Geom.Intersects.RectangleToRectangle(box, e.getBounds()))
          this._resolveHit(e, HEROES[this.cur].kills);
      });
      if (this.boss && this.boss.active && !this.bossDead &&
          Phaser.Geom.Intersects.RectangleToRectangle(box, this.boss.getBounds()))
        this._damageBoss();
    }
  }

  _ability() {
    // EARTH — break crack OR douse fire wall
    if (this.cur === 'earth') {
      if (!this.gates.crack.broken && Math.abs(this.player.x - this.gates.crack.x) < 110) {
        this.gates.crack.broken = true;
        this.gates.crack.obj.body.enable = false;
        this._flash(this.gates.crack.x, LOW - 60, 0xc08a4e);
        this.tweens.add({ targets: this.gates.crack.mound, alpha: 0, duration: 400, onComplete: () => this.gates.crack.mound.destroy() });
        return this._floatText(this.gates.crack.x, LOW - 80, 'cleared!', '#c08a4e');
      }
      if (!this.gates.fireWall.doused && Math.abs(this.player.x - this.gates.fireWall.x) < 90) {
        this.gates.fireWall.doused = true;
        this.gates.fireWall.bushes.forEach(b => this._douseBush(b));
        return this._floatText(this.gates.fireWall.x, LOW - 60, 'doused!', '#c08a4e');
      }
    }
    // STONE — raise a crushing wall
    if (this.cur === 'stone') {
      const dir = this.player.facing || 1, wx = this.player.x + dir * 44;
      const wall = this._zone(wx, LOW - 30, 30, 72, 0x9a8c7a, 1);
      this.tweens.add({ targets: wall, scaleY: { from: 0.1, to: 1 }, duration: 150 });
      this.physics.add.collider(this.player, wall);
      const crushBox = new Phaser.Geom.Rectangle(wx - 22, LOW - 66, 44, 80);
      let crushed = 0;
      this.enemies.children.iterate(e => {
        if (e && e.active && Phaser.Geom.Intersects.RectangleToRectangle(crushBox, e.getBounds())) {
          this._killEnemy(e); crushed++;
        }
      });
      this._flash(wx, LOW - 30, 0xcfc4b0);
      this._floatText(wx, LOW - 80, crushed ? `crushed ${crushed}!` : 'wall up', '#cfc4b0');
      this.time.delayedCall(2600, () => {
        if (wall.active) this.tweens.add({ targets: wall, alpha: 0, duration: 200, onComplete: () => wall.destroy() });
      });
      return;
    }
    // RUBBER — grapple swing
    if (this.cur === 'rubber' && !this.gates.grapple.busy &&
        this.player.x > this.gates.grapple.x1 && this.player.x < this.gates.grapple.x2) {
      this._grappleSwing(); return;
    }
    this._floatText(this.player.x, this.player.y - 34, 'no ability here', '#8fa593');
  }

  _grappleSwing() {
    this.gates.grapple.busy = true;
    this.player.setAcceleration(0, 0).setVelocity(0, 0);
    this.player.body.setAllowGravity(false);
    const anchorY = LOW - 220;
    const line = this.add.line(0, 0, this.player.x, this.player.y, this.gates.grapple.from, anchorY, 0xffe27a, 0.9)
      .setOrigin(0, 0).setLineWidth(2).setDepth(4);
    this.tweens.add({
      targets: this.player,
      x: this.gates.grapple.to, y: LOW - 30,
      duration: 620, ease: 'Sine.inOut',
      onUpdate: () => {
        line.setTo(this.player.x, this.player.y, this.gates.grapple.from, anchorY);
      },
      onComplete: () => { line.destroy(); this.player.body.setAllowGravity(true); this.gates.grapple.busy = false; },
    });
    this._floatText(this.player.x, this.player.y - 40, 'swing!', '#ffe27a');
  }

  _openChest() {
    if (this.gates.chest.opened) return;
    this.gates.chest.opened = true;
    this.tweens.add({ targets: this.gates.chestSprite, alpha: 0, y: this.gates.chestSprite.y - 20, duration: 300, onComplete: () => this.gates.chestSprite.destroy() });
    this.gates.apple.enableBody(true, 1180, LOW - 105, true, true);
    this.gates.apple.body.setAllowGravity(false);
    this.tweens.add({ targets: this.gates.apple, y: this.gates.apple.y - 8, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this._floatText(950, LOW - 50, 'a golden apple!', '#ffd23f');
  }

  _getApple() {
    if (this.hasApple || !this.gates.apple.visible) return;
    this.hasApple = true; this.dmg += 1;
    this.gates.apple.disableBody(true, true);
    this._floatText(this.player.x, this.player.y - 38, '+1 DAMAGE', '#ffd23f');
    this._refreshDmg();
  }

  // -------------------------------------------------------------------------
  // Enemies
  // -------------------------------------------------------------------------

  _addEnemy(x, y, type, behavior, minX, maxX) {
    // map each gameplay type to a dragon illustration
    const DRAGON = {
      ice:     'd_ice',
      fireD:   'd_regular',  // a fierce dragon Water must douse
      waterD:  'd_water',
      poisonD: 'd_poison',
      acidD:   'd_acid',
    };
    const tex = DRAGON[type] || 'dragon';
    const e = this.enemies.create(x, y, tex);
    e.setDisplaySize(72, 72);
    // body sized in TEXTURE px (300x300 art, scale 72/300): a ~46x40 display body
    if (this.textures.get(tex).getSourceImage().width === 300) {
      e.body.setSize(190, 165).setOffset(55, 90);
    }
    e.body.setAllowGravity(false); e.setImmovable(true);
    e.type = type; e.behavior = behavior; e.minX = minX; e.maxX = maxX; e.dir = 1;
    e.tag = null;
    return e;
  }

  _labelFor(t) {
    return ({ ice: 'ICE', fireD: 'FIRE', waterD: 'WATR', poisonD: 'POIS', acidD: 'ACID' })[t];
  }

  _tickEnemy(e) {
    if (e.behavior === 'patrol') {
      if (e.x < e.minX) e.dir = 1;
      if (e.x > e.maxX) e.dir = -1;
      e.setVelocityX(60 * e.dir);
    } else if (e.behavior === 'advance') {
      const d = this.player.x < e.x ? -1 : 1;
      e.setVelocityX(38 * d); e.dir = d;
    }
    e.setFlipX(e.dir < 0);
    if (e.tag) e.tag.setPosition(e.x, e.y - 40);
  }

  _hitEnemy(shot, e) {
    if (!shot.active || !e.active) return;
    this._resolveHit(e, shot.kills); shot.destroy();
  }

  _resolveHit(e, killList) {
    if (killList.includes(e.type)) { this._killEnemy(e); }
    else { this._floatText(e.x, e.y - 26, `Use ${COUNTER[e.type]}!`, '#ff8a6c'); }
  }

  _killEnemy(e) {
    this._flash(e.x, e.y, 0xffffff);
    this._floatText(e.x, e.y - 26, 'down!', '#ffffff');
    if (e.tag) e.tag.destroy();
    e.destroy();
  }

  // -------------------------------------------------------------------------
  // Regen stones
  // -------------------------------------------------------------------------

  _addRegen(x, y) {
    const s = this._zone(x, y, 26, 26, 0x6f7d73, 1);
    s.setStrokeStyle(2, 0xffe27a);
    s.gives = (Math.floor(x / 10) % 2 === 0);
    s.ring  = this.add.circle(x, y, 20, 0xffe27a, 0).setStrokeStyle(2, 0xffe27a, 0.6).setDepth(2);
    s.used  = false;
    this.physics.add.overlap(this.player, s, () => {
      if (s.used) return;
      if (this.player.body.velocity.y < -20 && this.player.y > y) {
        s.used = true; s.setFillStyle(0x3a463f, 1); if (s.ring) s.ring.destroy();
        if (s.gives && this.hp < this.maxHp) { this.hp++; this._drawHearts(); this._floatText(x, y - 22, '+1 HP', '#ff6a78'); }
        else this._floatText(x, y - 22, 'empty', '#8fa593');
      }
    });
    this.regenStones.push(s);
  }

  // -------------------------------------------------------------------------
  // Boss
  // -------------------------------------------------------------------------

  _tickBoss(time, delta) {
    if (!this.boss || !this.boss.active || this.bossDead) return;
    if (this.boss.state === 'sleep') {
      if (this.player.x > 5180) {
        this.boss.state = 'idle'; this.boss.t = 600;
        this.hud.bossBar.setVisible(true); this.hud.bossLabel.setVisible(true);
        this.boss.hearts.setVisible(true);
        this._drawBossBar();
      }
      return;
    }
    this.boss.t -= delta;
    this._drawBossHearts();
    // keep the dragon hovering over the player but always inside the arena so it
    // never drifts off-screen while the camera follows the player
    const clamp = (v) => Phaser.Math.Clamp(v, this.boss.arenaL, this.boss.arenaR);
    this.boss.homeX = clamp(this.player.x);
    switch (this.boss.state) {
      case 'idle':
        this.boss.y = LOW - 90 + Math.sin(time / 250) * 6;
        this.boss.x += (this.boss.homeX - this.boss.x) * 0.05;
        if (this.boss.t <= 0) { this.boss.state = 'rise'; this.boss.t = 460; this.boss.setTint(0xff7a5c); this.boss.targetX = clamp(this.player.x); }
        break;
      case 'rise':
        this.boss.y += ((LOW - 230) - this.boss.y) * 0.15;
        if (this.boss.t <= 0) { this.boss.state = 'slam'; this.boss.t = 420; }
        break;
      case 'slam':
        this.boss.x += (this.boss.targetX - this.boss.x) * 0.25;
        this.boss.y += ((LOW - 30) - this.boss.y) * 0.28;
        if (this.boss.t <= 0) {
          this.boss.state = 'recover'; this.boss.t = 3000; this.boss.setTint(0xffe1a0);
          this.cameras.main.shake(160, 0.01);
          if (Math.abs(this.player.x - this.boss.x) < 70 && this.player.y > LOW - 80) this._hurt(1, this.boss.x);
          this._flash(this.boss.x, LOW - 20, 0xffce6a);
        }
        break;
      case 'recover':
        if (this.boss.t <= 0) { this.boss.state = 'idle'; this.boss.t = 900; this.boss.clearTint(); }
        break;
    }
    // never let the dragon leave the arena (and thus the screen)
    this.boss.x = clamp(this.boss.x);
  }

  _hitBoss(shot) {
    if (!shot || !shot.active) return;
    shot.disableBody(true, true);   // disable immediately so no further overlaps fire
    this._damageBoss();
  }

  _damageBoss() {
    if (this.bossDead || !this.boss || this.boss.state === 'sleep') return;
    // hard cooldown so a burst of shots / repeated melee can never one-shot the boss
    if (this.time.now < this.boss.hurtUntil) return;
    this.boss.hurtUntil = this.time.now + 700;
    this.boss.hp = Math.max(0, this.boss.hp - 1);   // exactly one heart per valid hit
    this._flash(this.boss.x, this.boss.y, 0xffce4a);
    this._drawBossBar(); this._drawBossHearts();
    if (this.boss.hp <= 0) { this._defeatBoss(); }
    else { this._floatText(this.boss.x, this.boss.y - 60, `${this.boss.hp} left`, '#ffffff'); }
  }

  _defeatBoss() {
    if (this.bossDead) return;
    this.bossDead = true;
    this.hud.bossBar.setVisible(false); this.hud.bossLabel.setVisible(false);
    if (this.boss.hearts) this.boss.hearts.destroy();
    this._floatText(this.boss.x, this.boss.y - 50, 'defeated!', '#ffffff');
    this.tweens.add({ targets: this.boss, alpha: 0, y: this.boss.y + 40, duration: 600, onComplete: () => this.boss.destroy() });
    this.gates.cave.open = true;
    this.tweens.add({ targets: this.gates.cave.block, alpha: 0, duration: 300, onComplete: () => this.gates.cave.block.destroy() });
    this._openPortal(this.gates.cave.portal);
    this._floatText(4500, LOW - 90, 'a portal appears!', '#a07fff');
  }

  // -------------------------------------------------------------------------
  // Damage / life
  // -------------------------------------------------------------------------

  _hurt(amount, fromX, fromPool) {
    if (this.time.now < this.invulnUntil || this.over) return;
    this.hp -= amount; this.invulnUntil = this.time.now + 1200;
    const dir = this.player.x < fromX ? -1 : 1;
    this.player.setVelocity(dir * (fromPool ? 330 : 260), fromPool ? -300 : -260);
    if (this.hasApple) {
      this.hasApple = false; this.dmg = Math.max(1, this.dmg - 1);
      this._refreshDmg(); this._floatText(this.player.x, this.player.y - 46, 'lost buff', '#c8c8c8');
    }
    this._drawHearts(); this.cameras.main.shake(110, 0.006);
    if (this.hp <= 0) this._respawn(false);
  }

  _respawn(fromFall) {
    if (fromFall) {
      if (this.time.now < this.invulnUntil) return;
      this.hp = Math.max(0, this.hp - 1); this._drawHearts(); this.invulnUntil = this.time.now + 800;
    }
    if (this.hp <= 0) {
      if (this.saves > 0) {
        this.saves--; this._refreshSaves(); this.hp = this.maxHp; this._drawHearts();
        this._floatText(this.player.x, this.player.y - 40, 'respawn', '#ffd23f');
      } else { return this._loseHard('GAME OVER'); }
    }
    const c = this.checkpoints[this.cp];
    this.player.body.reset(c.x, c.y);
    this.player.body.setVelocity(0, 0);
    this.player.body.setAcceleration(0, 0);
    // teleport the physics body one frame later so the platform collider has
    // resolved and the player lands instead of falling through the ground
    this.time.delayedCall(16, () => {
      if (this.player && this.player.body) {
        this.player.body.reset(c.x, c.y);
        this.player.body.setVelocity(0, 0);
      }
    });
    this.invulnUntil = this.time.now + 1200;
  }

  // -------------------------------------------------------------------------
  // HUD helpers
  // -------------------------------------------------------------------------

  _drawHearts() {
    const g = this.hud.hearts; g.clear();
    for (let i = 0; i < this.maxHp; i++) {
      const x = 22 + i * 26, y = 22;
      g.fillStyle(i < this.hp ? 0xff4d5e : 0x33403a, 1);
      g.fillCircle(x - 4, y - 2, 6); g.fillCircle(x + 4, y - 2, 6); g.fillTriangle(x - 9, y, x + 9, y, x, y + 10);
    }
  }

  _refreshBar() {
    this.hud.bar.forEach(b => {
      const on = b.k === this.cur;
      b.box.setFillStyle(on ? 0x1c3325 : 0x0c1812, on ? 1 : 0.8);
      b.box.setStrokeStyle(on ? 3 : 2, HEROES[b.k].color);
      b.txt.setColor(on ? '#ffffff' : '#9fb3a4');
    });
  }

  _refreshDmg()   { this.hud.dmg.setText(this.hasApple ? `DMG ${this.dmg} (apple)` : `DMG ${this.dmg}`); }
  _refreshSaves() { this.hud.saves.setText('respawns: ' + '●'.repeat(this.saves) + '○'.repeat(3 - this.saves)); }

  _updateTimer() {
    const m = Math.floor(this.timeLeft / 60), s = Math.floor(this.timeLeft % 60);
    this.hud.timer.setText(`${m}:${s < 10 ? '0' : ''}${s}`).setColor(this.timeLeft < 60 ? '#ff6a5c' : '#e8efe6');
  }

  _updateHint() {
    let m = '';
    const g = this.gates;
    if (!g.chest.opened && Math.abs(this.player.x - 950) < 120)
      m = 'Walk into the chest for a golden apple';
    else if (!g.crack.broken && Math.abs(this.player.x - g.crack.x) < 150)
      m = 'Rubble blocks the way — EARTH (3), press Q';
    else if (!g.fireWall.doused && Math.abs(this.player.x - g.fireWall.x) < 150)
      m = 'Fire wall — EARTH (3), press Q to douse';
    else if (this._near(1000))  m = 'Ice dragon — FIRE (1), attack with E';
    else if (this._near(1740))  m = 'Fire dragon — WATER (2)';
    else if (this.player.x > g.grapple.x1 - 120 && this.player.x < g.grapple.x2 && !g.grapple.busy)
      m = 'Chasm — RUBBER (6), press Q to swing';
    else if (this._near(2700) && this._hasPack())
      m = 'Too many to shoot — STONE (4), press Q to crush them';
    else if (Math.abs(this.player.x - 2980) < 150) m = 'Deep water — WATER (2) to cross';
    else if (Math.abs(this.player.x - 3900) < 200) m = 'Acid pool & dragons — POISON (5)';
    else if (this.boss && this.boss.active && !this.bossDead && this.player.x > 5180)
      m = 'Master Dragon — keep attacking! 10 hits to win';
    this.hud.hintBg.setVisible(!!m); this.hud.hint.setText(m);
  }

  _near(x) {
    return Math.abs(this.player.x - x) < 170 &&
      this.enemies.children.entries.some(e => e.active && Math.abs(e.x - x) < 200);
  }
  _hasPack() { return this.enemies.children.entries.filter(e => e.active && e.behavior === 'advance').length > 0; }

  // -------------------------------------------------------------------------
  // Menu
  // -------------------------------------------------------------------------

  _toggleMenu() {
    this.menuOpen = !this.menuOpen; const v = this.menuOpen;
    this.menu.dim.setVisible(v); this.menu.title.setVisible(v);
    this.menu.cards.forEach(c => {
      [c.card, c.dot, c.nm, c.ky].forEach(o => o.setVisible(v));
      c.card.setFillStyle(c.k === this.cur ? 0x1c3325 : 0x132219, 0.98);
    });
    if (v) this.physics.pause(); else this.physics.resume();
  }

  _menuKeys() {
    ORDER.forEach((k, i) => {
      if (Phaser.Input.Keyboard.JustDown(this.keys['n' + (i + 1)])) { this._swap(k); this._toggleMenu(); }
    });
    if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) this._toggleMenu();
  }

  // -------------------------------------------------------------------------
  // Panels / game flow
  // -------------------------------------------------------------------------

  _startGame() {
    this.started = true; this.physics.resume();
    if (this.hud.start) { this.hud.start.forEach(o => o.destroy()); this.hud.start = null; }
  }

  _win() {
    if (this.over) return; this.over = true; this.physics.pause();
    const elapsed = 600 - this.timeLeft;
    const prev = this.saveData.bestTime;
    saveSystem.saveTime(elapsed);
    const isNew = prev === null || elapsed < prev;
    const timeLine = `Time: ${this._fmtTime(elapsed)}${isNew ? ' — NEW BEST!' : (prev ? `\nBest: ${this._fmtTime(prev)}` : '')}`;
    this._showPanel('LEVEL CLEAR', `You crossed the bridge into the cave.\n${timeLine}\n\nPress R to play again`, 0x35c46a);
  }

  _loseHard(title) {
    if (this.over) return; this.over = true; this.physics.pause();
    this._showPanel(title, '\nPress R to try Level 1 again', 0xff5a3c);
  }

  _showPanel(title, body, accent = 0xffe27a) {
    const o = [];
    o.push(this.add.rectangle(W / 2, H / 2, W, H, 0x06100a, 0.78).setScrollFactor(0).setDepth(70));
    o.push(this.add.rectangle(W / 2, H / 2, 560, 280, 0x102018, 0.98).setStrokeStyle(3, accent).setScrollFactor(0).setDepth(71));
    o.push(this.add.text(W / 2, H / 2 - 86, title,
      { fontFamily: 'Trebuchet MS', fontSize: '30px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(72));
    o.push(this.add.text(W / 2, H / 2 + 14, body,
      { fontFamily: 'Trebuchet MS', fontSize: '15px', color: '#cfe0d2', align: 'center', lineSpacing: 6 }).setOrigin(0.5).setScrollFactor(0).setDepth(72));
    if (title.includes('HEROES')) this.hud.start = o;
  }

  // -------------------------------------------------------------------------
  // Low-level helpers
  // -------------------------------------------------------------------------

  _ground(x1, x2) {
    const w = x2 - x1;
    const r = this.add.rectangle(x1 + w / 2, LOW + 35, w, 70, 0x2c4a35);
    r.setVisible(false);                 // collision only; tiled art drawn on top
    this.physics.add.existing(r, true); this.platforms.push(r);
    // tiled ground art
    const src = this.textures.get('ground-tile').getSourceImage();
    const tileH = 120;
    const scale = tileH / src.height;
    const grassTop = 35 * scale;         // transparent strip above grass in the texture
    const ts = this.add.tileSprite(x1, LOW - grassTop, w, tileH, 'ground-tile')
      .setOrigin(0, 0).setDepth(-1);
    ts.tileScaleX = scale; ts.tileScaleY = scale;
  }

  _upper(x1, x2) {
    const w = x2 - x1;
    const r = this.add.rectangle(x1 + w / 2, HIGH + 12, w, 24, 0x365c41);
    this.physics.add.existing(r, true); this.platforms.push(r);
    this.add.rectangle(x1 + w / 2, HIGH + 40, w, 8, 0x5a8a64).setDepth(-1);
  }

  _block(x, y, w, h, c) {
    const r = this.add.rectangle(x, y, w, h, c);
    this.physics.add.existing(r, true); this.platforms.push(r); return r;
  }

  _zone(x, y, w, h, c, a) {
    const r = this.add.rectangle(x, y, w, h, c, a);
    this.physics.add.existing(r, true); return r;
  }

  // a pool/chasm illustration whose liquid surface sits at the ground line
  _poolImg(key, cx, top, dispW) {
    const src = this.textures.get(key).getSourceImage();
    const scale = dispW / src.width;
    this.add.image(cx, top - 6, key)
      .setOrigin(0.5, 0)
      .setDisplaySize(dispW, src.height * scale)
      .setDepth(-2);
  }

  _poolVisual(cx, top, w, deep, surf) {
    this.add.rectangle(cx, top + 38, w, 90, deep).setDepth(-2);
    this.add.rectangle(cx, top + 2,  w, 12, surf, 0.6).setDepth(0);
  }

  _flash(x, y, c) {
    const f = this.add.circle(x, y, 8, c, 0.9).setDepth(8);
    this.tweens.add({ targets: f, radius: 30, alpha: 0, duration: 260, onComplete: () => f.destroy() });
  }

  _floatText(x, y, m, c) {
    const t = this.add.text(x, y, m,
      { fontFamily: 'Trebuchet MS', fontSize: '14px', color: c, fontStyle: 'bold' }).setOrigin(0.5).setDepth(9);
    this.tweens.add({ targets: t, y: y - 32, alpha: 0, duration: 720, onComplete: () => t.destroy() });
  }

  _jp(key) { return Phaser.Input.Keyboard.JustDown(key); }

  _fmtTime(s) { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec < 10 ? '0' : ''}${sec}`; }

  _anyKey() {
    return Object.values(this.keys).some(k => Phaser.Input.Keyboard.JustDown(k)) ||
      this._jp(this.cursors.up) || this._jp(this.cursors.left) || this._jp(this.cursors.right);
  }

  _drawBossBar() {
    const g = this.hud.bossBar; g.clear();
    const bw = 200, bh = 10, bx = W / 2 - bw / 2, by = H - 60;
    g.fillStyle(0x3a1010, 1); g.fillRect(bx, by, bw, bh);
    const fill = Math.max(0, this.boss.hp / 10);
    g.fillStyle(0xff4444, 1); g.fillRect(bx, by, Math.round(bw * fill), bh);
    g.lineStyle(2, 0xff9090, 0.8); g.strokeRect(bx, by, bw, bh);
    // 10 tick marks so each hit is visible
    for (let i = 1; i < 10; i++) {
      const tx = bx + Math.round(bw * i / 10);
      g.lineStyle(1, 0x660000, 0.6); g.lineBetween(tx, by, tx, by + bh);
    }
  }

  // small hearts floating above the dragon, one per remaining HP
  _drawBossHearts() {
    if (!this.boss || !this.boss.hearts) return;
    const g = this.boss.hearts; g.clear();
    const n = this.boss.maxHp, hp = Math.max(0, this.boss.hp);
    const sp = 16, total = (n - 1) * sp;
    const bx = this.boss.x - total / 2;
    const by = this.boss.y - this.boss.displayHeight / 2 - 22;
    for (let i = 0; i < n; i++) {
      const x = bx + i * sp, y = by;
      const filled = i < hp;
      g.fillStyle(filled ? 0xff4d5e : 0x402028, 1);
      g.fillCircle(x - 3, y - 1, 4); g.fillCircle(x + 3, y - 1, 4);
      g.fillTriangle(x - 6, y + 1, x + 6, y + 1, x, y + 8);
    }
  }

  // bridge platform for boss arena — uses bridge.png art if loaded, else a simple rect
  _bridgePlatform(cx, y, w) {
    const r = this.add.rectangle(cx, y + 10, w, 20, 0x5a3a1a);
    this.physics.add.existing(r, true); this.platforms.push(r);
    if (this.textures.exists('bridge')) {
      const src = this.textures.get('bridge').getSourceImage();
      const scale = w / src.width;
      this.add.image(cx, y, 'bridge')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(w, src.height * scale)
        .setDepth(-1);
      r.setAlpha(0);
    }
  }

  // creates a portal graphic (initially invisible) at world position x, y
  _buildPortal(x, y) {
    const g = this.add.graphics().setDepth(5);
    g.x = x; g.y = y;
    g.portalAngle = 0;
    g.setAlpha(0);
    g.setVisible(false);
    this._drawPortalFrame(g);
    return g;
  }

  _drawPortalFrame(g) {
    g.clear();
    const a = g.portalAngle || 0;
    // outer ring
    g.lineStyle(5, 0xa07fff, 0.9);
    g.strokeCircle(0, 0, 32);
    // inner glow
    g.fillStyle(0x6030cc, 0.5);
    g.fillCircle(0, 0, 26);
    // spinning sparks
    for (let i = 0; i < 6; i++) {
      const sa = a + (i / 6) * Math.PI * 2;
      const sx = Math.cos(sa) * 28, sy = Math.sin(sa) * 28;
      g.fillStyle(0xd0a0ff, 1);
      g.fillCircle(sx, sy, 3);
    }
  }

  _openPortal(g) {
    g.setVisible(true);
    this.tweens.add({ targets: g, alpha: 1, duration: 600, ease: 'Sine.Out' });
    // animate portal spin
    this.time.addEvent({ delay: 30, loop: true, callback: () => {
      if (!g.active) return;
      g.portalAngle = (g.portalAngle || 0) + 0.08;
      this._drawPortalFrame(g);
    }});
    // overlap trigger for win
    const zone = this._zone(g.x, g.y, 64, 64, 0, 0);
    this.physics.add.overlap(this.player, zone, () => { if (this.bossDead) this._win(); });
  }

  _resetState() {
    this.platforms   = [];
    this.regenStones = [];
    this.fireBushes  = [];
    this.gates       = {};
    this.boss        = null;
    this.cur         = 'fire';
    this.hp          = 5;
    this.maxHp       = 5;
    this.dmg         = 1;
    this.saves       = 3;
    this.invulnUntil = 0;
    this.nextShot    = 0;
    this.climbing    = false;
    this.hasApple    = false;
    this.started     = false;
    this.over        = false;
    this.menuOpen    = false;
    this.bossDead    = false;
    this.timeLeft    = 600;
    this.hud         = {};
    this.menu        = {};
    this.checkpoints = [
      { x: 850,  y: LOW - 80 },   // near tilemap "characters" spawn marker
      { x: 1200, y: LOW - 80 },
      { x: 1900, y: LOW - 80 },
      { x: 2600, y: LOW - 80 },
      { x: 3700, y: LOW - 80 },
      { x: 4600, y: LOW - 80 },
      { x: 5200, y: LOW - 80 },   // boss arena
    ];
    this.cp = 0;
    this.saveData = saveSystem.load();
  }
}

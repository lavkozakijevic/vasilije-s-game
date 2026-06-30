import { W, H, TILE, LOW, HIGH, WORLD_W, WORLD_H, HEROES, ORDER, COUNTER, ENEMY_TINT } from '../config.js';
import { saveSystem } from '../systems/save.js';
import { audioManager } from '../systems/audio.js';

export class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
  }

  preload() {
    // hero sprites
    this.load.image('hero_fire',   'assets/sprites/fire-300.png');
    this.load.image('hero_water',  'assets/sprites/water-300.png');
    this.load.image('hero_earth',  'assets/sprites/earth-300.png');
    this.load.image('hero_stone',  'assets/sprites/stone-300.png');
    this.load.image('hero_poison', 'assets/sprites/poison-300.png');
    this.load.image('hero_rubber', 'assets/sprites/rubber.png');

    // NPC sprites
    this.load.image('blacksmith',  'assets/sprites/blacksmith.png');
    this.load.image('d_ice',     'assets/sprites/ice-dragon.png');
    this.load.image('d_fire',    'assets/sprites/fire-dragon.png');
    this.load.image('d_water',   'assets/sprites/water-dragon.png');
    this.load.image('d_poison',  'assets/sprites/poison-dragon.png');
    this.load.image('d_acid',    'assets/sprites/acid-dragon.png');
    this.load.image('d_regular', 'assets/sprites/regular-dragon.png');
    this.load.image('d_master',  'assets/sprites/master-dragon.png');

    // tilemap
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

    this.load.on('loaderror', () => {});

    // placeholder textures
    const h = this.make.graphics({ add: false });
    h.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, 30, 42, 8);
    h.generateTexture('hero', 30, 42);

    const p = this.make.graphics({ add: false });
    p.fillStyle(0xffffff, 1).fillRect(0, 0, 1, 1);
    p.generateTexture('px', 1, 1);
  }

  create() {
    this._resetState();

    const ZOOM = 0.55;
    // Real viewport pixels. scrollFactor(0) HUD objects are still scaled by the
    // camera zoom about the screen centre, so positions go through _hpx/_hpy.
    const VW = window.innerWidth, VH = window.innerHeight;
    this._hcx = VW / 2; this._hcy = VH / 2; this._hiz = 1 / ZOOM;

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H + 260);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.enemies = this.physics.add.group();
    this.shots   = this.physics.add.group();

    this._buildTilemap();
    this._buildPlayer();
    this._buildNPCs();
    this._buildHUD(VW, VH);
    this._buildMenu(VW, VH);
    this._bindInput();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.enemies, (pl, e) => { if (e.active) this._hurt(1, e.x); });
    this.physics.add.overlap(this.shots,  this.enemies, (shot, e) => this._hitEnemy(shot, e));

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(240, 400);
    this.cameras.main.setZoom(0.55);
    // Snap immediately so tiles are visible before the lerp settles
    this.cameras.main.centerOn(this.player.x, this.player.y);

    const best = this.saveData.bestTime;
    const bestLine = best ? `\nBest time: ${this._fmtTime(best)}` : '';
    this._showPanel(VW, VH, 'ELEMENTAL HEROES',
      `LEVEL 1 — The Jungle\nReach the end of the map.\nEvery obstacle has one hero that beats it.${bestLine}\n\nPress any key or tap to begin`);
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

    if (Phaser.Input.Keyboard.JustDown(this.keys.tab)) this._toggleMenu();
    if (this.menuOpen) { this._menuKeys(); return; }
    ORDER.forEach((k, i) => { if (Phaser.Input.Keyboard.JustDown(this.keys['n' + (i + 1)])) this._swap(k); });

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

    // attack
    if (this._jp(this.keys.e) && time > this.nextShot) { this.nextShot = time + HEROES[this.cur].cd; this._attack(); }

    this.enemies.children.iterate(e => { if (e && e.active) this._tickEnemy(e); });

    this.player.setAlpha(this.time.now < this.invulnUntil ? (Math.floor(this.time.now / 80) % 2 ? 0.4 : 1) : 1);

    // advance checkpoint
    for (let i = this.cp + 1; i < this.checkpoints.length; i++) {
      if (this.player.x > this.checkpoints[i].x) this.cp = i;
    }

    if (this.player.y > WORLD_H + 90 && !this.over) this._respawn(true);
  }

  // -------------------------------------------------------------------------
  // Build helpers
  // -------------------------------------------------------------------------

  _buildTilemap() {
    const GID_MASK = 0x1FFFFFFF;
    const FLIP_H   = 0x80000000;
    const mapData  = this.cache.json.get('mapdata');
    const mapCols  = mapData.width;

    // Render every tile layer
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

    // Build solid collision strips from the ground layer. Water tiles (gids 9/10)
    // are non-solid, so ponds become real pits the player must jump across.
    const WATER = new Set([9, 10]);
    const ground = mapData.layers.find(l => l.name === 'ground');
    const solid = new Array(mapCols).fill(false);
    if (ground) {
      for (let c = 0; c < mapCols; c++) {
        for (const r of [22, 23]) {
          const gid = ground.data[r * mapCols + c] & GID_MASK;
          if (gid && !WATER.has(gid)) { solid[c] = true; break; }
        }
      }
    }
    // Coalesce contiguous solid columns into single rectangles
    let runStart = -1;
    const addStrip = (sc, ec) => {
      const w = (ec - sc + 1) * TILE;
      const x = sc * TILE + w / 2;
      const strip = this.add.rectangle(x, LOW + TILE, w, TILE * 2, 0, 0);
      this.physics.add.existing(strip, true);
      this.platforms.push(strip);
    };
    for (let c = 0; c <= mapCols; c++) {
      if (c < mapCols && solid[c]) { if (runStart < 0) runStart = c; }
      else if (runStart >= 0) { addStrip(runStart, c - 1); runStart = -1; }
    }

    // Kill net at the bottom
    const net = this.add.rectangle(WORLD_W / 2, WORLD_H + 200, WORLD_W, 40, 0, 0);
    this.physics.add.existing(net, true);
    this.platforms.push(net);
  }

  // Read the map's object layers and spawn characters tagged there.
  // Objects are Tiled text objects — match by text content (case-insensitive).
  _buildNPCs() {
    const mapData = this.cache.json.get('mapdata');
    // variant -> { texture, enemy type token used by HEROES[].kills / COUNTER }
    const DRAGON = {
      ice:    { tex: 'd_ice',    type: 'ice'     },
      fire:   { tex: 'd_fire',   type: 'fireD'   },
      water:  { tex: 'd_water',  type: 'waterD'  },
      poison: { tex: 'd_poison', type: 'poisonD' },
      acid:   { tex: 'd_acid',   type: 'acidD'   },
    };
    for (const layer of mapData.layers) {
      if (layer.type !== 'objectgroup') continue;
      for (const obj of (layer.objects || [])) {
        // text objects store the content in obj.text.text; name field may be empty
        const label = (obj.name || obj.text?.text || '').toLowerCase();
        const wx = obj.x;

        if (label.includes('boss')) {
          this._spawnBoss(wx, LOW - 150);
        } else if (label.includes('blacksmith')) {
          // display at LOW so it sits on the ground (wy from Tiled is the top edge)
          this._spawnStatic('blacksmith', wx, LOW, 170);
        } else if (label.includes('dragon')) {
          const variant = ['ice','fire','water','poison','acid']
            .find(v => label.includes(v)) || 'ice';
          const d = DRAGON[variant];
          this._spawnDragon(wx, LOW - 85, d.tex, d.type);
        }
      }
    }
  }

  _spawnStatic(key, x, y, dispW) {
    if (!this.textures.exists(key)) {
      // fallback placeholder so it's clear something is missing
      this.add.rectangle(x, y - dispW / 2, dispW * 0.6, dispW, 0x8b5e3c, 0.8).setDepth(2);
      return;
    }
    const src = this.textures.get(key).getSourceImage();
    const dispH = Math.round(dispW * src.height / src.width);
    this.add.image(x, y, key).setOrigin(0.5, 1).setDisplaySize(dispW, dispH).setDepth(2);
  }

  _spawnDragon(x, y, tex, type) {
    const e = this.enemies.create(x, y, tex);
    e.setDisplaySize(170, 170);
    if (this.textures.exists(tex) && this.textures.get(tex).getSourceImage().width === 300) {
      // body sized in texture coords (300px src, displayed at 170px)
      const scale = 300 / 170;
      e.body.setSize(Math.round(120 * scale), Math.round(100 * scale)).setOffset(Math.round(90 * scale), Math.round(120 * scale));
    }
    e.body.setAllowGravity(false);
    e.setImmovable(true);
    e.type = type;
    e.behavior = 'patrol';
    e.minX = x - 80; e.maxX = x + 80; e.dir = 1;
    return e;
  }

  _spawnBoss(x, y) {
    const tex = this.textures.exists('d_master') ? 'd_master' : 'd_regular';
    const e = this.enemies.create(x, y, tex);
    e.setDisplaySize(360, 360);
    const src = this.textures.get(tex).getSourceImage();
    const scale = src.width / 360;
    e.body.setSize(Math.round(220 * scale), Math.round(200 * scale))
      .setOffset(Math.round((src.width - 220 * scale) / 2), Math.round(140 * scale));
    e.body.setAllowGravity(false);
    e.setImmovable(true).setDepth(3);
    e.type = 'boss';
    e.isBoss = true;
    e.hp = 12;
    e.behavior = 'patrol';
    e.minX = x - 220; e.maxX = x + 220; e.dir = -1;
    this.boss = e;
    return e;
  }

  _buildPlayer() {
    // Find spawn point from map's object layer (first object without a specific name)
    let spawnX = 850, spawnY = LOW - 80;
    const mapData = this.cache.json.get('mapdata');
    for (const layer of mapData.layers) {
      if (layer.type !== 'objectgroup') continue;
      for (const obj of (layer.objects || [])) {
        const name = (obj.name || '').toLowerCase().trim();
        if (!name || name === 'characters' || name === 'spawn') {
          spawnX = obj.x; spawnY = obj.y;
          break;
        }
      }
    }
    const startCp = this.checkpoints[this.cp];
    this.player = this.physics.add.sprite(startCp.x || spawnX, startCp.y || spawnY, 'hero');
    this.player.setCollideWorldBounds(true).setMaxVelocity(270, 950).setDragX(1500);
    this.player.body.setSize(28, 40).setOffset(1, 1);
    this.player.facing = 1;
    this._applyHero('fire');
  }

  // VW, VH are real viewport pixels. Positions go through _hpx/_hpy (zoom-aware),
  // sizes are multiplied by IZ so they render at the intended screen pixel size.
  _buildHUD(VW, VH) {
    const IZ = this._hiz, px = v => this._hpx(v), py = v => this._hpy(v);
    this.hud.hearts = this.add.graphics().setScrollFactor(0).setDepth(40);
    this.hud.timer  = this.add.text(px(VW / 2), py(16), '10:00',
      { fontFamily: 'Trebuchet MS', fontSize: Math.round(18 * IZ) + 'px', color: '#e8efe6' })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(40);
    this.hud.saves = this.add.text(px(VW / 2), py(42), '',
      { fontFamily: 'Trebuchet MS', fontSize: Math.round(12 * IZ) + 'px', color: '#ffd23f' })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(40);
    this.hud.dmg = this.add.text(px(VW - 14), py(14), '',
      { fontFamily: 'Trebuchet MS', fontSize: Math.round(14 * IZ) + 'px', color: '#ffd23f' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(40);

    this.hud.bar = [];
    const bwS = 150, gapS = 6, totalS = bwS * 6 + gapS * 5;
    const sxS = VW / 2 - totalS / 2, byS = VH - 34;
    ORDER.forEach((k, i) => {
      const xS = sxS + i * (bwS + gapS);
      const box = this.add.rectangle(px(xS + bwS / 2), py(byS + 14), bwS * IZ, 26 * IZ, 0x0c1812, 0.85)
        .setStrokeStyle(2, HEROES[k].color).setScrollFactor(0).setDepth(40);
      this.add.circle(px(xS + 14), py(byS + 14), 6 * IZ, HEROES[k].color).setScrollFactor(0).setDepth(41);
      this.add.text(px(xS + 26), py(byS + 14), `${i + 1} ${HEROES[k].name}`,
        { fontFamily: 'Trebuchet MS', fontSize: Math.round(12 * IZ) + 'px', color: '#e8efe6' })
        .setOrigin(0, 0.5).setScrollFactor(0).setDepth(41);
      this.hud.bar.push({ k, box });
    });

    this.hud.hintBg = this.add.rectangle(px(VW / 2), py(66), 560 * IZ, 28 * IZ, 0x0c1812, 0.6)
      .setScrollFactor(0).setDepth(40).setVisible(false);
    this.hud.hint = this.add.text(px(VW / 2), py(66), '',
      { fontFamily: 'Trebuchet MS', fontSize: Math.round(14 * IZ) + 'px', color: '#cfe0d2' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(41);

    this._drawHearts(); this._refreshBar(); this._refreshDmg(); this._refreshSaves();
  }

  _buildMenu(VW, VH) {
    const IZ = this._hiz, px = v => this._hpx(v), py = v => this._hpy(v);
    this.menu.dim   = this.add.rectangle(this._hcx, this._hcy, VW * IZ, VH * IZ, 0x000000, 0.55)
      .setScrollFactor(0).setDepth(60).setVisible(false);
    this.menu.title = this.add.text(px(VW / 2), py(120), 'Choose your hero',
      { fontFamily: 'Trebuchet MS', fontSize: Math.round(20 * IZ) + 'px', color: '#fff' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(61).setVisible(false);
    this.menu.cards = [];
    const cwS = 140, gapS = 12, totalS = cwS * 6 + gapS * 5, sxS = VW / 2 - totalS / 2;
    ORDER.forEach((k, i) => {
      const xS = sxS + i * (cwS + gapS) + cwS / 2, yS = VH / 2;
      const card = this.add.rectangle(px(xS), py(yS), cwS * IZ, 150 * IZ, 0x132219, 0.98)
        .setStrokeStyle(3, HEROES[k].color).setScrollFactor(0).setDepth(61)
        .setInteractive({ useHandCursor: true }).setVisible(false);
      const dot = this.add.circle(px(xS), py(yS - 34), 20 * IZ, HEROES[k].color)
        .setScrollFactor(0).setDepth(62).setVisible(false);
      const nm  = this.add.text(px(xS), py(yS + 16), HEROES[k].name,
        { fontFamily: 'Trebuchet MS', fontSize: Math.round(16 * IZ) + 'px', color: '#fff' })
        .setOrigin(0.5).setScrollFactor(0).setDepth(62).setVisible(false);
      const ky  = this.add.text(px(xS), py(yS + 44), `press ${i + 1}`,
        { fontFamily: 'Trebuchet MS', fontSize: Math.round(11 * IZ) + 'px', color: '#8fa593' })
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
  // Hero / combat
  // -------------------------------------------------------------------------

  _applyHero(k) {
    const SPRITE_MAP = {
      fire:   { tex: 'hero_fire',   feetY: 295, cx: 156 },
      water:  { tex: 'hero_water',  feetY: 295, cx: 158 },
      earth:  { tex: 'hero_earth',  feetY: 279, cx: 151 },
      stone:  { tex: 'hero_stone',  feetY: 297, cx: 158 },
      poison: { tex: 'hero_poison', feetY: 292, cx: 154 },
      rubber: { tex: 'hero_rubber', feetY: 280, cx: 150 },
    };
    // Save feet world position before changing body so we can restore it
    const prevBottom = this.player?.body ? this.player.body.bottom : null;
    this.cur = k;
    const s = SPRITE_MAP[k];
    if (s) {
      this.player.setTexture(s.tex).setDisplaySize(170, 170).clearTint();
      const bw = 156, bh = 222;
      this.player.body.setSize(bw, bh).setOffset(Math.round(s.cx - bw / 2), s.feetY - bh);
      // Correct player y so feet stay at the same world position after body offset changes
      if (prevBottom !== null) {
        const newBottom = this.player.body.bottom;
        const dy = newBottom - prevBottom;
        if (Math.abs(dy) > 0.5) {
          this.player.y -= dy;
          this.player.body.y -= dy;
        }
      }
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
    }
  }

  // -------------------------------------------------------------------------
  // Enemies
  // -------------------------------------------------------------------------

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
  }

  _hitEnemy(shot, e) {
    if (!shot.active || !e.active) return;
    this._resolveHit(e, shot.kills); shot.destroy();
  }

  _resolveHit(e, killList) {
    if (e.isBoss) {
      // The boss takes damage from any attack; defeating it wins the level.
      e.hp -= 1;
      this._flash(e.x, e.y - 40, 0xffe27a);
      if (e.hp <= 0) { this._floatText(e.x, e.y - 60, 'DEFEATED!', '#ffd23f'); e.destroy(); this.boss = null; this._win(); }
      else { this._floatText(e.x, e.y - 60, `${e.hp}`, '#ffd23f'); this.cameras.main.shake(80, 0.004); }
      return;
    }
    if (killList.includes(e.type)) { this._killEnemy(e); }
    else { this._floatText(e.x, e.y - 26, `Use ${COUNTER[e.type] || '?'}!`, '#ff8a6c'); }
  }

  _killEnemy(e) {
    this._flash(e.x, e.y, 0xffffff);
    this._floatText(e.x, e.y - 26, 'down!', '#ffffff');
    e.destroy();
  }

  // -------------------------------------------------------------------------
  // Damage / life
  // -------------------------------------------------------------------------

  _hurt(amount, fromX) {
    if (this.time.now < this.invulnUntil || this.over) return;
    this.hp -= amount; this.invulnUntil = this.time.now + 1200;
    const dir = this.player.x < fromX ? -1 : 1;
    this.player.setVelocity(dir * 260, -260);
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
    this.player.body.setVelocity(0, 0).setAcceleration(0, 0);
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
    const IZ = this._hiz, px = v => this._hpx(v), py = v => this._hpy(v);
    for (let i = 0; i < this.maxHp; i++) {
      const xs = 22 + i * 26, ys = 22; // screen pixels
      g.fillStyle(i < this.hp ? 0xff4d5e : 0x33403a, 1);
      g.fillCircle(px(xs - 4), py(ys - 2), 6 * IZ);
      g.fillCircle(px(xs + 4), py(ys - 2), 6 * IZ);
      g.fillTriangle(px(xs - 9), py(ys), px(xs + 9), py(ys), px(xs), py(ys + 10));
    }
  }

  _refreshBar() {
    this.hud.bar.forEach(b => {
      const on = b.k === this.cur;
      b.box.setFillStyle(on ? 0x1c3325 : 0x0c1812, on ? 1 : 0.8);
      b.box.setStrokeStyle(on ? 3 : 2, HEROES[b.k].color);
    });
  }

  _refreshDmg()   { this.hud.dmg.setText(`DMG ${this.dmg}`); }
  _refreshSaves() { this.hud.saves.setText('respawns: ' + '●'.repeat(this.saves) + '○'.repeat(3 - this.saves)); }

  _updateTimer() {
    const m = Math.floor(this.timeLeft / 60), s = Math.floor(this.timeLeft % 60);
    this.hud.timer.setText(`${m}:${s < 10 ? '0' : ''}${s}`).setColor(this.timeLeft < 60 ? '#ff6a5c' : '#e8efe6');
  }

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
  // Game flow
  // -------------------------------------------------------------------------

  _startGame() {
    this.started = true; this.physics.resume();
    if (this.hud.start) { this.hud.start.forEach(o => o.destroy()); this.hud.start = null; }
  }

  _loseHard(title) {
    if (this.over) return; this.over = true; this.physics.pause();
    this._showPanel(window.innerWidth, window.innerHeight, title, '\nPress R to try again', 0xff5a3c);
  }

  _win() {
    if (this.over) return; this.over = true; this.physics.pause();
    const elapsed = Math.max(0, Math.round(600 - this.timeLeft));
    saveSystem.saveTime(elapsed);
    this._showPanel(window.innerWidth, window.innerHeight, 'VICTORY',
      `You slew the Master Dragon!\nTime: ${this._fmtTime(elapsed)}\n\nPress R to play again`, 0x7ad14a);
  }

  _showPanel(VW, VH, title, body, accent = 0xffe27a) {
    const IZ = this._hiz, px = v => this._hpx(v), py = v => this._hpy(v);
    const o = [];
    o.push(this.add.rectangle(this._hcx, this._hcy, VW * IZ, VH * IZ, 0x06100a, 0.78)
      .setScrollFactor(0).setDepth(70));
    o.push(this.add.rectangle(px(VW / 2), py(VH / 2), 560 * IZ, 280 * IZ, 0x102018, 0.98)
      .setStrokeStyle(3, accent).setScrollFactor(0).setDepth(71));
    o.push(this.add.text(px(VW / 2), py(VH / 2 - 86), title,
      { fontFamily: 'Trebuchet MS', fontSize: Math.round(30 * IZ) + 'px', color: '#fff', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(72));
    o.push(this.add.text(px(VW / 2), py(VH / 2 + 14), body,
      { fontFamily: 'Trebuchet MS', fontSize: Math.round(15 * IZ) + 'px', color: '#cfe0d2', align: 'center', lineSpacing: 6 * IZ })
      .setOrigin(0.5).setScrollFactor(0).setDepth(72));
    if (title.includes('HEROES')) this.hud.start = o;
  }

  // -------------------------------------------------------------------------
  // Low-level helpers
  // -------------------------------------------------------------------------

  _block(x, y, w, h, c) {
    const r = this.add.rectangle(x, y, w, h, c);
    this.physics.add.existing(r, true); this.platforms.push(r); return r;
  }

  _zone(x, y, w, h, c, a) {
    const r = this.add.rectangle(x, y, w, h, c, a);
    this.physics.add.existing(r, true); return r;
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

  // Screen-pixel -> world position for a scrollFactor(0) object under camera zoom.
  // The camera scales fixed objects about the screen centre, so an element meant
  // for screen pixel p must be placed at centre + (p - centre) * (1/zoom).
  _hpx(p) { return this._hcx + (p - this._hcx) * this._hiz; }
  _hpy(p) { return this._hcy + (p - this._hcy) * this._hiz; }

  _jp(key) { return Phaser.Input.Keyboard.JustDown(key); }

  _fmtTime(s) { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec < 10 ? '0' : ''}${sec}`; }

  _anyKey() {
    return Object.values(this.keys).some(k => Phaser.Input.Keyboard.JustDown(k)) ||
      this._jp(this.cursors.up) || this._jp(this.cursors.left) || this._jp(this.cursors.right);
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
    this.hasApple    = false;
    this.started     = false;
    this.over        = false;
    this.menuOpen    = false;
    this.bossDead    = false;
    this.timeLeft    = 600;
    this.hud         = {};
    this.menu        = {};
    this.checkpoints = [
      { x: 765,   y: LOW - 80 },
      { x: 4000,  y: LOW - 80 },
      { x: 7000,  y: LOW - 80 },
      { x: 10500, y: LOW - 80 },
      { x: 13000, y: LOW - 80 },
      { x: 16500, y: LOW - 80 },
      { x: 19800, y: LOW - 80 },
      { x: 22500, y: LOW - 80 },
      { x: 25500, y: LOW - 80 },
      { x: 28500, y: LOW - 80 },
    ];
    this.cp = 0;
    this.saveData = saveSystem.load();
  }
}

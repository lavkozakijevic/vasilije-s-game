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
    this.load.image('d_water',   'assets/sprites/water-dragon.png');
    this.load.image('d_poison',  'assets/sprites/poison-dragon.png');
    this.load.image('d_acid',    'assets/sprites/acid-dragon.png');
    this.load.image('d_regular', 'assets/sprites/regular-dragon.png');

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

    const SW = this.scale.width;
    const SH = this.scale.height;

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H + 260);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.enemies = this.physics.add.group();
    this.shots   = this.physics.add.group();

    this._buildTilemap();
    this._buildPlayer();
    this._buildNPCs();
    this._buildHUD(SW, SH);
    this._buildMenu(SW, SH);
    this._bindInput();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.enemies, (pl, e) => { if (e.active) this._hurt(1, e.x); });
    this.physics.add.overlap(this.shots,  this.enemies, (shot, e) => this._hitEnemy(shot, e));

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(240, 400);

    const best = this.saveData.bestTime;
    const bestLine = best ? `\nBest time: ${this._fmtTime(best)}` : '';
    this._showPanel(SW, SH, 'ELEMENTAL HEROES',
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

    // One solid physics strip: ground layer solid from col 5 to col 80
    const gSC = 5, gEC = 80;
    const gW  = (gEC - gSC + 1) * TILE;
    const gX  = gSC * TILE + gW / 2;
    const gY  = LOW + TILE / 2;
    const strip = this.add.rectangle(gX, gY, gW, TILE, 0, 0);
    this.physics.add.existing(strip, true);
    this.platforms.push(strip);

    // Kill net at the bottom
    const net = this.add.rectangle(WORLD_W / 2, WORLD_H + 200, WORLD_W, 40, 0, 0);
    this.physics.add.existing(net, true);
    this.platforms.push(net);
  }

  // Read the map's object layers and spawn characters tagged there.
  // Objects are Tiled text objects — match by text content (case-insensitive).
  _buildNPCs() {
    const mapData = this.cache.json.get('mapdata');
    const DRAGON_TEX = {
      ice: 'd_ice', fire: 'd_regular', water: 'd_water',
      poison: 'd_poison', acid: 'd_acid', regular: 'd_regular',
    };
    for (const layer of mapData.layers) {
      if (layer.type !== 'objectgroup') continue;
      for (const obj of (layer.objects || [])) {
        // text objects store the content in obj.text.text; name field may be empty
        const label = (obj.name || obj.text?.text || '').toLowerCase();
        const wx = obj.x, wy = obj.y;

        if (label.includes('blacksmith')) {
          // display at LOW so it sits on the ground (wy from Tiled is the top edge)
          this._spawnStatic('blacksmith', wx, LOW, 170);
        } else if (label.includes('dragon')) {
          const variant = ['ice','fire','water','poison','acid']
            .find(v => label.includes(v)) || 'regular';
          const tex = DRAGON_TEX[variant] || 'd_regular';
          this._spawnDragon(wx, LOW - 85, tex, variant);
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

  _buildHUD(SW, SH) {
    this.hud.hearts = this.add.graphics().setScrollFactor(0).setDepth(40);
    this.hud.timer  = this.add.text(SW / 2, 16, '10:00',
      { fontFamily: 'Trebuchet MS', fontSize: '18px', color: '#e8efe6' })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(40);
    this.hud.saves = this.add.text(SW / 2, 40, '',
      { fontFamily: 'Trebuchet MS', fontSize: '12px', color: '#ffd23f' })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(40);
    this.hud.dmg = this.add.text(SW - 14, 14, '',
      { fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#ffd23f' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(40);

    this.hud.bar = [];
    const bw = 150, gap = 6, total = bw * 6 + gap * 5, sx = SW / 2 - total / 2, by = SH - 34;
    ORDER.forEach((k, i) => {
      const x = sx + i * (bw + gap);
      const box = this.add.rectangle(x + bw / 2, by + 14, bw, 26, 0x0c1812, 0.85)
        .setStrokeStyle(2, HEROES[k].color).setScrollFactor(0).setDepth(40);
      this.add.circle(x + 14, by + 14, 6, HEROES[k].color).setScrollFactor(0).setDepth(41);
      this.add.text(x + 26, by + 14, `${i + 1} ${HEROES[k].name}`,
        { fontFamily: 'Trebuchet MS', fontSize: '12px', color: '#e8efe6' })
        .setOrigin(0, 0.5).setScrollFactor(0).setDepth(41);
      this.hud.bar.push({ k, box });
    });

    this.hud.hintBg = this.add.rectangle(SW / 2, 66, 560, 28, 0x0c1812, 0.6)
      .setScrollFactor(0).setDepth(40).setVisible(false);
    this.hud.hint = this.add.text(SW / 2, 66, '',
      { fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#cfe0d2' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(41);

    this._drawHearts(); this._refreshBar(); this._refreshDmg(); this._refreshSaves();
  }

  _buildMenu(SW, SH) {
    this.menu.dim   = this.add.rectangle(SW / 2, SH / 2, SW, SH, 0x000000, 0.55)
      .setScrollFactor(0).setDepth(60).setVisible(false);
    this.menu.title = this.add.text(SW / 2, 120, 'Choose your hero',
      { fontFamily: 'Trebuchet MS', fontSize: '20px', color: '#fff' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(61).setVisible(false);
    this.menu.cards = [];
    const cw = 140, gap = 12, total = cw * 6 + gap * 5, sx = SW / 2 - total / 2;
    ORDER.forEach((k, i) => {
      const x = sx + i * (cw + gap) + cw / 2, y = SH / 2;
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
  // Hero / combat
  // -------------------------------------------------------------------------

  _applyHero(k) {
    this.cur = k;
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
    for (let i = 0; i < this.maxHp; i++) {
      const x = 22 + i * 26, y = 22;
      g.fillStyle(i < this.hp ? 0xff4d5e : 0x33403a, 1);
      g.fillCircle(x - 4, y - 2, 6); g.fillCircle(x + 4, y - 2, 6);
      g.fillTriangle(x - 9, y, x + 9, y, x, y + 10);
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
    const SW = this.scale.width, SH = this.scale.height;
    this._showPanel(SW, SH, title, '\nPress R to try again', 0xff5a3c);
  }

  _showPanel(SW, SH, title, body, accent = 0xffe27a) {
    const o = [];
    o.push(this.add.rectangle(SW / 2, SH / 2, SW, SH, 0x06100a, 0.78).setScrollFactor(0).setDepth(70));
    o.push(this.add.rectangle(SW / 2, SH / 2, 560, 280, 0x102018, 0.98).setStrokeStyle(3, accent).setScrollFactor(0).setDepth(71));
    o.push(this.add.text(SW / 2, SH / 2 - 86, title,
      { fontFamily: 'Trebuchet MS', fontSize: '30px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(72));
    o.push(this.add.text(SW / 2, SH / 2 + 14, body,
      { fontFamily: 'Trebuchet MS', fontSize: '15px', color: '#cfe0d2', align: 'center', lineSpacing: 6 }).setOrigin(0.5).setScrollFactor(0).setDepth(72));
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
      { x: 850,  y: LOW - 80 },
      { x: 1200, y: LOW - 80 },
      { x: 2600, y: LOW - 80 },
      { x: 4600, y: LOW - 80 },
    ];
    this.cp = 0;
    this.saveData = saveSystem.load();
  }
}

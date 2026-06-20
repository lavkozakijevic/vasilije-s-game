import { W, H, LOW, HIGH, WORLD_W, HEROES, ORDER, COUNTER, ENEMY_TINT } from '../config.js';
import { saveSystem } from '../systems/save.js';
import { audioManager } from '../systems/audio.js';

export class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene');

    // Player state
    this.player       = null;
    this.heroKey      = 'fire';
    this.hp           = 3;
    this.maxHp        = 3;
    this.dmgMult      = 1;
    this.atkCooldown  = 0;
    this.invincible   = false;
    this.dead         = false;
    this.grounded     = false;
    this.onUpper      = false;
    this.grappling    = false;
    this.grappleAnchor= null;
    this.grappleRope  = null;
    this.grappleAngle = 0;
    this.grappleLen   = 0;
    this.pack         = false;       // has apple pack
    this.saves        = 3;          // checkpoint saves remaining
    this.checkpointIdx= 0;
    this.checkpoints  = [];
    this.lastCheckpoint= null;
    this.elapsed      = 0;
    this.timerActive  = false;
    this.won          = false;
    this.menuOpen     = false;

    // Groups / pools
    this.platforms    = null;
    this.upperPlatforms = null;
    this.enemies      = [];
    this.shots        = null;
    this.pickups      = null;
    this.gates        = [];
    this.chests       = [];
    this.boss         = null;
    this.bossBar      = null;
    this.bossHp       = 0;
    this.bossMaxHp    = 0;
    this.bossPhase    = 0;
    this.bossShots    = null;
    this.bossActive   = false;
    this.bossDefeated = false;

    // HUD elements
    this.heartSprites = [];
    this.barBg        = null;
    this.barFill      = null;
    this.dmgText      = null;
    this.timerText    = null;
    this.hintText     = null;
    this.savesText    = null;
    this.heroLabel    = null;
    this.menuPanel    = null;
    this.menuItems    = [];
    this.menuCursor   = 0;

    // Parallax layers
    this.bgLayers     = [];

    // Input
    this.cursors      = null;
    this.keys         = null;

    // Misc
    this.regenTimer   = 0;
    this.hintTimer    = 0;
    this.currentHint  = '';
    this.floatPool    = [];
  }

  // ─── PHASER LIFECYCLE ─────────────────────────────────────────────────────

  preload() {
    // All assets are drawn procedurally; nothing to load from disk for base game.
    // Placeholder for future asset loading:
    // this.load.image('bg1', 'assets/sprites/bg1.png');
  }

  create() {
    this.resetState();
    this.buildParallax();
    this.buildTerrain();
    this.buildGates();
    this.buildEnemies();
    this.buildPickups();
    this.buildBoss();
    this.buildPlayer();
    this.buildHUD();
    this.bindInput();

    // Camera
    this.cameras.main.setBounds(0, 0, WORLD_W, H);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Physics world bounds
    this.physics.world.setBounds(0, 0, WORLD_W, H);

    this.buildMenu();
    this.startGame();
  }

  update(time, delta) {
    if (this.dead || this.won || this.menuOpen) return;

    const dt = delta / 1000;
    this.elapsed += dt;
    this.updateTimer();

    this.handleMovement(delta);
    this.handleAttack(time);
    this.handleGrapple(delta);
    this.handlePickupOverlap();
    this.tickEnemies(time, delta);
    this.tickBossLogic(time, delta);
    this.updateHint(delta);
    this.tickRegen(delta);
    this.updateBgLayers();
  }

  // ─── STATE ────────────────────────────────────────────────────────────────

  resetState() {
    this.hp           = 3;
    this.maxHp        = 3;
    this.dmgMult      = 1;
    this.atkCooldown  = 0;
    this.invincible   = false;
    this.dead         = false;
    this.grounded     = false;
    this.onUpper      = false;
    this.grappling    = false;
    this.grappleAnchor= null;
    this.pack         = false;
    this.saves        = 3;
    this.checkpointIdx= 0;
    this.lastCheckpoint= null;
    this.elapsed      = 0;
    this.timerActive  = false;
    this.won          = false;
    this.menuOpen     = false;
    this.bossActive   = false;
    this.bossDefeated = false;
    this.bossPhase    = 0;
    this.enemies      = [];
    this.gates        = [];
    this.chests       = [];
    this.bgLayers     = [];
    this.heartSprites = [];
    this.menuItems    = [];
    this.floatPool    = [];
    this.regenTimer   = 0;
    this.hintTimer    = 0;
    this.heroKey      = 'fire';
  }

  startGame() {
    this.timerActive = true;
    this.applyHero(this.heroKey);
    this.drawHearts();
    this.refreshBar();
    this.refreshDmg();
    this.refreshSaves();
    this.updateHint(0);
  }

  // ─── PARALLAX ─────────────────────────────────────────────────────────────

  buildParallax() {
    const sky = this.add.rectangle(WORLD_W / 2, H / 2, WORLD_W, H, 0x87ceeb).setScrollFactor(0);
    // Far mountains
    for (let i = 0; i < 12; i++) {
      const x = i * 450 + 225;
      const mh = Phaser.Math.Between(80, 160);
      const layer = this.add.triangle(x, H - 100, 0, 0, mh * 0.7, -mh, mh * 1.4, 0, 0x6b9e6b)
        .setScrollFactor(0.2);
      this.bgLayers.push({ obj: layer, factor: 0.2, baseX: x });
    }
    // Mid hills
    for (let i = 0; i < 8; i++) {
      const x = i * 680 + 340;
      const layer = this.add.ellipse(x, H - 80, 320, 160, 0x4a8a4a)
        .setScrollFactor(0.5);
      this.bgLayers.push({ obj: layer, factor: 0.5, baseX: x });
    }
    // Clouds
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(0, WORLD_W);
      const y = Phaser.Math.Between(40, 180);
      const layer = this.add.ellipse(x, y, Phaser.Math.Between(120, 240), 60, 0xffffff, 0.85)
        .setScrollFactor(0.15);
      this.bgLayers.push({ obj: layer, factor: 0.15, baseX: x });
    }
  }

  updateBgLayers() {
    // Parallax is handled by Phaser's scrollFactor; no manual update needed.
  }

  // ─── TERRAIN ──────────────────────────────────────────────────────────────

  buildTerrain() {
    this.platforms      = this.physics.add.staticGroup();
    this.upperPlatforms = this.physics.add.staticGroup();

    // Ground floor
    this.ground(0, LOW, WORLD_W, 70);

    // Starting safe zone
    this.block(300, LOW - 60, 120, 20, 0x8b7355);
    this.block(500, LOW - 110, 100, 20, 0x8b7355);

    // Section 1: basic platforms
    this.block(700,  LOW - 80,  120, 20);
    this.block(900,  LOW - 140, 100, 20);
    this.block(1100, LOW - 80,  120, 20);
    this.block(1300, LOW - 160, 80,  20);

    // Upper path
    this.upper(800,  HIGH, 150, 20);
    this.upper(1000, HIGH - 40, 140, 20);
    this.upper(1200, HIGH, 160, 20);

    // Checkpoint platform 1
    this.checkpoints.push({ x: 1450, y: LOW - 20 });
    this.block(1400, LOW - 20, 160, 20, 0x5a8a5a);

    // Section 2: gap section
    this.block(1700, LOW - 100, 100, 20);
    this.block(1900, LOW - 60,  120, 20);
    this.block(2100, LOW - 120, 90,  20);
    this.block(2300, LOW - 80,  110, 20);

    // Upper platforms section 2
    this.upper(1800, HIGH + 20, 130, 20);
    this.upper(2000, HIGH - 20, 120, 20);
    this.upper(2200, HIGH + 10, 140, 20);

    // Checkpoint platform 2
    this.checkpoints.push({ x: 2500, y: LOW - 20 });
    this.block(2450, LOW - 20, 160, 20, 0x5a8a5a);

    // Section 3: narrow hops
    this.block(2700, LOW - 120, 80, 20);
    this.block(2870, LOW - 80,  70, 20);
    this.block(3040, LOW - 140, 80, 20);
    this.block(3210, LOW - 100, 90, 20);

    // Grapple zone upper hooks
    this.upper(2800, HIGH, 40, 20);
    this.upper(2950, HIGH - 30, 40, 20);
    this.upper(3100, HIGH + 10, 40, 20);

    // Checkpoint platform 3
    this.checkpoints.push({ x: 3400, y: LOW - 20 });
    this.block(3350, LOW - 20, 160, 20, 0x5a8a5a);

    // Section 4: mixed
    this.block(3600, LOW - 80,  120, 20);
    this.block(3800, LOW - 140, 100, 20);
    this.block(4000, LOW - 80,  120, 20);
    this.block(4200, LOW - 160, 80,  20);
    this.upper(3700, HIGH, 150, 20);
    this.upper(3900, HIGH - 40, 140, 20);
    this.upper(4100, HIGH, 120, 20);

    // Checkpoint platform 4
    this.checkpoints.push({ x: 4400, y: LOW - 20 });
    this.block(4350, LOW - 20, 160, 20, 0x5a8a5a);

    // Boss arena
    this.block(4600, LOW - 20, 500, 20, 0x5a3c3c);
    this.block(4580, LOW - 180, 20, 160, 0x5a3c3c); // left wall
    this.block(5080, LOW - 180, 20, 160, 0x5a3c3c); // right wall

    // Finish platform
    this.block(5120, LOW - 20, 80, 20, 0xd4af37);

    // Add visual checkpoint flags
    this.checkpoints.forEach((cp, i) => {
      const flag = this.add.rectangle(cp.x, cp.y - 30, 8, 40, 0x888888);
      const banner = this.add.rectangle(cp.x + 14, cp.y - 50, 28, 20, 0x44bb44);
      const txt = this.add.text(cp.x + 14, cp.y - 50, (i + 1).toString(), {
        fontSize: '12px', color: '#ffffff', fontFamily: 'monospace'
      }).setOrigin(0.5);
      // checkpoint zone
      const zone = this.add.zone(cp.x, cp.y - 10, 60, 40).setOrigin(0.5);
      this.physics.world.enable(zone);
      zone.body.setAllowGravity(false);
      zone.checkpointIndex = i;
      this.checkpoints[i].zone = zone;
    });
  }

  ground(x, y, w, h) {
    const g = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0x4a7c3a);
    this.physics.add.existing(g, true);
    this.platforms.add(g);
    return g;
  }

  upper(x, y, w, h) {
    const u = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0x8b7355);
    this.physics.add.existing(u, true);
    this.upperPlatforms.add(u);
    this.platforms.add(u);
    return u;
  }

  block(x, y, w, h, color = 0x8b7355) {
    const b = this.add.rectangle(x + w / 2, y + h / 2, w, h, color);
    this.physics.add.existing(b, true);
    this.platforms.add(b);
    return b;
  }

  zone(x, y, w, h) {
    const z = this.add.zone(x, y, w, h).setOrigin(0.5);
    this.physics.world.enable(z);
    z.body.setAllowGravity(false);
    return z;
  }

  // ─── GATES ────────────────────────────────────────────────────────────────

  buildGates() {
    // Gates are visual barriers that require specific hero to pass
    const gateDefs = [
      { x: 1380, heroNeeded: 'fire',  color: 0xff5a3c, label: 'F' },
      { x: 2430, heroNeeded: 'water', color: 0x3aa0ff, label: 'W' },
      { x: 3330, heroNeeded: 'earth', color: 0xc08a4e, label: 'E' },
      { x: 4330, heroNeeded: 'stone', color: 0x9a8c7a, label: 'S' },
    ];

    gateDefs.forEach(def => {
      const body = this.add.rectangle(def.x, LOW - 60, 24, 120, def.color, 0.85);
      this.physics.add.existing(body, true);
      const lbl = this.add.text(def.x, LOW - 60, def.label, {
        fontSize: '20px', color: '#ffffff', fontFamily: 'monospace'
      }).setOrigin(0.5);
      const gateObj = { body, lbl, heroNeeded: def.heroNeeded, open: false };
      this.gates.push(gateObj);
      this.platforms.add(body); // gates block movement
    });
  }

  openGate(gate) {
    if (gate.open) return;
    gate.open = true;
    this.tweens.add({
      targets: [gate.body, gate.lbl],
      alpha: 0,
      scaleY: 0,
      duration: 400,
      onComplete: () => {
        gate.body.destroy();
        gate.lbl.destroy();
        this.platforms.remove(gate.body);
      }
    });
    this.floatText(gate.body.x, gate.body.y - 40, 'Gate Open!', 0x44ff44);
    audioManager.play('gate_open');
  }

  checkGates() {
    this.gates.forEach(gate => {
      if (!gate.open && this.heroKey === gate.heroNeeded) {
        if (this.near(this.player, gate.body, 50)) {
          this.openGate(gate);
        }
      }
    });
  }

  // ─── ENEMIES ──────────────────────────────────────────────────────────────

  buildEnemies() {
    this.shots     = this.physics.add.group();
    this.bossShots = this.physics.add.group();

    // Section 1
    this.addEnemy(820,  LOW - 40, 'ice',    'patrol', 700,  950);
    this.addEnemy(1050, LOW - 40, 'fireD',  'patrol', 950,  1200);
    this.addEnemy(1250, LOW - 40, 'ice',    'patrol', 1150, 1380);

    // Section 2
    this.addEnemy(1750, LOW - 40, 'waterD', 'patrol', 1650, 1900);
    this.addEnemy(1950, LOW - 40, 'poisonD','patrol', 1850, 2100);
    this.addEnemy(2150, LOW - 40, 'fireD',  'patrol', 2050, 2350);
    this.addEnemy(2350, LOW - 40, 'waterD', 'patrol', 2250, 2440);

    // Section 3 - harder
    this.addEnemy(2750, LOW - 40, 'acidD',  'patrol', 2680, 2860);
    this.addEnemy(2900, LOW - 40, 'ice',    'chase',  2850, 3050);
    this.addEnemy(3080, LOW - 40, 'poisonD','patrol', 3010, 3220);
    this.addEnemy(3220, LOW - 40, 'acidD',  'patrol', 3130, 3340);

    // Section 4 - gauntlet
    this.addEnemy(3650, LOW - 40, 'fireD',  'patrol', 3570, 3780);
    this.addEnemy(3820, LOW - 40, 'waterD', 'chase',  3750, 3960);
    this.addEnemy(4050, LOW - 40, 'ice',    'patrol', 3960, 4160);
    this.addEnemy(4230, LOW - 40, 'poisonD','patrol', 4150, 4340);
  }

  addEnemy(x, y, type, behavior, minX, maxX) {
    const tint  = ENEMY_TINT[type] || 0xffffff;
    const speed = behavior === 'chase' ? 80 : 60;

    const body = this.add.rectangle(x, y, 32, 36, tint);
    this.physics.add.existing(body);
    body.body.setCollideWorldBounds(true);
    body.body.setGravityY(200);

    const letter = type.charAt(0).toUpperCase();
    const lbl = this.add.text(x, y - 24, letter, {
      fontSize: '14px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    // HP
    const hpMax = behavior === 'chase' ? 3 : 2;
    const hpBar = this.add.rectangle(x, y - 38, 32, 4, 0x00ff00);
    const hpBg  = this.add.rectangle(x, y - 38, 32, 4, 0x550000).setDepth(-1);

    const enemy = {
      body, lbl, hpBar, hpBg,
      type, behavior,
      hp: hpMax, maxHp: hpMax,
      speed, minX, maxX,
      dir: 1,
      shootCd: 0,
      dead: false,
      x, y,
    };

    this.physics.add.collider(body, this.platforms);
    this.enemies.push(enemy);
    return enemy;
  }

  tickEnemies(time, delta) {
    const dt = delta / 1000;
    this.enemies.forEach(e => {
      if (e.dead) return;
      this.tickEnemy(e, dt, time);
    });
  }

  tickEnemy(e, dt, time) {
    const px = this.player.x;
    const ex = e.body.x;

    if (e.behavior === 'chase') {
      const dist = px - ex;
      e.dir = dist > 0 ? 1 : -1;
      e.body.body.setVelocityX(e.dir * e.speed);
    } else {
      // Patrol
      e.body.body.setVelocityX(e.dir * e.speed);
      if (ex >= e.maxX) e.dir = -1;
      if (ex <= e.minX) e.dir =  1;
    }

    // Ranged enemies shoot
    const rangedTypes = ['ice', 'fireD', 'waterD', 'poisonD', 'acidD'];
    if (rangedTypes.includes(e.type)) {
      e.shootCd -= dt;
      if (e.shootCd <= 0 && Math.abs(px - ex) < 400) {
        e.shootCd = Phaser.Math.FloatBetween(1.5, 3.0);
        this.enemyShoot(e);
      }
    }

    // Sync visuals
    e.lbl.setPosition(e.body.x, e.body.y - 28);
    e.hpBg.setPosition(e.body.x, e.body.y - 42);
    e.hpBar.setPosition(e.body.x, e.body.y - 42);
    e.hpBar.setSize(32 * (e.hp / e.maxHp), 4);

    // Check if player walks into enemy
    if (!this.invincible && Phaser.Math.Distance.Between(this.player.x, this.player.y, e.body.x, e.body.y) < 28) {
      this.hurt(1);
    }
  }

  enemyShoot(e) {
    const dx = this.player.x - e.body.x;
    const dy = this.player.y - e.body.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const speed = 180;

    const shot = this.add.circle(e.body.x, e.body.y, 6, ENEMY_TINT[e.type] || 0xffffff);
    this.physics.add.existing(shot);
    shot.body.setAllowGravity(false);
    shot.body.setVelocity((dx / len) * speed, (dy / len) * speed);
    shot.enemyType = e.type;

    this.bossShots.add(shot);

    // Destroy after 3 seconds
    this.time.delayedCall(3000, () => { if (shot.active) shot.destroy(); });
  }

  hitEnemy(shot, e) {
    if (e.dead) return;
    shot.destroy();
    this.resolveHit(e, HEROES[this.heroKey].kills);
  }

  resolveHit(e, killList) {
    const isWeak = killList.includes(e.type);
    const dmg = isWeak ? 2 : 1;
    e.hp -= dmg;

    this.floatText(e.body.x, e.body.y - 50, isWeak ? '💥 WEAK! -' + dmg : '-' + dmg, isWeak ? 0xff4400 : 0xffffff);
    this.flash(e.body, isWeak ? 0xff0000 : 0xaaaaaa);

    if (e.hp <= 0) {
      this.killEnemy(e);
    }
  }

  killEnemy(e) {
    e.dead = true;
    this.floatText(e.body.x, e.body.y - 40, 'KO!', 0xffff00);
    this.tweens.add({
      targets: [e.body, e.lbl, e.hpBar, e.hpBg],
      alpha: 0, scaleX: 0, scaleY: 0,
      duration: 300,
      onComplete: () => {
        e.body.destroy();
        e.lbl.destroy();
        e.hpBar.destroy();
        e.hpBg.destroy();
      }
    });
    audioManager.play('enemy_die');
  }

  // ─── PICKUPS ──────────────────────────────────────────────────────────────

  buildPickups() {
    this.pickups = this.physics.add.staticGroup();

    // Apples
    const applePositions = [
      { x: 850, y: LOW - 100 },
      { x: 1150, y: LOW - 100 },
      { x: 1800, y: LOW - 100 },
      { x: 2200, y: LOW - 140 },
      { x: 2900, y: LOW - 100 },
      { x: 3300, y: LOW - 100 },
      { x: 3700, y: LOW - 100 },
      { x: 4100, y: LOW - 100 },
    ];

    applePositions.forEach(pos => {
      const apple = this.add.circle(pos.x, pos.y, 10, 0xff4444);
      this.physics.add.existing(apple, true);
      apple.pickupType = 'apple';
      this.pickups.add(apple);
      // Bobbing animation
      this.tweens.add({
        targets: apple,
        y: pos.y - 8,
        yoyo: true,
        repeat: -1,
        duration: 800,
        ease: 'Sine.easeInOut'
      });
    });

    // Chests (hero upgrades)
    const chestDefs = [
      { x: 1480, y: LOW - 50, hero: 'water' },
      { x: 2480, y: LOW - 50, hero: 'earth' },
      { x: 3480, y: LOW - 50, hero: 'stone' },
      { x: 4430, y: LOW - 50, hero: 'poison' },
    ];

    chestDefs.forEach(def => {
      const chest = this.add.rectangle(def.x, def.y, 28, 24, 0xd4af37);
      this.physics.add.existing(chest, true);
      chest.pickupType = 'chest';
      chest.chestHero  = def.hero;
      chest.opened     = false;
      this.pickups.add(chest);
      this.chests.push(chest);

      const lbl = this.add.text(def.x, def.y - 22, '?', {
        fontSize: '16px', color: '#ffffff', fontFamily: 'monospace'
      }).setOrigin(0.5);
      chest.label = lbl;
    });

    // Apple pack (pack that refills saves)
    const pack = this.add.rectangle(3500, LOW - 50, 24, 20, 0x44aaff);
    this.physics.add.existing(pack, true);
    pack.pickupType = 'pack';
    this.pickups.add(pack);
    const packLbl = this.add.text(3500, LOW - 70, 'PACK', {
      fontSize: '10px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5);
  }

  handlePickupOverlap() {
    if (!this.player || !this.pickups) return;
    this.pickups.getChildren().forEach(pickup => {
      if (!pickup.active) return;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, pickup.x, pickup.y) < 28) {
        if (pickup.pickupType === 'apple') {
          this.getApple(pickup);
        } else if (pickup.pickupType === 'chest' && !pickup.opened) {
          this.openChest(pickup);
        } else if (pickup.pickupType === 'pack') {
          this.getPack(pickup);
        }
      }
    });

    // Checkpoint zones
    this.checkpoints.forEach((cp, i) => {
      if (!cp.zone || !cp.zone.active) return;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, cp.x, cp.y - 10) < 50) {
        if (this.checkpointIdx < i + 1) {
          this.checkpointIdx = i + 1;
          this.lastCheckpoint = cp;
          saveSystem.saveCheckpoint(i);
          this.refreshSaves();
          this.floatText(cp.x, cp.y - 60, 'Checkpoint!', 0x44ff44);
          audioManager.play('checkpoint');
          cp.zone.destroy();
          cp.zone = null;
        }
      }
    });

    // Check gates
    this.checkGates();

    // Enemy shots hitting player
    this.bossShots.getChildren().forEach(shot => {
      if (!shot.active) return;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, shot.x, shot.y) < 20) {
        shot.destroy();
        this.hurt(1);
      }
    });

    // Player shots hitting enemies
    if (this.shots) {
      this.shots.getChildren().forEach(shot => {
        if (!shot.active) return;
        this.enemies.forEach(e => {
          if (e.dead) return;
          if (Phaser.Math.Distance.Between(shot.x, shot.y, e.body.x, e.body.y) < 24) {
            this.hitEnemy(shot, e);
          }
        });
        // Hit boss
        if (this.boss && this.bossActive && !this.bossDefeated) {
          if (Phaser.Math.Distance.Between(shot.x, shot.y, this.boss.x, this.boss.y) < 50) {
            shot.destroy();
            this.hitBoss(this.boss);
          }
        }
      });
    }
  }

  getApple(apple) {
    apple.destroy();
    if (this.hp < this.maxHp) {
      this.hp = Math.min(this.hp + 1, this.maxHp);
      this.drawHearts();
      this.floatText(this.player.x, this.player.y - 50, '+1 HP', 0xff4444);
      audioManager.play('pickup');
    } else {
      this.floatText(this.player.x, this.player.y - 50, 'Full HP', 0xffaaaa);
    }
  }

  openChest(chest) {
    chest.opened = true;
    if (chest.label) chest.label.destroy();
    this.tweens.add({
      targets: chest,
      scaleY: 0,
      duration: 200,
      onComplete: () => {
        chest.setFillStyle(0x888888);
        this.tweens.add({ targets: chest, scaleY: 1, duration: 200 });
      }
    });
    const newHero = chest.chestHero;
    this.floatText(chest.x, chest.y - 50, newHero.toUpperCase() + ' unlocked!', 0xffdd00);
    this.showPanel('Hero Unlocked: ' + HEROES[newHero].name + '!\nPress ' + ORDER.indexOf(newHero) + '+1 to switch.');
    audioManager.play('chest_open');
  }

  getPack(pack) {
    pack.destroy();
    this.pack = true;
    this.saves = 3;
    this.refreshSaves();
    this.floatText(this.player.x, this.player.y - 50, 'Pack! Saves restored', 0x44aaff);
    audioManager.play('pickup');
  }

  // ─── BOSS ─────────────────────────────────────────────────────────────────

  buildBoss() {
    this.bossMaxHp = 20;
    this.bossHp    = this.bossMaxHp;

    // Boss is invisible/inactive until player enters arena
    this.boss = this.add.rectangle(4830, LOW - 60, 64, 72, 0x990000);
    this.physics.add.existing(this.boss);
    this.boss.body.setCollideWorldBounds(true);
    this.boss.body.setGravityY(200);
    this.boss.setAlpha(0);

    const bossLbl = this.add.text(4830, LOW - 100, 'BOSS', {
      fontSize: '18px', color: '#ff0000', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0);
    this.boss.label = bossLbl;

    // Boss HP bar (HUD)
    this.bossBar = {
      bg:   this.add.rectangle(W / 2, 30, 400, 18, 0x550000).setScrollFactor(0).setAlpha(0),
      fill: this.add.rectangle(W / 2 - 200, 30, 400, 18, 0xff2222).setScrollFactor(0).setOrigin(0, 0.5).setAlpha(0),
      txt:  this.add.text(W / 2, 30, 'BOSS', {
        fontSize: '12px', color: '#ffffff', fontFamily: 'monospace'
      }).setOrigin(0.5).setScrollFactor(0).setAlpha(0),
    };

    this.physics.add.collider(this.boss, this.platforms);
  }

  tickBossLogic(time, delta) {
    // Activate boss when player enters arena
    if (!this.bossActive && this.player && this.player.x > 4580) {
      this.bossActive = true;
      this.boss.setAlpha(1);
      this.boss.label.setAlpha(1);
      this.bossBar.bg.setAlpha(1);
      this.bossBar.fill.setAlpha(1);
      this.bossBar.txt.setAlpha(1);
      audioManager.play('boss_music');
      this.floatText(4830, LOW - 140, 'BOSS FIGHT!', 0xff0000);
    }

    if (!this.bossActive || this.bossDefeated) return;

    this.tickBoss(time, delta);
  }

  tickBoss(time, delta) {
    const dt     = delta / 1000;
    const bx     = this.boss.x;
    const px     = this.player.x;
    const phase  = this.bossPhase;

    // Chase player
    const dir = px > bx ? 1 : -1;
    const spd = 60 + phase * 30;
    this.boss.body.setVelocityX(dir * spd);

    // Boss attacks based on phase
    this.bossShootCd = (this.bossShootCd || 0) - dt;
    if (this.bossShootCd <= 0) {
      const freq = Math.max(0.5, 2.0 - phase * 0.4);
      this.bossShootCd = freq;
      this.bossDoShoot(phase);
    }

    // Update boss label
    this.boss.label.setPosition(this.boss.x, this.boss.y - 50);

    // Melee damage
    if (!this.invincible && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y) < 50) {
      this.hurt(2);
    }
  }

  bossDoShoot(phase) {
    const bx = this.boss.x;
    const by = this.boss.y;
    const px = this.player.x;
    const py = this.player.y;

    if (phase < 1) {
      // Single shot
      this.spawnBossShot(bx, by, px, py, 0xff2222, 200);
    } else if (phase < 2) {
      // Spread
      [-20, 0, 20].forEach(offset => {
        this.spawnBossShot(bx, by, px + offset * 5, py, 0xff5500, 220);
      });
    } else {
      // Circle burst
      for (let a = 0; a < 8; a++) {
        const angle = (a / 8) * Math.PI * 2;
        const tx = bx + Math.cos(angle) * 200;
        const ty = by + Math.sin(angle) * 200;
        this.spawnBossShot(bx, by, tx, ty, 0xff0000, 180);
      }
    }
  }

  spawnBossShot(sx, sy, tx, ty, color, speed) {
    const dx  = tx - sx;
    const dy  = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const s   = this.add.circle(sx, sy, 8, color);
    this.physics.add.existing(s);
    s.body.setAllowGravity(false);
    s.body.setVelocity((dx / len) * speed, (dy / len) * speed);
    s.isBossShot = true;
    this.bossShots.add(s);
    this.time.delayedCall(4000, () => { if (s.active) s.destroy(); });
  }

  hitBoss(b) {
    this.damageBoss();
  }

  damageBoss() {
    const kills = HEROES[this.heroKey].kills;
    // All attacks damage boss; elemental weakness does 2
    const isWeak = kills.length > 0; // simplified: any elemental ability is effective
    const dmg    = isWeak ? 2 : 1;

    this.bossHp -= dmg;
    this.flash(this.boss, 0xff0000);
    this.floatText(this.boss.x, this.boss.y - 60, '-' + dmg, 0xff4400);

    // Update phase
    this.bossPhase = this.bossHp <= this.bossMaxHp * 0.33 ? 2 :
                     this.bossHp <= this.bossMaxHp * 0.66 ? 1 : 0;

    // Update bar
    const pct = Math.max(0, this.bossHp / this.bossMaxHp);
    this.bossBar.fill.setSize(400 * pct, 18);

    if (this.bossHp <= 0) {
      this.defeatBoss();
    }
  }

  defeatBoss() {
    this.bossDefeated = true;
    this.bossActive   = false;
    audioManager.play('boss_die');
    this.floatText(this.boss.x, this.boss.y - 80, 'BOSS DEFEATED!', 0xffdd00);
    this.tweens.add({
      targets: [this.boss, this.boss.label, this.bossBar.bg, this.bossBar.fill, this.bossBar.txt],
      alpha: 0,
      duration: 800,
      onComplete: () => {
        this.boss.destroy();
        // Clear remaining boss shots
        this.bossShots.clear(true, true);
      }
    });

    this.time.delayedCall(1200, () => { this.win(); });
  }

  // ─── PLAYER ───────────────────────────────────────────────────────────────

  buildPlayer() {
    const startX = 100;
    const startY = LOW - 50;

    this.player = this.add.rectangle(startX, startY, 28, 40, HEROES[this.heroKey].color);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setGravityY(400);
    this.player.body.setMaxVelocityY(600);

    // Hero letter label
    this.heroLabel = this.add.text(startX, startY - 28, HEROES[this.heroKey].letter, {
      fontSize: '16px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    this.physics.add.collider(this.player, this.platforms);
  }

  applyHero(k) {
    this.heroKey = k;
    const h = HEROES[k];
    if (this.player) {
      this.player.setFillStyle(h.color);
    }
    if (this.heroLabel) {
      this.heroLabel.setText(h.letter);
    }
    this.atkCooldown = 0;
    this.refreshBar();
    this.refreshDmg();
    this.updateHint(0);
  }

  swap(k) {
    if (!ORDER.includes(k)) return;
    if (k === this.heroKey) return;
    this.applyHero(k);
    this.floatText(this.player.x, this.player.y - 60, HEROES[k].name + '!', HEROES[k].color);
    audioManager.play('swap');
  }

  // ─── INPUT / MOVEMENT ────────────────────────────────────────────────────

  bindInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys    = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      z: Phaser.Input.Keyboard.KeyCodes.Z,
      x: Phaser.Input.Keyboard.KeyCodes.X,
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      r: Phaser.Input.Keyboard.KeyCodes.R,
      f: Phaser.Input.Keyboard.KeyCodes.F,
      g: Phaser.Input.Keyboard.KeyCodes.G,
      m: Phaser.Input.Keyboard.KeyCodes.M,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC,
      one:   Phaser.Input.Keyboard.KeyCodes.ONE,
      two:   Phaser.Input.Keyboard.KeyCodes.TWO,
      three: Phaser.Input.Keyboard.KeyCodes.THREE,
      four:  Phaser.Input.Keyboard.KeyCodes.FOUR,
      five:  Phaser.Input.Keyboard.KeyCodes.FIVE,
      six:   Phaser.Input.Keyboard.KeyCodes.SIX,
    });

    // Hero swap keys
    this.input.keyboard.on('keydown-ONE',   () => this.swap('fire'));
    this.input.keyboard.on('keydown-TWO',   () => this.swap('water'));
    this.input.keyboard.on('keydown-THREE', () => this.swap('earth'));
    this.input.keyboard.on('keydown-FOUR',  () => this.swap('stone'));
    this.input.keyboard.on('keydown-FIVE',  () => this.swap('poison'));
    this.input.keyboard.on('keydown-SIX',   () => this.swap('rubber'));

    // Menu
    this.input.keyboard.on('keydown-M',   () => this.toggleMenu());
    this.input.keyboard.on('keydown-ESC', () => { if (this.menuOpen) this.toggleMenu(); });

    // Ability
    this.input.keyboard.on('keydown-Q', () => this.ability());

    // Grapple
    this.input.keyboard.on('keydown-G', () => this.grappleSwing());

    // Respawn at checkpoint
    this.input.keyboard.on('keydown-R', () => {
      if (this.dead && this.saves > 0 && this.lastCheckpoint) {
        this.respawn();
      }
    });
  }

  handleMovement(delta) {
    if (!this.player || this.grappling) return;

    const speed   = 200;
    const jumpVel = -480;
    const body    = this.player.body;

    this.grounded = body.blocked.down;

    let vx = 0;
    if (this.cursors.left.isDown  || this.keys.a.isDown) vx = -speed;
    if (this.cursors.right.isDown || this.keys.d.isDown) vx =  speed;

    body.setVelocityX(vx);

    if ((this.cursors.up.isDown || this.cursors.space.isDown || this.keys.w.isDown) && this.grounded) {
      body.setVelocityY(jumpVel);
      audioManager.play('jump');
    }

    // Down through upper platforms
    if (this.cursors.down.isDown || this.keys.s.isDown) {
      // Allow passing through upper platforms (thin platforms) by temporarily disabling
      this.upperPlatforms.getChildren().forEach(p => {
        if (p.body) p.body.checkCollision.up = false;
      });
    } else {
      this.upperPlatforms.getChildren().forEach(p => {
        if (p.body) p.body.checkCollision.up = true;
      });
    }

    // Sync label
    if (this.heroLabel) {
      this.heroLabel.setPosition(this.player.x, this.player.y - 28);
    }
  }

  handleAttack(time) {
    if (!this.player) return;

    const attackKey = this.cursors.shift.isDown || this.keys.z.isDown || this.keys.x.isDown;
    const h         = HEROES[this.heroKey];
    const now       = this.time.now;

    if (attackKey && now > this.atkCooldown) {
      this.atkCooldown = now + h.cd;
      this.attack();
    }
  }

  attack() {
    const h  = HEROES[this.heroKey];
    const px = this.player.x;
    const py = this.player.y;

    if (h.atk === 'ranged') {
      // Fire projectile toward nearest enemy or in facing direction
      let tx = px + 300;
      let ty = py;
      let nearest = null;
      let nearestDist = Infinity;

      this.enemies.forEach(e => {
        if (e.dead) return;
        const d = Phaser.Math.Distance.Between(px, py, e.body.x, e.body.y);
        if (d < nearestDist) {
          nearestDist = d;
          nearest     = e;
        }
      });

      if (nearest && nearestDist < 500) {
        tx = nearest.body.x;
        ty = nearest.body.y;
      }

      const dx  = tx - px;
      const dy  = ty - py;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;

      const shot = this.add.circle(px, py, 6, HEROES[this.heroKey].color);
      this.physics.add.existing(shot);
      shot.body.setAllowGravity(false);
      shot.body.setVelocity((dx / len) * 350, (dy / len) * 350);
      shot.heroKey = this.heroKey;
      this.shots.add(shot);

      this.time.delayedCall(2500, () => { if (shot.active) shot.destroy(); });
      audioManager.play('attack_ranged');

    } else {
      // Melee: hit nearby enemies
      this.enemies.forEach(e => {
        if (e.dead) return;
        if (Phaser.Math.Distance.Between(px, py, e.body.x, e.body.y) < 60) {
          this.resolveHit(e, HEROES[this.heroKey].kills);
        }
      });

      // Melee vs boss
      if (this.boss && this.bossActive && !this.bossDefeated) {
        if (Phaser.Math.Distance.Between(px, py, this.boss.x, this.boss.y) < 80) {
          this.damageBoss();
        }
      }

      // Melee flash
      const slash = this.add.rectangle(px + 40, py, 60, 30, HEROES[this.heroKey].color, 0.7);
      this.tweens.add({
        targets: slash,
        alpha: 0, scaleX: 0,
        duration: 150,
        onComplete: () => slash.destroy()
      });
      audioManager.play('attack_melee');
    }

    // Ability side-effect for cross heroes
    if (HEROES[this.heroKey].cross) {
      this.addRegen(HEROES[this.heroKey].cross);
    }
  }

  ability() {
    const h = HEROES[this.heroKey];
    switch (this.heroKey) {
      case 'fire':
        // Fire burst - damage all nearby enemies
        this.enemies.forEach(e => {
          if (e.dead) return;
          if (Phaser.Math.Distance.Between(this.player.x, this.player.y, e.body.x, e.body.y) < 150) {
            this.resolveHit(e, ['ice', 'fireD']);
          }
        });
        this.floatText(this.player.x, this.player.y - 60, 'FLAME BURST!', 0xff5500);
        audioManager.play('ability_fire');
        break;

      case 'water':
        // Water cross - heal
        this.hp = Math.min(this.hp + 1, this.maxHp);
        this.drawHearts();
        this.floatText(this.player.x, this.player.y - 60, 'HEAL +1', 0x3aa0ff);
        audioManager.play('ability_water');
        break;

      case 'earth':
        // Earth stomp - knock back
        this.enemies.forEach(e => {
          if (e.dead) return;
          if (Phaser.Math.Distance.Between(this.player.x, this.player.y, e.body.x, e.body.y) < 120) {
            const dx = e.body.x - this.player.x;
            e.body.body.setVelocityX(dx * 4);
            e.body.body.setVelocityY(-200);
            this.resolveHit(e, []);
          }
        });
        this.floatText(this.player.x, this.player.y - 60, 'EARTH STOMP!', 0xc08a4e);
        audioManager.play('ability_earth');
        break;

      case 'stone':
        // Stone shield - brief invincibility
        this.invincible = true;
        const shield = this.add.circle(this.player.x, this.player.y, 40, 0x9a8c7a, 0.5);
        this.tweens.add({
          targets: shield,
          alpha: 0,
          duration: 2000,
          onComplete: () => { shield.destroy(); this.invincible = false; }
        });
        this.floatText(this.player.x, this.player.y - 60, 'STONE SHIELD!', 0x9a8c7a);
        audioManager.play('ability_stone');
        break;

      case 'poison':
        // Acid cloud - damage over time
        this.enemies.forEach(e => {
          if (e.dead) return;
          if (Phaser.Math.Distance.Between(this.player.x, this.player.y, e.body.x, e.body.y) < 180) {
            this.time.addEvent({
              delay: 500,
              repeat: 4,
              callback: () => {
                if (!e.dead) this.resolveHit(e, ['acidD']);
              }
            });
          }
        });
        this.floatText(this.player.x, this.player.y - 60, 'ACID CLOUD!', 0x7ad14a);
        audioManager.play('ability_poison');
        break;

      case 'rubber':
        // Rubber bounce - super jump
        this.player.body.setVelocityY(-700);
        this.floatText(this.player.x, this.player.y - 60, 'BOUNCE!', 0xe85aa0);
        audioManager.play('ability_rubber');
        break;
    }
  }

  grappleSwing() {
    if (this.grappling) {
      // Release
      this.grappling = false;
      if (this.grappleRope) { this.grappleRope.destroy(); this.grappleRope = null; }
      return;
    }

    // Find nearest upper platform to use as anchor
    let anchor = null;
    let minDist = Infinity;

    this.upperPlatforms.getChildren().forEach(p => {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, p.y);
      if (d < 200 && d < minDist) {
        minDist = d;
        anchor  = p;
      }
    });

    if (!anchor) {
      this.floatText(this.player.x, this.player.y - 40, 'No anchor!', 0xff8888);
      return;
    }

    this.grappling     = true;
    this.grappleAnchor = { x: anchor.x, y: anchor.y };
    this.grappleLen    = minDist;
    this.grappleAngle  = Math.atan2(this.player.y - anchor.y, this.player.x - anchor.x);

    this.grappleRope = this.add.graphics();
    audioManager.play('grapple');
  }

  handleGrapple(delta) {
    if (!this.grappling || !this.grappleAnchor) return;

    const dt      = delta / 1000;
    const gravity = 500;
    const anchor  = this.grappleAnchor;

    // Pendulum physics
    const angularAccel = (-gravity / this.grappleLen) * Math.sin(this.grappleAngle);
    this.grappleAngVel = (this.grappleAngVel || 0) + angularAccel * dt;
    this.grappleAngle += this.grappleAngVel * dt;

    // Input to pump
    if (this.cursors.left.isDown  || this.keys.a.isDown) this.grappleAngVel -= 2 * dt;
    if (this.cursors.right.isDown || this.keys.d.isDown) this.grappleAngVel += 2 * dt;

    const nx = anchor.x + Math.cos(this.grappleAngle) * this.grappleLen;
    const ny = anchor.y + Math.sin(this.grappleAngle) * this.grappleLen;

    this.player.setPosition(nx, ny);
    this.player.body.reset(nx, ny);

    // Draw rope
    if (this.grappleRope) {
      this.grappleRope.clear();
      this.grappleRope.lineStyle(2, 0xffffff, 0.8);
      this.grappleRope.beginPath();
      this.grappleRope.moveTo(anchor.x, anchor.y);
      this.grappleRope.lineTo(nx, ny);
      this.grappleRope.strokePath();
    }

    if (this.heroLabel) this.heroLabel.setPosition(nx, ny - 28);

    // Auto-release if grounded
    if (this.player.body.blocked.down) {
      this.grappling = false;
      if (this.grappleRope) { this.grappleRope.destroy(); this.grappleRope = null; }
    }
  }

  // ─── REGEN ────────────────────────────────────────────────────────────────

  addRegen(type) {
    // Cross abilities add periodic regen
    const interval = type === 'water' ? 3 : 5;
    this.time.delayedCall(interval * 1000, () => {
      if (this.hp < this.maxHp) {
        this.hp++;
        this.drawHearts();
        this.floatText(this.player.x, this.player.y - 50, '+1 REGEN', 0x44ffaa);
      }
    });
  }

  tickRegen(delta) {
    // Passive regen from cross heroes is handled via delayedCall
  }

  // ─── COMBAT ───────────────────────────────────────────────────────────────

  hurt(amount) {
    if (this.invincible || this.dead) return;
    this.hp -= amount;
    this.drawHearts();
    this.flash(this.player, 0xff0000);
    this.invincible = true;
    audioManager.play('hurt');

    this.time.delayedCall(800, () => { this.invincible = false; });

    if (this.hp <= 0) {
      this.loseHard();
    }
  }

  respawn() {
    if (!this.lastCheckpoint || this.saves <= 0) return;
    this.saves--;
    this.hp = Math.ceil(this.maxHp / 2);
    this.dead = false;
    this.invincible = true;
    this.player.setPosition(this.lastCheckpoint.x, this.lastCheckpoint.y - 60);
    this.player.body.reset(this.lastCheckpoint.x, this.lastCheckpoint.y - 60);
    this.player.setAlpha(1);
    this.drawHearts();
    this.refreshSaves();
    this.floatText(this.lastCheckpoint.x, this.lastCheckpoint.y - 100, 'Respawned!', 0x44ff88);
    this.time.delayedCall(1500, () => { this.invincible = false; });
    audioManager.play('respawn');
  }

  win() {
    this.won = true;
    this.timerActive = false;
    saveSystem.saveTime(Math.floor(this.elapsed));
    audioManager.play('win');

    const panel = this.add.rectangle(W / 2, H / 2, 500, 300, 0x000000, 0.85)
      .setScrollFactor(0).setDepth(10);
    this.add.text(W / 2, H / 2 - 90, '🏆 YOU WIN!', {
      fontSize: '36px', color: '#ffdd00', fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11);
    this.add.text(W / 2, H / 2 - 30, 'Time: ' + this.formatTime(this.elapsed), {
      fontSize: '22px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11);
    this.add.text(W / 2, H / 2 + 30, 'Press R to restart', {
      fontSize: '18px', color: '#aaffaa', fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11);

    this.input.keyboard.once('keydown-R', () => { this.scene.restart(); });
  }

  loseHard() {
    this.dead = true;
    this.player.setAlpha(0.3);
    this.timerActive = false;
    audioManager.play('die');

    const canRespawn = this.saves > 0 && this.lastCheckpoint !== null;

    const panel = this.add.rectangle(W / 2, H / 2, 500, 280, 0x000000, 0.85)
      .setScrollFactor(0).setDepth(10);
    this.add.text(W / 2, H / 2 - 80, '💀 GAME OVER', {
      fontSize: '32px', color: '#ff4444', fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11);

    if (canRespawn) {
      this.add.text(W / 2, H / 2, 'Press R to respawn at checkpoint\n(' + this.saves + ' save' + (this.saves !== 1 ? 's' : '') + ' remaining)', {
        fontSize: '16px', color: '#ffffff', fontFamily: 'monospace', align: 'center'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(11);
    } else {
      this.add.text(W / 2, H / 2, 'No saves remaining!\nPress R to restart', {
        fontSize: '16px', color: '#ffaaaa', fontFamily: 'monospace', align: 'center'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(11);
      this.input.keyboard.once('keydown-R', () => { this.scene.restart(); });
    }
  }

  // ─── HUD ──────────────────────────────────────────────────────────────────

  buildHUD() {
    // Hearts
    this.drawHearts();

    // Cooldown bar
    this.barBg = this.add.rectangle(W - 110, H - 24, 100, 14, 0x333333)
      .setScrollFactor(0).setDepth(5);
    this.barFill = this.add.rectangle(W - 160, H - 24, 100, 14, HEROES[this.heroKey].color)
      .setScrollFactor(0).setDepth(5).setOrigin(0, 0.5);
    this.add.text(W - 110, H - 40, 'ATK CD', {
      fontSize: '10px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(5);

    // Damage multiplier
    this.dmgText = this.add.text(W - 110, H - 58, 'DMG x1', {
      fontSize: '12px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(5);

    // Timer
    this.timerText = this.add.text(W / 2, 10, '00:00', {
      fontSize: '18px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0).setDepth(5);

    // Hint text
    this.hintText = this.add.text(W / 2, H - 20, '', {
      fontSize: '13px', color: '#ffffaa', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0).setDepth(5);

    // Saves
    this.savesText = this.add.text(10, H - 20, 'Saves: 3', {
      fontSize: '13px', color: '#aaffaa', fontFamily: 'monospace'
    }).setScrollFactor(0).setDepth(5);

    // Hero name (top-left)
    this.heroNameText = this.add.text(10, 10, 'Hero: Fire', {
      fontSize: '14px', color: '#ffffff', fontFamily: 'monospace'
    }).setScrollFactor(0).setDepth(5);
  }

  drawHearts() {
    this.heartSprites.forEach(h => h.destroy());
    this.heartSprites = [];
    for (let i = 0; i < this.maxHp; i++) {
      const full  = i < this.hp;
      const heart = this.add.text(14 + i * 24, 14, full ? '❤' : '🖤', {
        fontSize: '18px'
      }).setScrollFactor(0).setDepth(5);
      this.heartSprites.push(heart);
    }
  }

  refreshBar() {
    if (!this.barFill) return;
    this.barFill.setFillStyle(HEROES[this.heroKey].color);
    if (this.heroNameText) {
      this.heroNameText.setText('Hero: ' + HEROES[this.heroKey].name + '  [1-6]');
    }
  }

  refreshDmg() {
    if (!this.dmgText) return;
    this.dmgText.setText('DMG x' + this.dmgMult);
  }

  refreshSaves() {
    if (!this.savesText) return;
    this.savesText.setText('Saves: ' + this.saves);
  }

  updateTimer() {
    if (!this.timerText || !this.timerActive) return;
    this.timerText.setText(this.formatTime(this.elapsed));
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  updateHint(delta) {
    if (!this.hintText) return;

    // Context-sensitive hints
    let hint = '';
    const px = this.player ? this.player.x : 0;

    if (px < 400) {
      hint = 'Arrow keys / WASD to move, Space/W to jump';
    } else if (px < 1000) {
      hint = 'Z/X/Shift to attack | Q for ability | 1-6 to swap hero';
    } else if (px < 1500) {
      hint = 'Reach the checkpoint to save your progress';
    } else if (px < 2500) {
      hint = 'G to grapple onto upper platforms!';
    } else if (px < 3500) {
      hint = 'Each hero counters specific enemy types';
    } else if (px < 4500) {
      hint = 'Boss arena ahead - prepare yourself!';
    } else {
      hint = 'Defeat the boss to win!';
    }

    if (hint !== this.currentHint) {
      this.currentHint = hint;
      this.hintText.setText(hint);
    }
  }

  // ─── MENU ─────────────────────────────────────────────────────────────────

  buildMenu() {
    const bg = this.add.rectangle(W / 2, H / 2, 420, 320, 0x000000, 0.92)
      .setScrollFactor(0).setDepth(20).setVisible(false);
    const title = this.add.text(W / 2, H / 2 - 120, 'MENU', {
      fontSize: '24px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21).setVisible(false);

    const items = ['Resume', 'Restart Level', 'Controls', 'Quit'];
    const itemObjs = items.map((label, i) => {
      return this.add.text(W / 2, H / 2 - 60 + i * 44, label, {
        fontSize: '18px', color: '#aaffaa', fontFamily: 'monospace'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(21).setVisible(false);
    });

    this.menuPanel = { bg, title, items: itemObjs };
    this.menuItems = itemObjs;

    // Menu navigation
    this.input.keyboard.on('keydown-UP', () => {
      if (!this.menuOpen) return;
      this.menuCursor = (this.menuCursor - 1 + this.menuItems.length) % this.menuItems.length;
      this.menuKeys();
    });
    this.input.keyboard.on('keydown-DOWN', () => {
      if (!this.menuOpen) return;
      this.menuCursor = (this.menuCursor + 1) % this.menuItems.length;
      this.menuKeys();
    });
    this.input.keyboard.on('keydown-ENTER', () => {
      if (!this.menuOpen) return;
      this.menuSelect();
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const vis = this.menuOpen;
    if (this.menuPanel) {
      this.menuPanel.bg.setVisible(vis);
      this.menuPanel.title.setVisible(vis);
      this.menuPanel.items.forEach(i => i.setVisible(vis));
    }
    if (this.menuOpen) {
      this.menuCursor = 0;
      this.menuKeys();
    }
  }

  menuKeys() {
    if (!this.menuItems) return;
    this.menuItems.forEach((item, i) => {
      item.setColor(i === this.menuCursor ? '#ffff00' : '#aaffaa');
    });
  }

  menuSelect() {
    switch (this.menuCursor) {
      case 0: this.toggleMenu(); break;          // Resume
      case 1: this.scene.restart(); break;       // Restart
      case 2:                                    // Controls
        this.showPanel(
          'Controls:\n' +
          'Arrow/WASD - Move\n' +
          'W/Space - Jump\n' +
          'Z/X/Shift - Attack\n' +
          'Q - Ability\n' +
          'G - Grapple\n' +
          '1-6 - Swap Hero\n' +
          'M/Esc - Menu'
        );
        break;
      case 3: window.location.reload(); break;   // Quit
    }
  }

  showPanel(message) {
    const panel = this.add.rectangle(W / 2, H / 2, 480, 300, 0x000022, 0.95)
      .setScrollFactor(0).setDepth(30);
    const txt = this.add.text(W / 2, H / 2, message, {
      fontSize: '14px', color: '#ffffff', fontFamily: 'monospace', align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(31);
    const close = this.add.text(W / 2, H / 2 + 120, '[Press any key to close]', {
      fontSize: '12px', color: '#aaaaaa', fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(31);

    const dismiss = () => {
      panel.destroy();
      txt.destroy();
      close.destroy();
      this.menuOpen = false;
    };
    this.input.keyboard.once('keydown', dismiss);
  }

  // ─── UTILITY ──────────────────────────────────────────────────────────────

  near(a, b, dist) {
    return Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y) < dist;
  }

  hasPack() {
    return this.pack;
  }

  flash(obj, color) {
    if (!obj || !obj.active) return;
    const original = obj.fillColor;
    obj.setFillStyle(color);
    this.time.delayedCall(120, () => {
      if (obj.active) obj.setFillStyle(original);
    });
  }

  floatText(x, y, text, color = 0xffffff) {
    const hex = '#' + color.toString(16).padStart(6, '0');
    const t = this.add.text(x, y, text, {
      fontSize: '14px', color: hex, fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(8);
    this.tweens.add({
      targets: t,
      y: y - 50,
      alpha: 0,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => t.destroy()
    });
    return t;
  }

  anyKey(callback) {
    this.input.keyboard.once('keydown', callback);
  }

  labelFor(type) {
    return COUNTER[type] || '?';
  }

  poolVisual(x, y, w, h, color) {
    return this.add.rectangle(x, y, w, h, color);
  }

  jp(x, y) {
    // Jump pad helper: create a spring/trampoline visual
    const pad = this.add.rectangle(x, y, 40, 10, 0xffdd00);
    this.physics.add.existing(pad, true);
    this.platforms.add(pad);
    // Player bounces when touching pad
    return pad;
  }
}

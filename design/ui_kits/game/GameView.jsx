// Forest level runtime: Tiled .tmj map, parallax, 8 switchable heroes, Rotroot / Mothwing / Sporecap enemies,
// checkpoints, Elder Rotroot mid-boss arena (thorn gates) and Blightwarden final boss. Renders at 640x360, 60 ticks/s.
const EHA = '../../../assets/';
// tile ids from tileset_forest.tsj: 63-67 bounce mushroom, 68/69/71/73 hollow log shell, 56-58 crumble planks, 60-62 rope bridge (59 = crumbled, gone)
const EH_SOLID = new Set([0,1,2,3,4,7,8,9,10,11,12,13,14,15,16,17,18,24,25,30,63,64,65,66,67,68,69,71,73]);
const EH_PLAT = new Set([19,20,21,22,23,56,57,58,60,61,62]);
const EH_HAZ = new Set([26,27,28,29,36]);
const EH_HERO = { idle:4, run:8, jump:2, fall:2, land:2, attack:6, hurt:2, death:6 };
const EH_ROT = { idle:4, move:6, attack:4, hurt:2, death:5 };
const EH_MOTH = { fly:4, attack:4, hurt:2, death:5 };
const EH_SPORE = { idle:4, attack:6, hurt:2, death:5 };
const EH_ELDER = { idle:4, move:6, tell:3, charge:4, throw:5, hurt:2, death:8 };
const EH_BOSS = { idle:4, telegraph:4, attack:6, hurt:2, death:8 };
// Playable roster: the four cousins (keys 1-4), then each Hearth Knight once its statue is woken (Q/E cycles everyone).
// Projectile stats per element are placeholders for tuning: v = speed (px/tick), dmg = damage, arc = lobbed, pierce = passes through enemies.
const EH_POWER = {
  fire: { v: 4.2, dmg: 1 }, water: { v: 3.6, dmg: 1 }, earth: { v: 3.4, dmg: 2, arc: true }, air: { v: 5.2, dmg: 1, pierce: true },
  ice: { v: 4.8, dmg: 1 }, lightning: { v: 6.5, dmg: 1 }, shadow: { v: 3.2, dmg: 2 }, light: { v: 5.6, dmg: 1, pierce: true },
};
const EH_COUSINS = [
  { id: 'konstantin', el: 'light', name: 'Kosta', kid: true },
  { id: 'katarina',   el: 'ice',   name: 'Katarina', kid: true },
  { id: 'vasilije',   el: 'fire',  name: 'Vasilije', kid: true },
  { id: 'dimitrije',  el: 'air',   name: 'Dimitrije', kid: true },
];
const EH_KNIGHTS = { fire: 'Cinder', water: 'Brine', earth: 'Basalt', air: 'Wisp', ice: 'Rime', lightning: 'Jolt', shadow: 'Umbra', light: 'Aurel' };
const EH_ELEMENTS = Object.keys(EH_POWER);
const EH_STAR = 'dimitrije';   // level 1's star: the level starts with him and only he can land the final blow on its boss
const GROUND_Y = 288;
function ehImg(src){ return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }); }

function GameView({ paused, runId, onHud, onEnd, onStory }) {
  const cv = React.useRef(null);
  const pausedRef = React.useRef(paused);
  pausedRef.current = paused;
  React.useEffect(() => {
    let alive = true, raf = 0;
    const keys = {}; let wantHero = -1, cycle = 0, jumpBuf = 0;   // jumpBuf remembers a jump press for a few ticks so quick taps aren't lost
    const kd = e => { keys[e.code] = true; const d = /^Digit([1-4])$/.exec(e.code); if (d) wantHero = +d[1] - 1; if (['Space','ArrowUp','KeyW'].includes(e.code) && !e.repeat) jumpBuf = 8; if (e.code === 'KeyQ') cycle = -1; if (e.code === 'KeyE') cycle = 1; if (['Space','ArrowUp','ArrowDown'].includes(e.code)) e.preventDefault(); };
    const ku = e => { keys[e.code] = false; };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    (async () => {
      const map = await (await fetch(EHA + 'maps/forest_mock.tmj')).json();
      // tile layers: ids (-1 = empty) plus horizontal-flip flags (Tiled keeps flips in the gid's top bits)
      const L = n => { const l = map.layers.find(l => l.name === n); if (!l) return null; return { id: l.data.map(g => (g % 0x20000000) - 1), flip: l.data.map(g => g >= 0x80000000) }; };
      const GL = L('ground'), DBL = L('decor_back'), DL = L('decor'), FGL = L('foreground'), ground = GL.id;
      const crumble = {}, bounceT = {}; let fgA = 1;   // per-tile crumble timers, bounce animations, foreground fade
      const S = EHA + 'sprites/', img = {};
      const load = async (k, p) => { img[k] = await ehImg(EHA + p); };
      await Promise.all([
        load('tiles', 'tilesets/forest/tileset_forest.png'),
        ...['sky','far','mid','near','arena_near'].map(k => load(k, `backgrounds/forest/bg_forest_${k}.png`)),
        load('fg', 'backgrounds/forest/fg_forest_branches.png'),
        load('coin', 'sprites/items/item_coin_spin.png'), load('heart', 'sprites/items/item_heart_pickup.png'), load('gem', 'sprites/items/item_gem_forest.png'),
        load('fx_coin', 'sprites/items/fx_pickup_coin.png'), load('fx_heart', 'sprites/items/fx_pickup_heart.png'),
        ...['dust_jump','dust_land','splash_water','hit_spark','hero_respawn'].map(k => load('fx_' + k, `sprites/fx/fx_${k}.png`)),
        ...['idle','activate','lit'].map(k => load('cp_' + k, `sprites/props/forest/prop_checkpoint_shrine_${k}.png`)),
        load('arch', 'sprites/props/forest/prop_exit_arch.png'),
        ...EH_ELEMENTS.map(el => load('st_' + el, `sprites/statues/statue_knight_${el}.png`)), load('st_awaken', 'sprites/statues/fx_statue_awaken.png'),
        ...['idle', 'run', 'jump', 'special'].map(k => load('pup_' + k, `sprites/companions/companion_puppy/companion_puppy_${k}.png`)),
        load('yarn', 'sprites/items/item_yarn_ball.png'), load('ball', 'sprites/props/prop_football.png'), load('poster', 'sprites/props/prop_poster_karate_badass.png'),
        ...EH_COUSINS.flatMap(c => [...Object.keys(EH_HERO), 'respawn'].map(k => load(`h_${c.id}_${k}`, `sprites/heroes/kids/${c.id}/hero_${c.id}_${k}.png`))),
        ...EH_ELEMENTS.flatMap(el => [
          ...Object.keys(EH_HERO).map(k => load(`h_k_${el}_${k}`, `sprites/heroes/${el}/hero_${el}_${k}.png`)),
          load('p_' + el, `sprites/heroes/${el}/fx_${el}_projectile.png`), load('i_' + el, `sprites/heroes/${el}/fx_${el}_impact.png`),
          load('rs_' + el, `sprites/heroes/${el}/fx_${el}_respawn.png`)]),
        ...Object.keys(EH_ROT).map(k => load('r_' + k, `sprites/enemies/forest/rotroot/enemy_rotroot_${k}.png`)),
        ...Object.keys(EH_MOTH).map(k => load('m_' + k, `sprites/enemies/forest/mothwing/enemy_mothwing_${k}.png`)),
        ...Object.keys(EH_SPORE).map(k => load('s_' + k, `sprites/enemies/forest/sporecap/enemy_sporecap_${k}.png`)),
        load('spore', 'sprites/enemies/forest/sporecap/fx_spore_projectile.png'), load('fx_spore_burst', 'sprites/enemies/forest/sporecap/fx_spore_burst.png'),
        ...Object.keys(EH_ELDER).map(k => load('e_' + k, `sprites/bosses/forest/elder_rotroot/boss_rotroot_${k}.png`)),
        load('seed', 'sprites/bosses/forest/elder_rotroot/fx_seed_projectile.png'), load('fx_seed_impact', 'sprites/bosses/forest/elder_rotroot/fx_seed_impact.png'),
        load('gate_closed', 'sprites/bosses/forest/elder_rotroot/prop_thorn_gate_closed.png'), load('gate_opening', 'sprites/bosses/forest/elder_rotroot/prop_thorn_gate_opening.png'),
        load('bar_frame', 'sprites/bosses/forest/elder_rotroot/ui_bossbar_frame.png'), load('bar_fill', 'sprites/bosses/forest/elder_rotroot/ui_bossbar_fill.png'),
        ...Object.keys(EH_BOSS).map(k => load('b_' + k, `sprites/bosses/forest/blightwarden/boss_blightwarden_${k}.png`)),
        load('warn', 'sprites/bosses/forest/blightwarden/fx_blightwarden_warning.png'), load('roots', 'sprites/bosses/forest/blightwarden/fx_blightwarden_roots.png'),
      ]);
      if (!alive) return;
      const ctx = cv.current.getContext('2d'); ctx.imageSmoothingEnabled = false;
      const MW = map.width, MH = map.height, LW = MW * 32; let cam = 0, camF = 0;
      const tileAt = (px, py) => { const tx = Math.floor(px / 32), ty = Math.floor(py / 32); if (tx < 0 || tx >= MW || ty < 0 || ty >= MH) return -1; return ground[ty * MW + tx]; };
      const surface = (px, ty) => { const tx = Math.floor(px / 32); if (tx < 0 || tx >= MW || ty < 0 || ty >= MH) return null; const id = ground[ty * MW + tx], xx = px - tx * 32;
        if (EH_SOLID.has(id)) return ty * 32; if (id === 5) return ty * 32 + 31 - xx; if (id === 6) return ty * 32 + xx; if (EH_PLAT.has(id)) return ty * 32 + 1; return null; };
      const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
      const ents = map.layers.find(l => l.name === 'entities').objects, of = t => ents.filter(o => o.type === t);
      const sp = ents.find(o => o.name === 'player_spawn');
      const spawn = { x: sp ? sp.x : 64, y: sp ? sp.y : 257 }; let safe = { ...spawn };
      const ROSTER = EH_COUSINS.map(c => ({ ...c }));
      const H = { ...spawn, vx: 0, vy: 0, face: 1, ground: true, attackT: 0, hurtT: 0, inv: 0, landT: 0, dead: 0, hp: 4, coins: 0, fired: false, hero: ROSTER.findIndex(r => r.id === EH_STAR), swapT: 0 };
      // Hearth Knight statues: touching one wakes the knight, who joins the roster
      const ST = ents.filter(o => o.type === 'knight_statue').map(o => ({ el: o.name, x: o.x, y: o.y, woke: false, wakeT: -1 }));
      // puppy (Dimitrije's companion): waits on Baba's yarn, then follows the party and barks near hidden gems
      const po = ents.find(o => o.type === 'companion_puppy');
      // each pet belongs to one cousin: only the owner can befriend it, and it only stays on screen while its owner is the active hero
      const PUP = po ? { owner: 'dimitrije', ownerName: 'DIMITRIJE', ownerKey: 4, x: po.x, y: po.y, st: 'wait', face: -1, anim: 'idle', t: 0, barkT: 0, cool: 120, hinted: false } : null;
      const bo2 = ents.find(o => o.type === 'prop_football'), BALL = bo2 ? { x: bo2.x, y: bo2.y, sx: bo2.x, sy: bo2.y, vx: 0, vy: 0, roll: 0 } : null;
      const poster = ents.find(o => o.type === 'prop_poster');
      let toast = null; const say = text => { toast = { text, t: 0 }; };
      const heroBox = () => ({ x: H.x + 10, y: H.y + 8, w: 12, h: 23 });
      // enemies share one list; kind decides behaviour, hitbox and sprites
      const E = [
        ...of('enemy_rotroot').map(o => ({ kind: 'rot', x: o.x, y: o.y, x0: o.x - 48, x1: o.x + 40, dir: -1, hp: 2, hurt: 0, dead: 0 })),
        ...of('enemy_mothwing').map(o => ({ kind: 'moth', x: o.x + 16, y: o.y + 16, bx: o.x + 16, by: o.y + 16, x0: o.x - 48, x1: o.x + 80, dir: 1, hp: 1, hurt: 0, dead: 0, st: 'fly', t: 0, cd: 0, tx: 0, ty: 0 })),
        ...of('enemy_sporecap').map(o => ({ kind: 'spore', x: o.x, y: o.y, dir: -1, hp: 2, hurt: 0, dead: 0, st: 'idle', t: 0, cd: 60 })),
      ];
      const ebox = e => e.kind === 'rot' ? { x: e.x + 9, y: e.y + 12, w: 14, h: 20 } : e.kind === 'moth' ? { x: e.x - 9, y: e.y - 9, w: 18, h: 14 } : { x: e.x + 6, y: e.y + 9, w: 20, h: 22 };
      const C = of('item_coin').map(o => ({ x: o.x, y: o.y, got: false }));
      const HP = of('item_heart').map(o => ({ x: o.x, y: o.y, got: false }));
      const GM = of('item_gem').map(o => ({ x: o.x, y: o.y, got: false }));
      const CP = of('checkpoint').map(o => ({ x: o.x, y: o.y, st: 'idle', t: 0 })); let activeCP = null;
      const ex = ents.find(o => o.type === 'exit_arch');
      const B = [], X = [], SPORES = [], SEEDS = [];
      // one-shot FX: key, frame count, fps, top-left, frame width
      const fx = (k, n, fps, x, y, w) => X.push({ k, n, d: 60 / fps, x, y, w, t: 0 });
      // thorn gates + Elder Rotroot (Forest 1-1 boss per its README: 12 HP, wander 1.5s / charge / seed throw)
      const gates = of('thorn_gate').sort((a, b) => a.x - b.x).map((o, i) => ({ x: o.x, y: o.y, st: i === 0 ? 'open' : 'closed', t: 99 }));
      const eo = ents.find(o => o.type === 'boss_rotroot');
      const ELD = eo ? { sx: eo.x, x: eo.x, y: eo.y, hp: 12, max: 12, st: 'wait', t: 0, n: 0, dir: -1, hurt: 0, dead: 0, awake: false, name: 'ELDER ROTROOT' } : null;
      const arenaL = gates.length ? gates[0].x + 32 : 0, arenaR = gates.length > 1 ? gates[1].x : LW;
      const elderBox = () => ({ x: ELD.x + (ELD.dir < 0 ? 17 : 15), y: ELD.y + 18, w: 32, h: 45 });
      // Blightwarden (final boss): stationary Root Slam per its README
      const bo = ents.find(o => o.type === 'boss_blightwarden');
      const BOSS = bo ? { x: bo.x, y: bo.y, hp: 24, max: 24, state: 'idle', t: 0, n: 0, hurt: 0, dead: 0, awake: false, spots: [], roots: [], name: 'BLIGHTWARDEN' } : null;
      const bossBody = () => ({ x: BOSS.x + 28, y: BOSS.y + 22, w: 42, h: 72 });
      const bossWeak = () => ({ x: BOSS.x + 36, y: BOSS.y + 34, w: 26, h: 14 });
      const finalL = LW - 640;
      let tick = 0, lastHud = '';
      const told = new Set(), story = id => { if (!told.has(id)) { told.add(id); onStory && onStory(id); } };   // each story moment plays once per run
      const hurt = dir => { if (H.inv > 0 || H.dead) return; H.hp -= 0.5; H.hurtT = 16; H.inv = 70; H.vx = -2 * dir; H.vy = -3; H.ground = false; if (H.hp <= 0) { H.dead = 1; H.vx = 0; } };
      const drawStrip = (im, n, f, x, y, w, flip) => { if (!im) return; f = Math.max(0, Math.min(n - 1, Math.floor(f))); ctx.save(); ctx.translate(Math.round(x) + (flip ? w : 0), Math.round(y)); ctx.scale(flip ? -1 : 1, 1); ctx.drawImage(im, f * w, 0, w, im.height, 0, 0, w, im.height); ctx.restore(); };
      const drawLayer = lay => { if (!lay) return; const c0 = Math.max(0, Math.floor(cam / 32)), c1 = Math.min(MW, c0 + 22);
        for (let r = 0; r < MH; r++) for (let c = c0; c < c1; c++) { const i = r * MW + c; let id = lay.id[i]; if (id < 0) continue;
          if (id === 32) id = 32 + (Math.floor(tick / 10) % 4); if (id === 36) id = 36 + (Math.floor(tick / 6) % 4); if (id === 63 && bounceT[i] != null) id = 64 + Math.min(3, Math.floor(bounceT[i] / 5));
          const sx = (id % 8) * 32, sy = Math.floor(id / 8) * 32;
          if (lay.flip[i]) { ctx.save(); ctx.translate(c * 32 + 32, r * 32); ctx.scale(-1, 1); ctx.drawImage(img.tiles, sx, sy, 32, 32, 0, 0, 32, 32); ctx.restore(); }
          else ctx.drawImage(img.tiles, sx, sy, 32, 32, c * 32, r * 32, 32, 32); } };
      const resetBosses = () => {
        if (ELD && !ELD.dead) { Object.assign(ELD, { x: ELD.sx, hp: ELD.max, st: 'wait', t: 0, awake: false, hurt: 0 }); gates[0].st = 'open'; SEEDS.length = 0; }
        if (BOSS && !BOSS.dead) Object.assign(BOSS, { hp: BOSS.max, state: 'idle', t: 0, awake: false, spots: [], roots: [] });
      };
      const damage = (e, dmg) => { e.hp -= dmg; e.hurt = 14; if (e.hp <= 0) { e.dead = 1; if (e.kind === 'spore') fx('fx_spore_burst', 4, 12, e.x + 8, e.y + 10, 16); } };

      const step = () => {
        tick++;
        if (tick === 1) story('l1_start');
        const HR = ROSTER[H.hero], PW = EH_POWER[HR.el];
        // ---- hero input ----
        if (H.dead) {
          H.dead++;
          if (H.dead === 60) {
            if (activeCP) { Object.assign(H, { x: activeCP.x, y: GROUND_Y - 31, vx: 0, vy: 0, hp: 4, dead: 0, inv: 90, hurtT: 0, attackT: 0 }); safe = { x: H.x, y: H.y };
              const RH = ROSTER[H.hero]; if (RH.kid) fx(`h_${RH.id}_respawn`, 6, 10, H.x, H.y, 32); else fx('rs_' + RH.el, 6, 10, H.x, H.y, 32); resetBosses(); }
            else onEnd('over');
          }
        } else {
          const L1 = keys.ArrowLeft || keys.KeyA, R1 = keys.ArrowRight || keys.KeyD;
          if (H.hurtT <= 0) { H.vx = (R1 ? 1.8 : 0) - (L1 ? 1.8 : 0); if (H.vx) H.face = Math.sign(H.vx); if (H.attackT > 0 && H.ground) H.vx *= 0.3; }
          if (jumpBuf > 0) jumpBuf--;
          if ((keys.Space || keys.ArrowUp || keys.KeyW || jumpBuf > 0) && H.ground && H.hurtT <= 0) { jumpBuf = 0; H.vy = -8.3; H.ground = false; fx('fx_dust_jump', 4, 16, H.x, H.y + 31 - 16, 32); }
          if ((keys.KeyJ || keys.KeyF || keys.KeyX) && H.attackT <= 0 && H.hurtT <= 0) { H.attackT = 24; H.fired = false; }
          if (cycle) { wantHero = (H.hero + cycle + ROSTER.length) % ROSTER.length; cycle = 0; }
          if (wantHero >= 0 && wantHero < ROSTER.length && wantHero !== H.hero) { H.hero = wantHero; H.swapT = 40; H.attackT = 0; fx('i_' + ROSTER[wantHero].el, 4, 12, H.x, H.y, 32); }
          wantHero = -1;
        }
        if (H.attackT > 0) { H.attackT--; if (!H.fired && H.attackT <= 12) { H.fired = true;
          B.push({ x: H.x + (H.face > 0 ? 26 : -10), y: H.y + (HR.kid ? 14 : 10), vx: PW.v * H.face, vy: PW.arc ? -3.2 : 0, t: 0, el: HR.el, who: HR.id, dmg: PW.dmg, arc: !!PW.arc, pierce: !!PW.pierce, hit: new Set() }); } }
        if (H.hurtT > 0) H.hurtT--; if (H.inv > 0) H.inv--; if (H.landT > 0) H.landT--; if (H.swapT > 0) H.swapT--;
        // ---- hero physics ----
        if (!H.dead) {
          H.vy = Math.min(7, H.vy + 0.35);
          const nx = H.x + H.vx; const edge = H.vx > 0 ? nx + 22 : nx + 10;
          if (!(EH_SOLID.has(tileAt(edge, H.y + 14)) || EH_SOLID.has(tileAt(edge, H.y + 24)))) H.x = Math.min(LW - 20, Math.max(-8, nx));
          for (const g of gates) if (g.st !== 'open') { const hb = heroBox(); if (hb.x < g.x + 32 && hb.x + hb.w > g.x) H.x = H.x + 16 < g.x + 16 ? g.x - 22 : g.x + 32 - 10; }
          if (BOSS && !BOSS.dead) { H.x = Math.min(H.x, bossBody().x - 26); if (BOSS.awake) H.x = Math.max(H.x, finalL - 4); }
          const prevFeet = H.y + 31; let ny = H.y + H.vy; let feet = ny + 31; let best = null;
          if (H.vy >= 0) for (const px of [H.x + 12, H.x + 16, H.x + 20]) for (let ty = Math.floor((prevFeet - 8) / 32); ty <= Math.floor((feet + (H.ground ? 6 : 0)) / 32); ty++) {
            const s = surface(px, ty); if (s == null) continue; const id = tileAt(px, ty * 32);
            const okTop = EH_PLAT.has(id) ? prevFeet <= s + 1 : s >= prevFeet - 8;
            if (okTop && s <= feet + (H.ground ? 6 : 0) && (best == null || s < best)) best = s;
          }
          if (best != null) { if (!H.ground && H.vy > 3) { H.landT = 8; fx('fx_dust_land', 4, 16, H.x, best - 16, 32); } H.y = best - 31; H.vy = 0; H.ground = true;
            const under = tileAt(H.x + 16, H.y + 33); if (EH_SOLID.has(under) && under !== 30 && under < 63 && !EH_HAZ.has(tileAt(H.x + 16, H.y + 16))) safe = { x: H.x, y: H.y };
            const row = Math.floor((H.y + 33) / 32) * MW;
            for (const px of [H.x + 12, H.x + 16, H.x + 20]) { const i = row + Math.floor(px / 32), id = ground[i];
              // bounce mushroom: the tileset says 2x jump velocity, which would fly off the top of the 360px view, so it's ~1.45x (about 6 tiles)
              if (id >= 63 && id <= 67) { H.vy = -12; H.ground = false; bounceT[i] = 0; fx('fx_dust_jump', 4, 16, H.x, H.y + 15, 32); break; }
              if (id >= 56 && id <= 58 && crumble[i] == null) crumble[i] = 0; } }
          else { H.y = ny; H.ground = false; }
          if (H.vy < 0 && EH_SOLID.has(tileAt(H.x + 16, H.y + 8))) { H.vy = 0; }
          // hazards / water / exit
          // spikes/brambles (26-28) only hurt what lands on or walks into them (feet level, not while rising);
          // hanging thorns (29) and fire-jet flames (36) hurt on any touch
          const feetHaz = tileAt(H.x + 16, H.y + 30), bodyHaz = [tileAt(H.x + 16, H.y + 16), tileAt(H.x + 16, H.y + 26)];
          if ((H.vy >= 0 && feetHaz >= 26 && feetHaz <= 28) || bodyHaz.some(t => t === 29 || t === 36)) hurt(H.face);
          const tw = tileAt(H.x + 16, H.y + 28);
          if (tw === 31 || tw === 32) { fx('fx_splash_water', 5, 14, H.x, GROUND_Y - 32, 32); H.inv = 0; hurt(1); if (!H.dead) Object.assign(H, safe, { vx: 0, vy: 0, inv: 70 }); }
          if (H.y > 380) { H.hp = 0; H.dead = 1; }
          if (ex && (!BOSS || BOSS.dead > 70) && overlap(heroBox(), { x: ex.x + 15, y: ex.y + 20, w: 34, h: 75 })) onEnd('complete', H.coins, { gems: GM.filter(g => g.got).length, gemTotal: GM.length });
        }
        // ---- pickups / checkpoints ----
        const near = (o, w = 16) => Math.abs(H.x + 16 - (o.x + w / 2)) < 14 && Math.abs(H.y + 20 - (o.y + 8)) < 18;
        if (!H.dead) {
          C.forEach(c => { if (!c.got && near(c)) { c.got = true; H.coins++; fx('fx_coin', 4, 14, c.x, c.y, 16); } });
          GM.forEach(g => { if (!g.got && near(g)) { g.got = true; H.coins += 5; fx('fx_heart', 5, 14, g.x - 8, g.y - 8, 32); } });
          HP.forEach(h => { if (!h.got && H.hp < 4 && near(h)) { h.got = true; H.hp = 4; fx('fx_heart', 5, 14, h.x - 8, h.y - 8, 32); } });
          CP.forEach(c => { if (c.st === 'idle' && overlap(heroBox(), { x: c.x, y: c.y, w: 32, h: 64 })) { c.st = 'activate'; c.t = 0; activeCP = c; } });
          ST.forEach(s => { if (s.wakeT < 0 && overlap(heroBox(), { x: s.x + 6, y: s.y + 4, w: 20, h: 28 })) s.wakeT = 0; });
        }
        CP.forEach(c => { c.t++; if (c.st === 'activate' && c.t >= 36) c.st = 'lit'; });
        // fx_statue_awaken: 6 frames at 10fps; the knight replaces the statue on frame 3 and joins when it ends
        ST.forEach(s => { if (s.wakeT < 0 || s.woke) return; if (++s.wakeT >= 36) { s.woke = true;
          ROSTER.push({ id: 'k_' + s.el, el: s.el, name: EH_KNIGHTS[s.el], kid: false }); fx('i_' + s.el, 4, 12, s.x, s.y, 32);
          say(`${EH_KNIGHTS[s.el].toUpperCase()} JOINED · Q / E TO SWITCH`); story('l1_knight_' + s.el); } });
        if (PUP) {
          PUP.t++;
          const isOwner = ROSTER[H.hero].id === PUP.owner;
          if (PUP.st === 'wait') { if (!H.dead && Math.abs(H.x - PUP.x) < 48 && Math.abs(H.y - PUP.y) < 40) {
              if (isOwner) { PUP.st = 'follow'; story('l1_puppy'); } else if (!PUP.hinted) { PUP.hinted = true; say(`THE PUPPY WAITS FOR ${PUP.ownerName} · PRESS ${PUP.ownerKey}`); } } }
          else if (!isOwner && PUP.st !== 'gone') {   // not the owner: run off the left edge of the screen
            PUP.st = 'away'; PUP.barkT = 0; PUP.face = -1; PUP.anim = 'run'; PUP.x -= 3.2; PUP.y += (H.y - PUP.y) * 0.1;
            if (PUP.x < cam - 48) PUP.st = 'gone';
          }
          else if (!isOwner) { /* gone: off screen until the owner is back */ }
          else {
            if (PUP.st === 'gone') { PUP.x = cam - 40; PUP.y = H.y; }   // owner is back: run in from the left
            PUP.st = 'follow';
            const tx = H.x - 18 * H.face, dx = tx - PUP.x, far = Math.abs(dx) > 700 || Math.abs(H.y - PUP.y) > 200;
            if (far) { PUP.x = tx; PUP.y = H.y; }
            const sp = Math.abs(dx) > 80 ? 3.6 : 2.4; PUP.x += Math.max(-sp, Math.min(sp, dx * 0.12)); PUP.y += (H.y - PUP.y) * 0.18;
            if (Math.abs(dx) > 2) PUP.face = Math.sign(dx);
            PUP.anim = Math.abs(H.y - PUP.y) > 6 || !H.ground ? 'jump' : Math.abs(dx) > 6 ? 'run' : 'idle';
            if (PUP.barkT > 0) { if (++PUP.barkT > 24) PUP.barkT = 0; if (PUP.barkT === 18) GM.forEach(g => { if (!g.got && Math.hypot(g.x - PUP.x, g.y - PUP.y) < 140) fx('fx_heart', 5, 14, g.x - 8, g.y - 8, 32); }); }
            else if (--PUP.cool <= 0 && GM.some(g => !g.got && Math.hypot(g.x - PUP.x, g.y - PUP.y) < 140)) { PUP.barkT = 1; PUP.cool = 240; }
          }
        }
        if (BALL) {   // Easter egg: a football the cousins can kick around
          if (overlap(heroBox(), { x: BALL.x + 2, y: BALL.y + 2, w: 12, h: 12 }) && Math.abs(BALL.vx) < 3.5) { BALL.vx = 4.2 * (Math.sign(BALL.x + 8 - H.x - 16) || H.face); BALL.vy = -3.2; }
          BALL.vy = Math.min(7, BALL.vy + 0.35); const nx = BALL.x + BALL.vx, ahead = BALL.vx > 0 ? nx + 16 : nx;
          if (EH_SOLID.has(tileAt(ahead, BALL.y + 8))) BALL.vx *= -0.5; else BALL.x = nx;
          const ty = Math.floor((BALL.y + 16 + BALL.vy) / 32), s2 = BALL.vy >= 0 ? surface(BALL.x + 8, ty) : null;
          if (s2 != null && BALL.y + 16 + BALL.vy >= s2) { BALL.y = s2 - 16; BALL.vy = Math.abs(BALL.vy) > 2 ? -BALL.vy * 0.4 : 0; BALL.vx *= 0.97; } else BALL.y += BALL.vy;
          if (BALL.x < 0 || BALL.x > LW - 16) { BALL.x = Math.max(0, Math.min(LW - 16, BALL.x)); BALL.vx *= -0.5; }
          BALL.roll += BALL.vx; if (Math.abs(BALL.vx) < 0.05) BALL.vx = 0;
          if (BALL.y > 380 || tileAt(BALL.x + 8, BALL.y + 12) === 31) Object.assign(BALL, { x: BALL.sx, y: BALL.sy, vx: 0, vy: 0 });
        }
        // ---- enemies ----
        E.forEach(e => {
          if (e.dead) { e.dead++; if (e.kind === 'moth') e.y += 1.2; return; }
          if (e.hurt > 0) { e.hurt--; if (e.kind !== 'moth') return; }
          const dx = H.x + 16 - (e.kind === 'moth' ? e.x : e.x + 16);
          if (e.kind === 'rot') { e.x += 0.45 * e.dir; if (e.x < e.x0 || e.x > e.x1) e.dir *= -1; }
          else if (e.kind === 'moth') {
            e.t++; if (e.cd > 0) e.cd--;
            if (e.st === 'fly') {
              e.bx += 0.67 * e.dir; if (e.bx < e.x0 || e.bx > e.x1) e.dir *= -1;
              e.x = e.bx; e.y = e.by + 18 * Math.sin(e.t * 2 * Math.PI / 144);
              if (!H.dead && e.cd <= 0 && Math.abs(dx) < 64 && H.y + 16 > e.y + 8) { e.st = 'dive'; e.t = 0; e.tx = H.x + 16; e.ty = H.y + 16; e.dir = Math.sign(dx) || e.dir; }
            } else if (e.st === 'dive') {
              if (e.t > 12) { const ddx = e.tx - e.x, ddy = e.ty - e.y, d = Math.hypot(ddx, ddy); if (d < 3 || e.y > GROUND_Y - 12 || e.t > 60) e.st = 'climb'; else { e.x += ddx / d * 3; e.y += ddy / d * 3; } }
            } else { const ddx = e.bx - e.x, ddy = e.by - e.y, d = Math.hypot(ddx, ddy); if (d < 2) { e.st = 'fly'; e.cd = 90; e.t = 0; } else { e.x += ddx / d * 1.2; e.y += ddy / d * 1.2; e.dir = Math.sign(ddx) || e.dir; } }
          } else if (e.kind === 'spore') {
            e.dir = Math.sign(dx) || e.dir;
            if (e.st === 'idle') { if (e.cd > 0) e.cd--; else if (Math.abs(dx) < 200 && !H.dead) { e.st = 'attack'; e.t = 0; } }
            else { e.t++; if (e.t === 12) SPORES.push({ x: e.x + 8, y: e.y - 2, vx: 1.5 * e.dir, vy: -3.67, t: 0 }); if (e.t >= 36) { e.st = 'idle'; e.cd = 96; } }
          }
          if (!H.dead && overlap(heroBox(), ebox(e))) hurt(Math.sign(-dx) || 1);
        });
        for (let i = SPORES.length - 1; i >= 0; i--) { const s = SPORES[i]; s.vy += 0.167; s.x += s.vx; s.y += s.vy; s.t++;
          let gone = EH_SOLID.has(tileAt(s.x + 8, s.y + 12)) || s.y > 380;
          if (!gone && !H.dead && overlap(heroBox(), { x: s.x + 4, y: s.y + 4, w: 8, h: 8 })) { hurt(Math.sign(s.vx) || 1); gone = true; }
          if (gone) { fx('fx_spore_burst', 4, 12, s.x, s.y, 16); SPORES.splice(i, 1); } }
        // ---- thorn gates ----
        gates.forEach(g => { g.t++; if (g.st === 'opening' && g.t >= 36) g.st = 'open'; if (g.st === 'closing' && g.t >= 36) g.st = 'closed'; });
        // ---- Elder Rotroot ----
        if (ELD) {
          if (ELD.dead) ELD.dead++;
          else {
            if (!ELD.awake && H.x + 10 > arenaL + 8 && H.x < arenaR) { story('l1_elder'); ELD.awake = true; ELD.st = 'wander'; ELD.t = 0; if (gates[0]) { gates[0].st = 'closing'; gates[0].t = 0; } }
            if (ELD.hurt > 0) ELD.hurt--;
            if (ELD.awake && !H.dead) {
              ELD.t++;
              const enr = ELD.hp <= ELD.max / 2, hold = enr ? 12 : 24, dxE = H.x + 16 - (ELD.x + 32);
              if (ELD.st === 'wander') { ELD.dir = Math.sign(dxE) || ELD.dir; if (Math.abs(dxE) > 20) ELD.x += 0.8 * ELD.dir; if (ELD.t >= 90) { ELD.st = 'tell'; ELD.t = 0; ELD.next = ELD.n++ % 2 ? 'throw' : 'charge'; } }
              else if (ELD.st === 'tell') { ELD.dir = Math.sign(dxE) || ELD.dir; if (ELD.t >= 30 + hold) { ELD.st = ELD.next; ELD.t = 0; } }
              else if (ELD.st === 'charge') { ELD.x += 3 * ELD.dir; if (ELD.x <= arenaL || ELD.x + 64 >= arenaR) { ELD.st = 'rest'; ELD.t = 0; } }
              else if (ELD.st === 'rest') { if (ELD.t >= 36) { ELD.st = 'wander'; ELD.t = 0; } }
              else if (ELD.st === 'throw') {
                if (ELD.t === 12) { const cnt = enr ? 5 : 3, x0 = ELD.x + (ELD.dir > 0 ? 52 : 12) - 8, y0 = ELD.y + 18 - 8, vy0 = -4.5, g = 0.25, dy = GROUND_Y - 16 - y0, T = (-vy0 + Math.sqrt(vy0 * vy0 + 2 * g * dy)) / g;
                  for (let i = 0; i < cnt; i++) { const tx = H.x + 16 + (i - (cnt - 1) / 2) * 40 - 8; SEEDS.push({ x: x0, y: y0, vx: (tx - x0) / T, vy: vy0, t: 0 }); } }
                if (ELD.t >= 30) { ELD.st = 'wander'; ELD.t = 0; }
              }
              ELD.x = Math.max(arenaL, Math.min(arenaR - 64, ELD.x));
              if (overlap(heroBox(), elderBox())) hurt(Math.sign(ELD.x + 32 - H.x - 16) || 1);
            }
          }
        }
        for (let i = SEEDS.length - 1; i >= 0; i--) { const s = SEEDS[i]; s.vy = Math.min(7, s.vy + 0.25); s.x += s.vx; s.y += s.vy; s.t++;
          let gone = s.y + 14 >= GROUND_Y;
          if (!gone && !H.dead && overlap(heroBox(), { x: s.x + 3, y: s.y + 3, w: 10, h: 10 })) { hurt(Math.sign(s.vx) || 1); gone = true; }
          if (gone) { fx('fx_seed_impact', 4, 12, s.x, Math.min(s.y, GROUND_Y - 16), 16); SEEDS.splice(i, 1); } }
        // ---- Blightwarden ----
        if (BOSS) {
          if (BOSS.dead) BOSS.dead++;
          else {
            if (!BOSS.awake && H.x > LW - 600) { story('l1_blight'); BOSS.awake = true; BOSS.t = 60; }
            if (BOSS.hurt > 0) BOSS.hurt--;
            if (BOSS.awake && !H.dead) {
              BOSS.t++;
              const enraged = BOSS.hp <= BOSS.max / 2, aL = LW - 630, aR = bossBody().x - 20;
              if (BOSS.state === 'idle' && BOSS.t > (enraged ? 100 : 150)) {
                // alternate: README pattern (spots 40px apart starting 24px in front) / spots aimed at the hero
                const cnt = enraged ? 5 : 3; BOSS.spots = [];
                if (BOSS.n++ % 2 === 0) for (let i = 0; i < cnt; i++) BOSS.spots.push(bossBody().x - 24 - 16 - i * 40);
                else for (let i = 0; i < cnt; i++) BOSS.spots.push(H.x + 16 + (i - (cnt - 1) / 2) * 40);
                BOSS.spots = BOSS.spots.map(s => Math.max(aL, Math.min(aR, s)));
                BOSS.state = 'telegraph'; BOSS.t = 0;
              } else if (BOSS.state === 'telegraph' && BOSS.t >= 60) { BOSS.state = 'attack'; BOSS.t = 0; }
              else if (BOSS.state === 'attack') {
                if (BOSS.t === 6) { BOSS.roots = BOSS.spots.map(s => ({ x: s, t: 0 })); BOSS.spots = []; }
                if (BOSS.t >= 36) { BOSS.state = 'idle'; BOSS.t = 0; }
              }
              if (overlap(heroBox(), bossBody())) hurt(1);
            }
          }
          BOSS.roots.forEach(r => { r.t++; const f = Math.floor(r.t / 5);
            if ((f === 2 || f === 3) && !H.dead && overlap(heroBox(), { x: r.x - 16 + 6, y: 224 + 14, w: 20, h: 50 })) hurt(Math.sign(r.x - H.x - 16) || 1); });
          BOSS.roots = BOSS.roots.filter(r => r.t < 30);
        }
        // ---- hero projectiles ----
        for (let i = B.length - 1; i >= 0; i--) { const b = B[i]; b.x += b.vx; b.t++;
          if (b.arc) { b.vy = Math.min(6, b.vy + 0.2); b.y += b.vy; }
          let hit = EH_SOLID.has(tileAt(b.x + 8, b.y + 8)) || b.x < cam - 16 || b.x > cam + 656 || b.y > 380, wall = hit;
          for (const g of gates) if (g.st !== 'open' && b.x + 12 > g.x && b.x + 4 < g.x + 32) { hit = wall = true; }
          const pb = { x: b.x + 3, y: b.y + 3, w: 10, h: 10 };
          const spark = () => fx('fx_hit_spark', 3, 18, b.x, b.y, 16);
          for (const e of E) { if (hit) break; if (!e.dead && !b.hit.has(e) && overlap(pb, ebox(e))) { b.hit.add(e); damage(e, b.dmg); spark(); if (!b.pierce) hit = true; } }
          if (ELD && ELD.awake && !ELD.dead && !hit && overlap(pb, elderBox())) { ELD.hp -= b.dmg; ELD.hurt = 10; spark(); hit = true;
            if (ELD.hp <= 0) { ELD.dead = 1; SEEDS.length = 0; gates.forEach(g => { if (g.st !== 'open') { g.st = 'opening'; g.t = 0; } }); } }
          if (BOSS && !BOSS.dead && !hit && overlap(pb, bossBody())) {
            BOSS.hp -= b.dmg * (overlap(pb, bossWeak()) ? 2 : 1); BOSS.hurt = 10; BOSS.awake = true; spark();
            if (BOSS.hp <= 0 && b.who !== EH_STAR) { BOSS.hp = 1; if (!BOSS.callStar) { BOSS.callStar = true; say('PRESS 4 · DIMITRIJE FINISHES IT'); story('l1_finish'); } }
            if (BOSS.hp <= 0) { BOSS.dead = 1; BOSS.spots = []; BOSS.roots = []; }
            hit = true; }
          if (hit) { if (wall) fx('i_' + b.el, 4, 12, b.x - 8, b.y - 8, 32); B.splice(i, 1); } }
        for (let i = X.length - 1; i >= 0; i--) if (++X[i].t >= X[i].n * X[i].d) X.splice(i, 1);
        // crumble planks: 450ms after being stepped on they crack, break and fall away, then grow back after 3s
        for (const k in crumble) { const t = ++crumble[k]; ground[k] = t < 27 ? 56 : t < 36 ? 57 : t < 45 ? 58 : t < 225 ? 59 : 56; if (t >= 225) delete crumble[k]; }
        for (const k in bounceT) if (++bounceT[k] >= 20) delete bounceT[k];
        if (toast && ++toast.t > 240) toast = null;
        const hud = H.hp + ':' + H.coins + ':' + H.hero; if (hud !== lastHud) { lastHud = hud; const CH = ROSTER[H.hero]; onHud({ hp: H.hp, coins: H.coins, element: CH.el, name: CH.name }); }
      };

      const draw = () => {
        const eldFight = ELD && ELD.awake && !ELD.dead, bwFight = BOSS && BOSS.awake && !BOSS.dead;
        const camT = eldFight ? gates[0].x : bwFight ? finalL : Math.max(0, Math.min(LW - 640, H.x + 16 - 280));
        camF = Math.abs(camT - camF) < 0.5 ? camT : camF + (camT - camF) * 0.12; cam = Math.round(camF);
        // how much of the view is inside a boss arena -> blend in the arena backdrop + foreground branches
        const ov = (a, b) => Math.max(0, Math.min(cam + 640, b) - Math.max(cam, a)) / 640;
        const arenaW = Math.min(1, (gates.length ? ov(gates[0].x, gates[1].x + 32) : 0) + ov(finalL, LW));
        const par = { sky: 0, far: 0.1, mid: 0.25, near: 0.45 };
        const bg = (k, p) => { const o = Math.round(((cam * p) % 640 + 640) % 640); ctx.drawImage(img[k], -o, 0); ctx.drawImage(img[k], 640 - o, 0); };
        for (const k of ['sky','far','mid','near']) bg(k, par[k]);
        if (arenaW > 0 && img.arena_near) { ctx.globalAlpha = arenaW; bg('arena_near', par.near); ctx.globalAlpha = 1; }
        ctx.save(); ctx.translate(-cam, 0);
        drawLayer(DBL); drawLayer(GL); drawLayer(DL);
        CP.forEach(c => { if (c.st === 'idle') drawStrip(img.cp_idle, 1, 0, c.x, c.y, 32); else if (c.st === 'activate') drawStrip(img.cp_activate, 6, c.t / 6, c.x, c.y, 32); else drawStrip(img.cp_lit, 4, (tick / 7.5) % 4, c.x, c.y, 32); });
        if (ex) drawStrip(img.arch, 4, (tick / 7.5) % 4, ex.x, ex.y, 64);
        if (poster) drawStrip(img.poster, 1, 0, poster.x, poster.y, 32);
        ST.forEach(s => { if (s.woke) return; const f = s.wakeT < 0 ? -1 : Math.floor(s.wakeT / 6);
          if (f < 3) drawStrip(img['st_' + s.el], 1, 0, s.x, s.y, 32); else drawStrip(img[`h_k_${s.el}_idle`], 4, 0, s.x, s.y, 32);
          if (f >= 0) drawStrip(img.st_awaken, 6, f, s.x, s.y, 32); });
        if (PUP && PUP.st !== 'gone') { if (PUP.st === 'wait') drawStrip(img.yarn, 6, (tick / 6) % 6, PUP.x + 20, PUP.y + 15, 16);
          const a = PUP.barkT > 0 ? 'special' : PUP.anim, n = { idle: 4, run: 6, jump: 2, special: 4 }[a], f = a === 'special' ? PUP.barkT / 6 : a === 'jump' ? (PUP.y < H.y ? 1 : 0) : (tick / (a === 'run' ? 5 : 12)) % n;
          drawStrip(img['pup_' + a], n, f, PUP.x, PUP.y, 32, PUP.face < 0); }
        if (BALL) drawStrip(img.ball, 4, Math.floor(Math.abs(BALL.roll) / 6) % 4, BALL.x, BALL.y, 16);
        C.forEach((c, i) => { if (!c.got) drawStrip(img.coin, 6, (tick / 6.7 + i * 2) % 6, c.x, c.y + Math.round(Math.sin(tick / 20 + i) * 1.5), 16); });
        GM.forEach((g, i) => { if (!g.got) drawStrip(img.gem, 6, (tick / 7.5 + i) % 6, g.x, g.y, 16); });
        HP.forEach((h, i) => { if (!h.got) drawStrip(img.heart, 6, (tick / 7.5 + i) % 6, h.x, h.y, 16); });
        E.forEach(e => {
          if (e.dead > 40) return;
          if (e.kind === 'rot') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : 'move'; const f = e.dead ? e.dead / 8 : e.hurt ? (14 - e.hurt) / 7 : (tick / 8) % 6; drawStrip(img['r_' + a], EH_ROT[a], f, e.x, e.y, 32, e.dir < 0); }
          else if (e.kind === 'moth') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.st === 'dive' ? 'attack' : 'fly'; const f = e.dead ? e.dead / 7.5 : e.hurt ? (14 - e.hurt) / 7 : a === 'attack' ? Math.min(3, e.t / 6) : (tick / 6) % 4; drawStrip(img['m_' + a], EH_MOTH[a], f, e.x - 16, e.y - 16, 32, e.dir < 0); }
          else { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.st === 'attack' ? 'attack' : 'idle'; const f = e.dead ? e.dead / 7.5 : e.hurt ? (14 - e.hurt) / 7 : a === 'attack' ? e.t / 6 : (tick / 10) % 4; drawStrip(img['s_' + a], EH_SPORE[a], f, e.x, e.y, 32, e.dir < 0); }
        });
        SPORES.forEach(s => drawStrip(img.spore, 4, (s.t / 6) % 4, s.x, s.y, 16));
        gates.forEach(g => { if (g.st === 'closed') drawStrip(img.gate_closed, 1, 0, g.x, g.y, 32); else if (g.st === 'opening') drawStrip(img.gate_opening, 6, g.t / 6, g.x, g.y, 32); else if (g.st === 'closing') drawStrip(img.gate_opening, 6, 5 - g.t / 6, g.x, g.y, 32); else drawStrip(img.gate_opening, 6, 5, g.x, g.y, 32); });
        if (ELD && ELD.dead < 400) {
          let a, f;
          if (ELD.dead) { a = 'death'; f = ELD.dead / 7.5; }
          else if (ELD.st === 'tell') { a = 'tell'; f = ELD.t / 10; }
          else if (ELD.st === 'charge') { a = 'charge'; f = (tick / 5) % 4; }
          else if (ELD.st === 'throw') { a = 'throw'; f = ELD.t / 6; }
          else if (ELD.hurt > 0) { a = 'hurt'; f = ELD.hurt > 5 ? 0 : 1; }
          else if (ELD.st === 'wander') { a = 'move'; f = (tick / 7.5) % 6; }
          else { a = 'idle'; f = (tick / 12) % 4; }
          drawStrip(img['e_' + a], EH_ELDER[a], f, ELD.x, ELD.y, 64, ELD.dir < 0);
        }
        SEEDS.forEach(s => drawStrip(img.seed, 4, (s.t / 5) % 4, s.x, s.y, 16, s.vx < 0));
        if (BOSS) {
          BOSS.spots.forEach(s => drawStrip(img.warn, 4, (tick / 7.5) % 4, s - 16, 256, 32));
          let a, f;
          if (BOSS.dead) { a = 'death'; f = BOSS.dead / 7.5; }
          else if (BOSS.state === 'telegraph') { a = 'telegraph'; f = (BOSS.t / 7.5) % 4; }
          else if (BOSS.state === 'attack') { a = 'attack'; f = BOSS.t / 6; }
          else if (BOSS.hurt > 0) { a = 'hurt'; f = BOSS.hurt > 5 ? 0 : 1; }
          else { a = 'idle'; f = (tick / 12) % 4; }
          drawStrip(img['b_' + a], EH_BOSS[a], f, BOSS.x, BOSS.y, 96, true);
          BOSS.roots.forEach(r => drawStrip(img.roots, 6, r.t / 5, r.x - 16, 224, 32));
        }
        const CUR = ROSTER[H.hero], hkey = CUR.kid ? CUR.id : 'k_' + CUR.el;
        let a, f;
        if (H.dead) { a = 'death'; f = H.dead / 8; }
        else if (H.hurtT > 0) { a = 'hurt'; f = H.hurtT > 8 ? 0 : 1; }
        else if (H.attackT > 0) { a = 'attack'; f = (24 - H.attackT) / 4; }
        else if (!H.ground) { a = H.vy < 0 ? 'jump' : 'fall'; f = (tick / 8) % 2; }
        else if (H.landT > 0) { a = 'land'; f = H.landT > 4 ? 0 : 1; }
        else if (Math.abs(H.vx) > 0.1) { a = 'run'; f = (tick / 5) % 8; }
        else { a = 'idle'; f = (tick / 10) % 4; }
        if (!(H.inv > 0 && !H.dead && H.hurtT <= 0 && Math.floor(tick / 3) % 2)) drawStrip(img[`h_${hkey}_${a}`], EH_HERO[a], f, H.x, H.y, 32, H.face < 0);
        B.forEach(b => drawStrip(img['p_' + b.el], 4, (b.t / 4) % 4, b.x, b.y, 16, b.vx < 0));
        X.forEach(x => drawStrip(img[x.k], x.n, x.t / x.d, x.x, x.y, x.w));
        if (FGL) { const hb = heroBox(); let over = false;
          for (let r = Math.floor(hb.y / 32); r <= Math.floor((hb.y + hb.h) / 32) && !over; r++) for (let c = Math.floor(hb.x / 32); c <= Math.floor((hb.x + hb.w) / 32); c++)
            if (r >= 0 && r < MH && c >= 0 && c < MW && FGL.id[r * MW + c] >= 0) { over = true; break; }
          fgA += ((over ? 0.35 : 1) - fgA) * 0.15; ctx.globalAlpha = fgA; drawLayer(FGL); ctx.globalAlpha = 1; }
        ctx.restore();
        if (arenaW > 0 && img.fg) { ctx.globalAlpha = arenaW; const o = Math.round(((cam * 1.2) % 640 + 640) % 640); ctx.drawImage(img.fg, -o, 0); ctx.drawImage(img.fg, 640 - o, 0); ctx.globalAlpha = 1; }
        if (toast) { ctx.font = '8px Silkscreen, monospace'; ctx.textAlign = 'center'; const w = ctx.measureText(toast.text).width + 16;
          ctx.fillStyle = '#0d0b14'; ctx.fillRect(320 - w / 2 - 1, 63, w + 2, 16); ctx.fillStyle = '#2a2233'; ctx.fillRect(320 - w / 2, 64, w, 14); ctx.fillStyle = '#ffc23d'; ctx.fillText(toast.text, 320, 74); }
        if (H.swapT > 0) { ctx.font = '8px Silkscreen, monospace'; ctx.textAlign = 'center'; const nm = CUR.name.toUpperCase(), sx = Math.round(H.x - cam + 16), sy = Math.round(H.y - 6);
          ctx.fillStyle = '#0d0b14'; ctx.fillText(nm, sx + 1, sy + 1); ctx.fillStyle = '#ffc23d'; ctx.fillText(nm, sx, sy); }
        // boss bar (ui_bossbar_frame: fill area x 20, y 4, w 184, h 8)
        const bb = eldFight || (ELD && ELD.dead && ELD.dead < 40) ? ELD : BOSS && BOSS.awake && BOSS.dead < 40 ? BOSS : null;
        if (bb && img.bar_frame) {
          const fx0 = 320 - 104, fy0 = 34, fw = Math.round(184 * Math.max(0, bb.hp) / bb.max);
          ctx.drawImage(img.bar_frame, fx0, fy0);
          for (let x = 0; x < fw; x += 8) ctx.drawImage(img.bar_fill, 0, 0, Math.min(8, fw - x), 8, fx0 + 20 + x, fy0 + 4, Math.min(8, fw - x), 8);
          if (bb.hurt > 0) { ctx.fillStyle = 'rgba(232,224,208,0.6)'; ctx.fillRect(fx0 + 20, fy0 + 4, fw, 8); }
          ctx.font = '8px Silkscreen, monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#0d0b14'; ctx.fillText(bb.name, 321, fy0 - 3); ctx.fillStyle = '#e8e0d0'; ctx.fillText(bb.name, 320, fy0 - 4);
        }
      };
      const loop = () => { if (!alive) return; if (!pausedRef.current) step(); draw(); raf = requestAnimationFrame(loop); };
      loop();
    })();
    return () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, [runId]);
  return <canvas ref={cv} width={640} height={360} style={{ width: '100%', height: '100%', imageRendering: 'pixelated', display: 'block' }} />;
}
window.GameView = GameView;

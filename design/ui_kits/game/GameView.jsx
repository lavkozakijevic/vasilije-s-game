// Forest level runtime: tile map from Tiled .tmj, parallax, 8 switchable heroes, Rotroots, Blightwarden boss. Renders at 640x360.
const EHA = '../../../assets/';
const EH_SOLID = new Set([0,1,2,3,4,7,8,9,10,11,12,13,14,15,16,17,18,24,25,30]);
const EH_PLAT = new Set([19,20,21,22,23]);
const EH_HAZ = new Set([26,27,28,29,36]);
const EH_HERO = { idle:4, run:8, jump:2, fall:2, land:2, attack:6, hurt:2, death:6 };
const EH_ROT = { idle:4, move:6, attack:4, hurt:2, death:5 };
const EH_BOSS = { idle:4, telegraph:4, attack:6, hurt:2, death:8 };
// Hero order = number keys 1-8. Projectile stats are placeholders for tuning:
// v = speed (px/tick), dmg = damage, arc = lobbed with gravity, pierce = passes through enemies.
const EH_HEROES = [
  { el: 'fire',      name: 'Cinder', v: 4.2, dmg: 1 },
  { el: 'water',     name: 'Brine',  v: 3.6, dmg: 1 },
  { el: 'earth',     name: 'Basalt', v: 3.4, dmg: 2, arc: true },
  { el: 'air',       name: 'Wisp',   v: 5.2, dmg: 1, pierce: true },
  { el: 'ice',       name: 'Rime',   v: 4.8, dmg: 1 },
  { el: 'lightning', name: 'Jolt',   v: 6.5, dmg: 1 },
  { el: 'shadow',    name: 'Umbra',  v: 3.2, dmg: 2 },
  { el: 'light',     name: 'Aurel',  v: 5.6, dmg: 1, pierce: true },
];
function ehImg(src){ return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }); }

function GameView({ paused, runId, onHud, onEnd }) {
  const cv = React.useRef(null);
  const pausedRef = React.useRef(paused);
  pausedRef.current = paused;
  React.useEffect(() => {
    let alive = true, raf = 0;
    const keys = {}; let wantHero = -1;
    const kd = e => { keys[e.code] = true; const d = /^Digit([1-8])$/.exec(e.code); if (d) wantHero = +d[1] - 1; if (['Space','ArrowUp','ArrowDown'].includes(e.code)) e.preventDefault(); };
    const ku = e => { keys[e.code] = false; };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    (async () => {
      const map = await (await fetch(EHA + 'maps/forest_mock.tmj')).json();
      const L = n => map.layers.find(l => l.name === n).data.map(g => g - 1);
      const ground = L('ground'), decorB = L('decor_back'), decor = L('decor');
      const img = { tiles: await ehImg(EHA + 'tilesets/forest/tileset_forest.png'), coin: await ehImg(EHA + 'sprites/items/item_coin_spin.png'), heart: await ehImg(EHA + 'ui/ui_heart_states.png') };
      for (const k of ['sky','far','mid','near']) img[k] = await ehImg(EHA + `backgrounds/forest/bg_forest_${k}.png`);
      for (const h of EH_HEROES) {
        const d = EHA + `sprites/heroes/${h.el}/`;
        for (const k in EH_HERO) img[`h_${h.el}_${k}`] = await ehImg(d + `hero_${h.el}_${k}.png`);
        img[`p_${h.el}`] = await ehImg(d + `fx_${h.el}_projectile.png`);
        img[`i_${h.el}`] = await ehImg(d + `fx_${h.el}_impact.png`);
      }
      for (const k in EH_ROT) img['r_' + k] = await ehImg(EHA + `sprites/enemies/forest/enemy_rotroot_${k}.png`);
      const BD = EHA + 'sprites/bosses/forest/blightwarden/';
      for (const k in EH_BOSS) img['b_' + k] = await ehImg(BD + `boss_blightwarden_${k}.png`);
      img.warn = await ehImg(BD + 'fx_blightwarden_warning.png'); img.roots = await ehImg(BD + 'fx_blightwarden_roots.png');
      if (!alive) return;
      const ctx = cv.current.getContext('2d'); ctx.imageSmoothingEnabled = false;
      const MW = map.width, MH = map.height, LW = MW * 32; let cam = 0, camF = 0;
      const tileAt = (px, py) => { const tx = Math.floor(px / 32), ty = Math.floor(py / 32); if (tx < 0 || tx >= MW || ty < 0 || ty >= MH) return -1; return ground[ty * MW + tx]; };
      const surface = (px, ty) => { const tx = Math.floor(px / 32); if (tx < 0 || tx >= MW || ty < 0 || ty >= MH) return null; const id = ground[ty * MW + tx], xx = px - tx * 32;
        if (EH_SOLID.has(id)) return ty * 32; if (id === 5) return ty * 32 + 31 - xx; if (id === 6) return ty * 32 + xx; if (EH_PLAT.has(id)) return ty * 32 + 1; return null; };
      const ents = map.layers.find(l => l.name === 'entities').objects;
      const sp = ents.find(o => o.name === 'player_spawn');
      const spawn = { x: sp ? sp.x : 64, y: sp ? sp.y : 257 }; let safe = { ...spawn };
      const H = { ...spawn, vx: 0, vy: 0, face: 1, ground: true, attackT: 0, hurtT: 0, inv: 0, landT: 0, dead: 0, hp: 4, coins: 0, fired: false, hero: 0, swapT: 0 };
      const E = ents.filter(o => o.type === 'enemy_rotroot').map(o => ({ x: o.x, y: o.y, x0: o.x - 48, x1: o.x + 40, dir: -1, hp: 2, hurt: 0, dead: 0 }));
      const C = ents.filter(o => o.type === 'item_coin').map(o => ({ x: o.x, y: o.y, got: false }));
      const HP = ents.filter(o => o.type === 'item_heart').map(o => ({ x: o.x, y: o.y, got: false }));
      const B = [], X = [];
      // Blightwarden: stationary, faces left. Root Slam per its README: telegraph ~1s with ground
      // warnings, slam on attack frame 1, roots hurt on their frames 2-3, then a 2.5s cooldown.
      const bo = ents.find(o => o.type === 'boss_blightwarden');
      const BOSS = bo ? { x: bo.x, y: bo.y, hp: 24, max: 24, state: 'idle', t: 0, n: 0, hurt: 0, dead: 0, awake: false, spots: [], roots: [] } : null;
      const bossBody = () => ({ x: BOSS.x + 28, y: BOSS.y + 22, w: 42, h: 72 });   // mirrored hitbox (facing left)
      const bossWeak = () => ({ x: BOSS.x + 36, y: BOSS.y + 34, w: 26, h: 14 });
      const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
      let tick = 0, lastHud = '';
      const hurt = dir => { if (H.inv > 0 || H.dead) return; H.hp -= 0.5; H.hurtT = 16; H.inv = 70; H.vx = -2 * dir; H.vy = -3; H.ground = false; if (H.hp <= 0) { H.dead = 1; H.vx = 0; } };
      const drawStrip = (im, n, f, x, y, w, flip) => { if (!im) return; f = Math.max(0, Math.min(n - 1, f)); ctx.save(); ctx.translate(Math.round(x) + (flip ? w : 0), Math.round(y)); ctx.scale(flip ? -1 : 1, 1); ctx.drawImage(im, f * w, 0, w, im.height, 0, 0, w, im.height); ctx.restore(); };
      const drawLayer = arr => { const c0 = Math.max(0, Math.floor(cam / 32)), c1 = Math.min(MW, c0 + 22);
        for (let r = 0; r < MH; r++) for (let c = c0; c < c1; c++) { let id = arr[r * MW + c]; if (id < 0) continue; if (id === 32) id = 32 + (Math.floor(tick / 10) % 4); if (id === 36) id = 36 + (Math.floor(tick / 6) % 4);
          ctx.drawImage(img.tiles, (id % 8) * 32, Math.floor(id / 8) * 32, 32, 32, c * 32, r * 32, 32, 32); } };
      const heroBox = () => ({ x: H.x + 10, y: H.y + 8, w: 12, h: 23 });
      const step = () => {
        tick++;
        const HR = EH_HEROES[H.hero];
        // hero input
        if (H.dead) { H.dead++; if (H.dead === 60) onEnd('over'); }
        else {
          const L1 = keys.ArrowLeft || keys.KeyA, R1 = keys.ArrowRight || keys.KeyD;
          if (H.hurtT <= 0) { H.vx = (R1 ? 1.8 : 0) - (L1 ? 1.8 : 0); if (H.vx) H.face = Math.sign(H.vx); if (H.attackT > 0 && H.ground) H.vx *= 0.3; }
          if ((keys.Space || keys.ArrowUp || keys.KeyW) && H.ground && H.hurtT <= 0) { H.vy = -8.3; H.ground = false; }
          if ((keys.KeyJ || keys.KeyF || keys.KeyX) && H.attackT <= 0 && H.hurtT <= 0) { H.attackT = 24; H.fired = false; }
          if (wantHero >= 0 && wantHero !== H.hero) { const i = wantHero; H.hero = i; H.swapT = 40; H.attackT = 0; X.push({ x: H.x, y: H.y, t: 0, el: EH_HEROES[i].el }); }
          wantHero = -1;
        }
        if (H.attackT > 0) { H.attackT--; if (!H.fired && H.attackT <= 12) { H.fired = true;
          B.push({ x: H.x + (H.face > 0 ? 26 : -10), y: H.y + 10, vx: HR.v * H.face, vy: HR.arc ? -3.2 : 0, t: 0, el: HR.el, dmg: HR.dmg, arc: !!HR.arc, pierce: !!HR.pierce, hit: new Set() }); } }
        if (H.hurtT > 0) H.hurtT--; if (H.inv > 0) H.inv--; if (H.landT > 0) H.landT--; if (H.swapT > 0) H.swapT--;
        // physics
        H.vy = Math.min(7, H.vy + 0.35);
        const nx = H.x + H.vx; const edge = H.vx > 0 ? nx + 22 : nx + 10;
        if (!(EH_SOLID.has(tileAt(edge, H.y + 14)) || EH_SOLID.has(tileAt(edge, H.y + 24)))) H.x = Math.min(LW - 20, Math.max(-8, nx));
        if (BOSS && !BOSS.dead) { H.x = Math.min(H.x, bossBody().x - 26); if (BOSS.awake) H.x = Math.max(H.x, LW - 640 - 4); }   // arena lock
        const prevFeet = H.y + 31; let ny = H.y + H.vy; let feet = ny + 31; let best = null;
        if (H.vy >= 0) for (const px of [H.x + 12, H.x + 16, H.x + 20]) for (let ty = Math.floor((prevFeet - 8) / 32); ty <= Math.floor((feet + (H.ground ? 6 : 0)) / 32); ty++) {
          const s = surface(px, ty); if (s == null) continue; const id = tileAt(px, ty * 32);
          const okTop = EH_PLAT.has(id) ? prevFeet <= s + 1 : s >= prevFeet - 8;
          if (okTop && s <= feet + (H.ground ? 6 : 0) && (best == null || s < best)) best = s;
        }
        if (best != null) { if (!H.ground && H.vy > 3) H.landT = 8; H.y = best - 31; H.vy = 0; H.ground = true;
          const under = tileAt(H.x + 16, H.y + 33); if (EH_SOLID.has(under) && under !== 30 && !EH_HAZ.has(tileAt(H.x + 16, H.y + 16))) safe = { x: H.x, y: H.y }; }
        else { H.y = ny; H.ground = false; }
        if (H.vy < 0 && EH_SOLID.has(tileAt(H.x + 16, H.y + 8))) { H.vy = 0; }
        // hazards / water / exits
        if (!H.dead) {
          if (EH_HAZ.has(tileAt(H.x + 16, H.y + 26)) || EH_HAZ.has(tileAt(H.x + 16, H.y + 16))) hurt(H.face);
          const tw = tileAt(H.x + 16, H.y + 28); if (tw === 31 || tw === 32) { H.inv = 0; hurt(1); if (!H.dead) Object.assign(H, safe, { vx: 0, vy: 0, inv: 70 }); }
          if (H.x > LW - 28 && (!BOSS || BOSS.dead > 70)) onEnd('complete', H.coins);
          if (H.y > 380) { H.hp = 0; H.dead = 1; }
        }
        // pickups (a heart refills all hearts; it stays put while you're at full health)
        C.forEach(c => { if (!c.got && Math.abs(H.x + 16 - (c.x + 8)) < 14 && Math.abs(H.y + 20 - (c.y + 8)) < 18) { c.got = true; H.coins++; } });
        HP.forEach(h => { if (!h.got && !H.dead && H.hp < 4 && Math.abs(H.x + 16 - (h.x + 8)) < 14 && Math.abs(H.y + 20 - (h.y + 8)) < 18) { h.got = true; H.hp = 4; X.push({ x: h.x - 8, y: h.y - 8, t: 0, el: 'light' }); } });
        // enemies
        E.forEach(e => {
          if (e.dead) { e.dead++; return; }
          if (e.hurt > 0) { e.hurt--; return; }
          e.x += 0.45 * e.dir; if (e.x < e.x0 || e.x > e.x1) e.dir *= -1;
          if (!H.dead && Math.abs(H.x + 16 - (e.x + 16)) < 14 && Math.abs(H.y - e.y) < 22) hurt(Math.sign(e.x - H.x) || 1);
        });
        // boss
        if (BOSS) {
          if (BOSS.dead) BOSS.dead++;
          else {
            if (!BOSS.awake && H.x > LW - 600) { BOSS.awake = true; BOSS.t = 60; }
            if (BOSS.hurt > 0) BOSS.hurt--;
            if (BOSS.awake && !H.dead) {
              BOSS.t++;
              const enraged = BOSS.hp <= BOSS.max / 2, arenaL = LW - 630, arenaR = bossBody().x - 20;
              if (BOSS.state === 'idle' && BOSS.t > (enraged ? 100 : 150)) {
                // alternate: README pattern (spots 40px apart starting 24px in front) / spots aimed at the hero
                const cnt = enraged ? 5 : 3; BOSS.spots = [];
                if (BOSS.n++ % 2 === 0) for (let i = 0; i < cnt; i++) BOSS.spots.push(bossBody().x - 24 - 16 - i * 40);
                else for (let i = 0; i < cnt; i++) BOSS.spots.push(H.x + 16 + (i - (cnt - 1) / 2) * 40);
                BOSS.spots = BOSS.spots.map(s => Math.max(arenaL, Math.min(arenaR, s)));
                BOSS.state = 'telegraph'; BOSS.t = 0;
              } else if (BOSS.state === 'telegraph' && BOSS.t >= 60) { BOSS.state = 'attack'; BOSS.t = 0; }
              else if (BOSS.state === 'attack') {
                if (BOSS.t === 6) { BOSS.roots = BOSS.spots.map(s => ({ x: s, t: 0 })); BOSS.spots = []; }
                if (BOSS.t >= 36) { BOSS.state = 'idle'; BOSS.t = 0; }
              }
              if (!H.dead && overlap(heroBox(), bossBody())) hurt(1);
            }
          }
          BOSS.roots.forEach(r => { r.t++; const f = Math.floor(r.t / 5);
            if ((f === 2 || f === 3) && !H.dead && overlap(heroBox(), { x: r.x - 16 + 6, y: 224 + 14, w: 20, h: 50 })) hurt(Math.sign(r.x - H.x - 16) || 1); });
          BOSS.roots = BOSS.roots.filter(r => r.t < 30);
        }
        // projectiles
        for (let i = B.length - 1; i >= 0; i--) { const b = B[i]; b.x += b.vx; b.t++;
          if (b.arc) { b.vy = Math.min(6, b.vy + 0.2); b.y += b.vy; }
          let hit = EH_SOLID.has(tileAt(b.x + 8, b.y + 8)) || b.x < cam - 16 || b.x > cam + 656 || b.y > 380;
          const pb = { x: b.x + 3, y: b.y + 3, w: 10, h: 10 };
          E.forEach(e => { if (!e.dead && !hit && !b.hit.has(e) && overlap(pb, { x: e.x + 9, y: e.y + 12, w: 14, h: 20 })) { b.hit.add(e); e.hp -= b.dmg; e.hurt = 14; if (e.hp <= 0) e.dead = 1; if (b.pierce) X.push({ x: b.x - 8, y: b.y - 8, t: 0, el: b.el }); else hit = true; } });
          if (BOSS && !BOSS.dead && !hit && overlap(pb, bossBody())) {
            BOSS.hp -= b.dmg * (overlap(pb, bossWeak()) ? 2 : 1); BOSS.hurt = 10; BOSS.awake = true;
            if (BOSS.hp <= 0) { BOSS.dead = 1; BOSS.spots = []; BOSS.roots = []; }
            hit = true; }
          if (hit) { X.push({ x: b.x - 8, y: b.y - 8, t: 0, el: b.el }); B.splice(i, 1); } }
        for (let i = X.length - 1; i >= 0; i--) if (++X[i].t > 20) X.splice(i, 1);
        const hud = H.hp + ':' + H.coins + ':' + H.hero; if (hud !== lastHud) { lastHud = hud; const CH = EH_HEROES[H.hero]; onHud({ hp: H.hp, coins: H.coins, element: CH.el, name: CH.name }); }
      };
      const draw = () => {
        const par = { sky: 0, far: 0.1, mid: 0.25, near: 0.45 };
        const camT = BOSS && BOSS.awake && !BOSS.dead ? LW - 640 : Math.max(0, Math.min(LW - 640, H.x + 16 - 280));
        camF = Math.abs(camT - camF) < 0.5 ? camT : camF + (camT - camF) * 0.12; cam = Math.round(camF);
        for (const k of ['sky','far','mid','near']) { const o = Math.round(((cam * par[k]) % 640 + 640) % 640); ctx.drawImage(img[k], -o, 0); ctx.drawImage(img[k], 640 - o, 0); }
        ctx.save(); ctx.translate(-cam, 0);
        drawLayer(decorB); drawLayer(ground); drawLayer(decor);
        C.forEach((c, i) => { if (!c.got) ctx.drawImage(img.coin, (Math.floor(tick / 7 + i * 2) % 6) * 16, 0, 16, 16, c.x, c.y + Math.round(Math.sin(tick / 20 + i) * 1.5), 16, 16); });
        HP.forEach((h, i) => { if (!h.got) ctx.drawImage(img.heart, 0, 0, 16, 16, h.x, h.y + Math.round(Math.sin(tick / 14 + i) * 2), 16, 16); });
        E.forEach(e => { if (e.dead > 40) return; const a = e.dead ? 'death' : e.hurt ? 'hurt' : 'move'; const f = e.dead ? Math.floor(e.dead / 8) : e.hurt ? Math.floor((14 - e.hurt) / 7) : Math.floor(tick / 8) % 6; drawStrip(img['r_' + a], EH_ROT[a], f, e.x, e.y, 32, e.dir < 0); });
        if (BOSS) {
          BOSS.spots.forEach(s => drawStrip(img.warn, 4, Math.floor(tick / 7.5) % 4, s - 16, 256, 32, false));
          let a, f;
          if (BOSS.dead) { a = 'death'; f = Math.floor(BOSS.dead / 7.5); }
          else if (BOSS.state === 'telegraph') { a = 'telegraph'; f = Math.floor(BOSS.t / 7.5) % 4; }
          else if (BOSS.state === 'attack') { a = 'attack'; f = Math.floor(BOSS.t / 6); }
          else if (BOSS.hurt > 0) { a = 'hurt'; f = BOSS.hurt > 5 ? 0 : 1; }
          else { a = 'idle'; f = Math.floor(tick / 12) % 4; }
          drawStrip(img['b_' + a], EH_BOSS[a], f, BOSS.x, BOSS.y, 96, true);
          BOSS.roots.forEach(r => drawStrip(img.roots, 6, Math.floor(r.t / 5), r.x - 16, 224, 32, false));
        }
        const hel = EH_HEROES[H.hero].el;
        let a, f;
        if (H.dead) { a = 'death'; f = Math.floor(H.dead / 8); }
        else if (H.hurtT > 0) { a = 'hurt'; f = H.hurtT > 8 ? 0 : 1; }
        else if (H.attackT > 0) { a = 'attack'; f = Math.floor((24 - H.attackT) / 4); }
        else if (!H.ground) { a = H.vy < 0 ? 'jump' : 'fall'; f = Math.floor(tick / 8) % 2; }
        else if (H.landT > 0) { a = 'land'; f = H.landT > 4 ? 0 : 1; }
        else if (Math.abs(H.vx) > 0.1) { a = 'run'; f = Math.floor(tick / 5) % 8; }
        else { a = 'idle'; f = Math.floor(tick / 10) % 4; }
        if (!(H.inv > 0 && !H.dead && H.hurtT <= 0 && Math.floor(tick / 3) % 2)) drawStrip(img[`h_${hel}_${a}`], EH_HERO[a], f, H.x, H.y, 32, H.face < 0);
        B.forEach(b => drawStrip(img['p_' + b.el], 4, Math.floor(b.t / 4) % 4, b.x, b.y, 16, b.vx < 0));
        X.forEach(x => drawStrip(img['i_' + x.el], 4, Math.floor(x.t / 5), x.x, x.y, 32, false));
        ctx.restore();
        if (H.swapT > 0) { ctx.font = '8px Silkscreen, monospace'; ctx.textAlign = 'center'; const nm = EH_HEROES[H.hero].name.toUpperCase(), sx = Math.round(H.x - cam + 16), sy = Math.round(H.y - 6);
          ctx.fillStyle = '#0d0b14'; ctx.fillText(nm, sx + 1, sy + 1); ctx.fillStyle = '#ffc23d'; ctx.fillText(nm, sx, sy); }
        if (BOSS && BOSS.awake && BOSS.dead < 40) {
          const bw = 200, bx = 320 - bw / 2, by = 40, fill = Math.round(bw * Math.max(0, BOSS.hp) / BOSS.max);
          ctx.fillStyle = '#0d0b14'; ctx.fillRect(bx - 2, by - 2, bw + 4, 12);
          ctx.fillStyle = '#2a2233'; ctx.fillRect(bx, by, bw, 8);
          ctx.fillStyle = BOSS.hurt ? '#e8e0d0' : '#e0521f'; ctx.fillRect(bx, by, fill, 8);
          ctx.fillStyle = '#ffc23d'; ctx.fillRect(bx, by, fill, 2);
          ctx.font = '8px Silkscreen, monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#0d0b14'; ctx.fillText('BLIGHTWARDEN', 321, by - 5); ctx.fillStyle = '#e8e0d0'; ctx.fillText('BLIGHTWARDEN', 320, by - 6);
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

// Forest level runtime: tile map from Tiled .tmj, parallax, hero/enemy sprites. Renders at 640x360.
const EHA = '../../assets/';
const EH_SOLID = new Set([0,1,2,3,4,7,8,9,10,11,12,13,14,15,16,17,18,24,25,30]);
const EH_PLAT = new Set([19,20,21,22,23]);
const EH_HAZ = new Set([26,27,28,29,36]);
const EH_HERO = { idle:4, run:8, jump:2, fall:2, land:2, attack:6, hurt:2, death:6 };
const EH_ROT = { idle:4, move:6, attack:4, hurt:2, death:5 };
function ehImg(src){ return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; }); }

function GameView({ paused, runId, onHud, onEnd }) {
  const cv = React.useRef(null);
  const pausedRef = React.useRef(paused);
  pausedRef.current = paused;
  React.useEffect(() => {
    let alive = true, raf = 0;
    const keys = {};
    const kd = e => { keys[e.code] = true; if (['Space','ArrowUp','ArrowDown'].includes(e.code)) e.preventDefault(); };
    const ku = e => { keys[e.code] = false; };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    (async () => {
      const map = await (await fetch(EHA + 'maps/forest_mock.tmj')).json();
      const L = n => map.layers.find(l => l.name === n).data.map(g => g - 1);
      const ground = L('ground'), decorB = L('decor_back'), decor = L('decor');
      const img = { tiles: await ehImg(EHA + 'tilesets/forest/tileset_forest.png'), coin: await ehImg(EHA + 'sprites/items/item_coin_spin.png'), ball: await ehImg(EHA + 'sprites/fx/fx_fire_projectile.png'), boom: await ehImg(EHA + 'sprites/fx/fx_fire_impact.png') };
      for (const k of ['sky','far','mid','near']) img[k] = await ehImg(EHA + `backgrounds/forest/bg_forest_${k}.png`);
      for (const k in EH_HERO) img['h_' + k] = await ehImg(EHA + `sprites/heroes/fire/hero_fire_${k}.png`);
      for (const k in EH_ROT) img['r_' + k] = await ehImg(EHA + `sprites/enemies/forest/enemy_rotroot_${k}.png`);
      if (!alive) return;
      const ctx = cv.current.getContext('2d'); ctx.imageSmoothingEnabled = false;
      const tileAt = (px, py) => { const tx = Math.floor(px / 32), ty = Math.floor(py / 32); if (tx < 0 || tx >= 20 || ty < 0 || ty >= 12) return -1; return ground[ty * 20 + tx]; };
      const surface = (px, ty) => { const tx = Math.floor(px / 32); if (tx < 0 || tx >= 20 || ty < 0 || ty >= 12) return null; const id = ground[ty * 20 + tx], xx = px - tx * 32;
        if (EH_SOLID.has(id)) return ty * 32; if (id === 5) return ty * 32 + 31 - xx; if (id === 6) return ty * 32 + xx; if (EH_PLAT.has(id)) return ty * 32 + 1; return null; };
      const spawn = { x: 64, y: 257 };
      const H = { ...spawn, vx: 0, vy: 0, face: 1, ground: true, attackT: 0, hurtT: 0, inv: 0, landT: 0, dead: 0, hp: 4, coins: 0, fired: false };
      const E = map.layers.find(l => l.name === 'entities').objects.filter(o => o.type === 'enemy_rotroot').map(o => ({ x: o.x, y: o.y, x0: o.x - 48, x1: o.x + 40, dir: -1, hp: 2, hurt: 0, dead: 0, atk: 0 }));
      const C = [0,1,2].map(i => ({ x: 104 + i * 32, y: 138, got: false }));
      const B = [], X = [];
      let tick = 0, lastHud = '';
      const hurt = dir => { if (H.inv > 0 || H.dead) return; H.hp -= 0.5; H.hurtT = 16; H.inv = 70; H.vx = -2 * dir; H.vy = -3; H.ground = false; if (H.hp <= 0) { H.dead = 1; H.vx = 0; } };
      const drawStrip = (im, n, f, x, y, w, flip) => { f = Math.min(n - 1, f); ctx.save(); if (flip) { ctx.translate(Math.round(x) + w, Math.round(y)); ctx.scale(-1, 1); ctx.drawImage(im, f * w, 0, w, im.height, 0, 0, w, im.height); } else ctx.drawImage(im, f * w, 0, w, im.height, Math.round(x), Math.round(y), w, im.height); ctx.restore(); };
      const drawLayer = arr => arr.forEach((id, i) => { if (id < 0) return; if (id === 32) id = 32 + (Math.floor(tick / 10) % 4); if (id === 36) id = 36 + (Math.floor(tick / 6) % 4); ctx.drawImage(img.tiles, (id % 8) * 32, Math.floor(id / 8) * 32, 32, 32, (i % 20) * 32, Math.floor(i / 20) * 32, 32, 32); });
      const step = () => {
        tick++;
        // hero input
        if (H.dead) { H.dead++; if (H.dead === 60) onEnd('over'); }
        else {
          const L1 = keys.ArrowLeft || keys.KeyA, R1 = keys.ArrowRight || keys.KeyD;
          if (H.hurtT <= 0) { H.vx = (R1 ? 1.8 : 0) - (L1 ? 1.8 : 0); if (H.vx) H.face = Math.sign(H.vx); if (H.attackT > 0 && H.ground) H.vx *= 0.3; }
          if ((keys.Space || keys.ArrowUp || keys.KeyW) && H.ground && H.hurtT <= 0) { H.vy = -8.3; H.ground = false; }
          if ((keys.KeyJ || keys.KeyF || keys.KeyX) && H.attackT <= 0 && H.hurtT <= 0) { H.attackT = 24; H.fired = false; }
        }
        if (H.attackT > 0) { H.attackT--; if (!H.fired && H.attackT <= 12) { H.fired = true; B.push({ x: H.x + (H.face > 0 ? 26 : -10), y: H.y + 10, vx: 4.2 * H.face, t: 0 }); } }
        if (H.hurtT > 0) H.hurtT--; if (H.inv > 0) H.inv--; if (H.landT > 0) H.landT--;
        // physics
        H.vy = Math.min(7, H.vy + 0.35);
        const nx = H.x + H.vx; const edge = H.vx > 0 ? nx + 22 : nx + 10;
        if (!(EH_SOLID.has(tileAt(edge, H.y + 14)) || EH_SOLID.has(tileAt(edge, H.y + 24)))) H.x = Math.max(-8, nx);
        const prevFeet = H.y + 31; let ny = H.y + H.vy; let feet = ny + 31; let best = null;
        if (H.vy >= 0) for (const px of [H.x + 12, H.x + 16, H.x + 20]) for (let ty = Math.floor((prevFeet - 8) / 32); ty <= Math.floor((feet + (H.ground ? 6 : 0)) / 32); ty++) {
          const s = surface(px, ty); if (s == null) continue; const id = tileAt(px, ty * 32);
          const okTop = EH_PLAT.has(id) ? prevFeet <= s + 1 : s >= prevFeet - 8;
          if (okTop && s <= feet + (H.ground ? 6 : 0) && (best == null || s < best)) best = s;
        }
        if (best != null) { if (!H.ground && H.vy > 3) H.landT = 8; H.y = best - 31; H.vy = 0; H.ground = true; } else { H.y = ny; H.ground = false; }
        if (H.vy < 0 && EH_SOLID.has(tileAt(H.x + 16, H.y + 8))) { H.vy = 0; }
        // hazards / water / exits
        if (!H.dead) {
          if (EH_HAZ.has(tileAt(H.x + 16, H.y + 26)) || EH_HAZ.has(tileAt(H.x + 16, H.y + 16))) hurt(H.face);
          const tw = tileAt(H.x + 16, H.y + 28); if (tw === 31 || tw === 32) { H.inv = 0; hurt(1); if (!H.dead) Object.assign(H, spawn, { vx: 0, vy: 0 }); }
          if (H.x > 612) onEnd('complete', H.coins);
          if (H.y > 380) { H.hp = 0; H.dead = 1; }
        }
        // coins
        C.forEach(c => { if (!c.got && Math.abs(H.x + 16 - (c.x + 8)) < 14 && Math.abs(H.y + 20 - (c.y + 8)) < 18) { c.got = true; H.coins++; } });
        // enemies
        E.forEach(e => {
          if (e.dead) { e.dead++; return; }
          if (e.hurt > 0) { e.hurt--; return; }
          e.x += 0.45 * e.dir; if (e.x < e.x0 || e.x > e.x1) e.dir *= -1;
          if (!H.dead && Math.abs(H.x + 16 - (e.x + 16)) < 14 && Math.abs(H.y - e.y) < 22) hurt(Math.sign(e.x - H.x) || 1);
        });
        // fireballs
        for (let i = B.length - 1; i >= 0; i--) { const b = B[i]; b.x += b.vx; b.t++;
          let hit = EH_SOLID.has(tileAt(b.x + 8, b.y + 8)) || b.x < -16 || b.x > 656;
          E.forEach(e => { if (!e.dead && !hit && b.x + 12 > e.x + 9 && b.x + 4 < e.x + 23 && b.y + 8 > e.y + 12) { hit = true; e.hp--; e.hurt = 14; if (e.hp <= 0) e.dead = 1; } });
          if (hit) { X.push({ x: b.x - 8, y: b.y - 8, t: 0 }); B.splice(i, 1); } }
        for (let i = X.length - 1; i >= 0; i--) if (++X[i].t > 20) X.splice(i, 1);
        const hud = H.hp + ':' + H.coins; if (hud !== lastHud) { lastHud = hud; onHud({ hp: H.hp, coins: H.coins }); }
      };
      const draw = () => {
        const par = { sky: 0, far: 0.1, mid: 0.25, near: 0.45 };
        for (const k of ['sky','far','mid','near']) { const o = Math.round(((H.x * par[k]) % 640 + 640) % 640); ctx.drawImage(img[k], -o, 0); ctx.drawImage(img[k], 640 - o, 0); }
        drawLayer(decorB); drawLayer(ground); drawLayer(decor);
        C.forEach((c, i) => { if (!c.got) ctx.drawImage(img.coin, (Math.floor(tick / 7 + i * 2) % 6) * 16, 0, 16, 16, c.x, c.y + Math.round(Math.sin(tick / 20 + i) * 1.5), 16, 16); });
        E.forEach(e => { if (e.dead > 40) return; const a = e.dead ? 'death' : e.hurt ? 'hurt' : 'move'; const f = e.dead ? Math.floor(e.dead / 8) : e.hurt ? Math.floor((14 - e.hurt) / 7) : Math.floor(tick / 8) % 6; drawStrip(img['r_' + a], EH_ROT[a], f, e.x, e.y, 32, e.dir < 0); });
        let a, f;
        if (H.dead) { a = 'death'; f = Math.floor(H.dead / 8); }
        else if (H.hurtT > 0) { a = 'hurt'; f = H.hurtT > 8 ? 0 : 1; }
        else if (H.attackT > 0) { a = 'attack'; f = Math.floor((24 - H.attackT) / 4); }
        else if (!H.ground) { a = H.vy < 0 ? 'jump' : 'fall'; f = Math.floor(tick / 8) % 2; }
        else if (H.landT > 0) { a = 'land'; f = H.landT > 4 ? 0 : 1; }
        else if (Math.abs(H.vx) > 0.1) { a = 'run'; f = Math.floor(tick / 5) % 8; }
        else { a = 'idle'; f = Math.floor(tick / 10) % 4; }
        if (!(H.inv > 0 && !H.dead && H.hurtT <= 0 && Math.floor(tick / 3) % 2)) drawStrip(img['h_' + a], EH_HERO[a], f, H.x, H.y, 32, H.face < 0);
        B.forEach(b => drawStrip(img.ball, 4, Math.floor(b.t / 4) % 4, b.x, b.y, 16, b.vx < 0));
        X.forEach(x => drawStrip(img.boom, 4, Math.floor(x.t / 5), x.x, x.y, 32, false));
      };
      const loop = () => { if (!alive) return; if (!pausedRef.current) step(); draw(); raf = requestAnimationFrame(loop); };
      loop();
    })();
    return () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, [runId]);
  return <canvas ref={cv} width={640} height={360} style={{ width: '100%', height: '100%', imageRendering: 'pixelated', display: 'block' }} />;
}
window.GameView = GameView;

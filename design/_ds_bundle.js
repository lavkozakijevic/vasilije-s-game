/* @ds-bundle: {"format":4,"namespace":"ElementalHeroesDesignSystem_0f20c7","components":[{"name":"CoinCounter","sourcePath":"components/hud/CoinCounter.jsx"},{"name":"ElementBadge","sourcePath":"components/hud/ElementBadge.jsx"},{"name":"HeartMeter","sourcePath":"components/hud/HeartMeter.jsx"},{"name":"Sprite","sourcePath":"components/hud/Sprite.jsx"},{"name":"PixelButton","sourcePath":"components/menu/PixelButton.jsx"},{"name":"PixelPanel","sourcePath":"components/menu/PixelPanel.jsx"}],"sourceHashes":{"components/hud/CoinCounter.jsx":"671f6baf64c6","components/hud/ElementBadge.jsx":"37b2a1f4e6d7","components/hud/HeartMeter.jsx":"d4665296c0bd","components/hud/Sprite.jsx":"26092bfddf96","components/menu/PixelButton.jsx":"09b08ad4aede","components/menu/PixelPanel.jsx":"f1d6dc0d8181","guidelines/sheet.js":"ba709e3466ea","ui_kits/game/GameView.jsx":"75ac7ef40217","ui_kits/game/Screens.jsx":"9c49b46f32d7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ElementalHeroesDesignSystem_0f20c7 = window.ElementalHeroesDesignSystem_0f20c7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/hud/CoinCounter.jsx
try { (() => {
function CoinCounter({
  count = 0,
  digits = 3,
  scale = 3,
  src = 'assets/sprites/items/item_coin_spin.png',
  spin = true
}) {
  const [f, setF] = React.useState(0);
  React.useEffect(() => {
    if (!spin) return;
    const id = setInterval(() => setF(p => (p + 1) % 6), 110);
    return () => clearInterval(id);
  }, [spin]);
  const s = scale;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: s * 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 16 * s,
      height: 16 * s,
      backgroundImage: `url(${src})`,
      backgroundSize: `${96 * s}px ${16 * s}px`,
      backgroundPosition: `${-f * 16 * s}px 0`,
      imageRendering: 'pixelated'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 8 * s,
      lineHeight: 1,
      color: 'var(--text-primary)',
      textShadow: `${-s}px 0 0 var(--eh-ink),${s}px 0 0 var(--eh-ink),0 ${-s}px 0 var(--eh-ink),0 ${s}px 0 var(--eh-ink)`
    }
  }, "\xD7", String(count).padStart(digits, '0')));
}
Object.assign(__ds_scope, { CoinCounter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/hud/CoinCounter.jsx", error: String((e && e.message) || e) }); }

// components/hud/ElementBadge.jsx
try { (() => {
const ACCENT = {
  fire: 'var(--element-fire)',
  water: 'var(--element-water)',
  earth: 'var(--element-earth)',
  air: 'var(--element-air)',
  ice: 'var(--element-ice)',
  lightning: 'var(--element-lightning)',
  shadow: 'var(--element-shadow)',
  light: 'var(--element-light)'
};
function ElementBadge({
  element = 'fire',
  icon,
  scale = 3,
  active = true,
  label
}) {
  const s = scale;
  const src = icon || `assets/ui/icon_element_${element}.png`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: s * 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30 * s,
      height: 30 * s,
      background: 'var(--surface-panel)',
      display: 'grid',
      placeItems: 'center',
      boxShadow: `inset ${s}px ${s}px 0 0 var(--bevel-light), inset ${-s}px ${-s}px 0 0 var(--bevel-dark), 0 0 0 ${s}px var(--eh-ink)${active ? `, 0 0 0 ${2 * s}px ${ACCENT[element]}, 0 0 0 ${3 * s}px var(--eh-ink)` : ''}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24 * s,
      height: 24 * s,
      background: 'var(--surface-panel-inset)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: element,
    style: {
      width: 16 * s,
      height: 16 * s,
      imageRendering: 'pixelated',
      opacity: active ? 1 : 0.35
    }
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 8 * s / 1.5,
      color: ACCENT[element],
      textTransform: 'uppercase'
    }
  }, label));
}
Object.assign(__ds_scope, { ElementBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/hud/ElementBadge.jsx", error: String((e && e.message) || e) }); }

// components/hud/HeartMeter.jsx
try { (() => {
function HeartMeter({
  value = 3,
  max = 4,
  scale = 3,
  src = 'assets/ui/ui_heart_states.png'
}) {
  const hearts = [];
  for (let i = 0; i < max; i++) {
    const s = value >= i + 1 ? 0 : value >= i + 0.5 ? 1 : 2;
    hearts.push(/*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 16 * scale,
        height: 16 * scale,
        backgroundImage: `url(${src})`,
        backgroundSize: `${48 * scale}px ${16 * scale}px`,
        backgroundPosition: `${-s * 16 * scale}px 0`,
        imageRendering: 'pixelated'
      }
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    role: "meter",
    "aria-valuenow": value,
    "aria-valuemax": max,
    style: {
      display: 'flex',
      gap: 2 * scale
    }
  }, hearts);
}
Object.assign(__ds_scope, { HeartMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/hud/HeartMeter.jsx", error: String((e && e.message) || e) }); }

// components/hud/Sprite.jsx
try { (() => {
function Sprite({
  src,
  frames = 1,
  frameWidth = 32,
  frameHeight = 32,
  scale = 3,
  fps = 10,
  loop = true,
  flip = false,
  playing = true,
  frame,
  style
}) {
  const [f, setF] = React.useState(0);
  React.useEffect(() => {
    if (!playing || frames < 2 || frame != null) return;
    const id = setInterval(() => setF(p => p + 1 >= frames ? loop ? 0 : p : p + 1), 1000 / fps);
    return () => clearInterval(id);
  }, [playing, frames, fps, loop, frame]);
  const cur = frame != null ? frame : f;
  return /*#__PURE__*/React.createElement("div", {
    role: "img",
    style: {
      width: frameWidth * scale,
      height: frameHeight * scale,
      backgroundImage: `url(${src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${frameWidth * frames * scale}px ${frameHeight * scale}px`,
      backgroundPosition: `${-cur * frameWidth * scale}px 0`,
      imageRendering: 'pixelated',
      transform: flip ? 'scaleX(-1)' : undefined,
      flexShrink: 0,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Sprite });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/hud/Sprite.jsx", error: String((e && e.message) || e) }); }

// components/menu/PixelButton.jsx
try { (() => {
function PixelButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  selected = false,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const px = 3;
  const pal = {
    primary: {
      bg: 'var(--eh-flame)',
      hi: 'var(--eh-gold)',
      lo: 'var(--eh-ember)',
      fg: 'var(--eh-bone)'
    },
    secondary: {
      bg: 'var(--eh-slate)',
      hi: 'var(--eh-stone)',
      lo: 'var(--eh-plum)',
      fg: 'var(--eh-bone)'
    },
    ghost: {
      bg: 'transparent',
      hi: 'transparent',
      lo: 'transparent',
      fg: 'var(--eh-bone)'
    }
  }[variant];
  const fs = {
    sm: 16,
    md: 24,
    lg: 32
  }[size];
  const pad = {
    sm: '6px 12px',
    md: '9px 21px',
    lg: '12px 30px'
  }[size];
  const pressed = down && !disabled;
  const lit = (hover || selected) && !disabled;
  const bg = disabled ? 'var(--eh-plum)' : lit && variant !== 'ghost' ? pal.hi : pal.bg;
  const bevel = variant === 'ghost' || disabled ? '' : pressed ? `inset ${px}px ${px}px 0 0 ${pal.lo}` : `inset ${px}px ${px}px 0 0 ${lit ? 'var(--eh-bone)' : pal.hi}, inset ${-px}px ${-px}px 0 0 ${pal.lo}`;
  const outline = variant === 'ghost' ? '' : `0 ${-px}px 0 0 var(--eh-ink), 0 ${px}px 0 0 var(--eh-ink), ${-px}px 0 0 0 var(--eh-ink), ${px}px 0 0 0 var(--eh-ink)`;
  return /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: fs,
      lineHeight: 1,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-ui)',
      color: disabled ? 'var(--eh-stone)' : lit && variant !== 'ghost' ? 'var(--eh-ink)' : pal.fg,
      background: bg,
      border: 0,
      borderRadius: 0,
      padding: pad,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: [bevel, outline].filter(Boolean).join(', ') || 'none',
      transform: pressed ? `translateY(${px}px)` : 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      textShadow: variant === 'ghost' && lit ? 'none' : undefined,
      ...style
    }
  }, variant === 'ghost' && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--eh-gold)',
      visibility: lit ? 'visible' : 'hidden'
    }
  }, "\u25B6"), children);
}
Object.assign(__ds_scope, { PixelButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/menu/PixelButton.jsx", error: String((e && e.message) || e) }); }

// components/menu/PixelPanel.jsx
try { (() => {
function PixelPanel({
  children,
  title,
  tone = 'stone',
  padding = 18,
  style
}) {
  const px = 3;
  const t = {
    stone: {
      bg: 'var(--eh-slate)',
      hi: 'var(--eh-stone)',
      lo: 'var(--eh-plum)',
      inset: 'var(--eh-plum)'
    },
    dark: {
      bg: 'var(--eh-plum)',
      hi: 'var(--eh-slate)',
      lo: 'var(--eh-ink)',
      inset: 'var(--eh-ink)'
    },
    parchment: {
      bg: 'var(--eh-bone)',
      hi: '#fff8',
      lo: 'var(--eh-stone)',
      inset: 'var(--eh-bone)'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.bg,
      padding: px * 2,
      boxShadow: `inset ${px}px ${px}px 0 0 ${t.hi}, inset ${-px}px ${-px}px 0 0 ${t.lo}, 0 ${-px}px 0 0 var(--eh-ink), 0 ${px}px 0 0 var(--eh-ink), ${-px}px 0 0 0 var(--eh-ink), ${px}px 0 0 0 var(--eh-ink), ${px * 2}px ${px * 2}px 0 0 var(--eh-ink)`,
      ...style
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 48,
      lineHeight: 1,
      color: tone === 'parchment' ? 'var(--eh-ember)' : 'var(--eh-gold)',
      textAlign: 'center',
      padding: '6px 0 12px'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.inset,
      padding,
      color: tone === 'parchment' ? 'var(--eh-ink)' : 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-body-sm)'
    }
  }, children));
}
Object.assign(__ds_scope, { PixelPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/menu/PixelPanel.jsx", error: String((e && e.message) || e) }); }

// guidelines/sheet.js
try { (() => {
// Contact-sheet helper: animates any [data-strip] element from a horizontal sprite strip.
(function () {
  function init(el) {
    const src = el.dataset.strip,
      n = +el.dataset.frames || 1,
      fw = +el.dataset.w || 32,
      fh = +el.dataset.h || 32,
      s = +el.dataset.scale || 3,
      fps = +el.dataset.fps || 10;
    el.style.cssText += `;width:${fw * s}px;height:${fh * s}px;background:url(${src}) no-repeat;background-size:${fw * n * s}px ${fh * s}px;image-rendering:pixelated;flex-shrink:0` + (el.dataset.flip ? ';transform:scaleX(-1)' : '');
    if (el.dataset.frame != null) {
      el.style.backgroundPosition = `${-+el.dataset.frame * fw * s}px 0`;
      return;
    }
    let f = 0;
    setInterval(() => {
      f = (f + 1) % n;
      el.style.backgroundPosition = `${-f * fw * s}px 0`;
    }, 1000 / fps);
  }
  function run() {
    document.querySelectorAll('[data-strip]').forEach(init);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', run) : run();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "guidelines/sheet.js", error: String((e && e.message) || e) }); }

// ui_kits/game/GameView.jsx
try { (() => {
// Forest level runtime: tile map from Tiled .tmj, parallax, hero/enemy sprites. Renders at 640x360.
const EHA = '../../../assets/';
const EH_SOLID = new Set([0, 1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 24, 25, 30]);
const EH_PLAT = new Set([19, 20, 21, 22, 23]);
const EH_HAZ = new Set([26, 27, 28, 29, 36]);
const EH_HERO = {
  idle: 4,
  run: 8,
  jump: 2,
  fall: 2,
  land: 2,
  attack: 6,
  hurt: 2,
  death: 6
};
const EH_ROT = {
  idle: 4,
  move: 6,
  attack: 4,
  hurt: 2,
  death: 5
};
function ehImg(src) {
  return new Promise(r => {
    const i = new Image();
    i.onload = () => r(i);
    i.src = src;
  });
}
function GameView({
  paused,
  runId,
  onHud,
  onEnd
}) {
  const cv = React.useRef(null);
  const pausedRef = React.useRef(paused);
  pausedRef.current = paused;
  React.useEffect(() => {
    let alive = true,
      raf = 0;
    const keys = {};
    const kd = e => {
      keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
    };
    const ku = e => {
      keys[e.code] = false;
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    (async () => {
      const map = await (await fetch(EHA + 'maps/forest_mock.tmj')).json();
      const L = n => map.layers.find(l => l.name === n).data.map(g => g - 1);
      const ground = L('ground'),
        decorB = L('decor_back'),
        decor = L('decor');
      const img = {
        tiles: await ehImg(EHA + 'tilesets/forest/tileset_forest.png'),
        coin: await ehImg(EHA + 'sprites/items/item_coin_spin.png'),
        ball: await ehImg(EHA + 'sprites/fx/fx_fire_projectile.png'),
        boom: await ehImg(EHA + 'sprites/fx/fx_fire_impact.png')
      };
      for (const k of ['sky', 'far', 'mid', 'near']) img[k] = await ehImg(EHA + `backgrounds/forest/bg_forest_${k}.png`);
      for (const k in EH_HERO) img['h_' + k] = await ehImg(EHA + `sprites/heroes/fire/hero_fire_${k}.png`);
      for (const k in EH_ROT) img['r_' + k] = await ehImg(EHA + `sprites/enemies/forest/enemy_rotroot_${k}.png`);
      if (!alive) return;
      const ctx = cv.current.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      const tileAt = (px, py) => {
        const tx = Math.floor(px / 32),
          ty = Math.floor(py / 32);
        if (tx < 0 || tx >= 20 || ty < 0 || ty >= 12) return -1;
        return ground[ty * 20 + tx];
      };
      const surface = (px, ty) => {
        const tx = Math.floor(px / 32);
        if (tx < 0 || tx >= 20 || ty < 0 || ty >= 12) return null;
        const id = ground[ty * 20 + tx],
          xx = px - tx * 32;
        if (EH_SOLID.has(id)) return ty * 32;
        if (id === 5) return ty * 32 + 31 - xx;
        if (id === 6) return ty * 32 + xx;
        if (EH_PLAT.has(id)) return ty * 32 + 1;
        return null;
      };
      const spawn = {
        x: 64,
        y: 257
      };
      const H = {
        ...spawn,
        vx: 0,
        vy: 0,
        face: 1,
        ground: true,
        attackT: 0,
        hurtT: 0,
        inv: 0,
        landT: 0,
        dead: 0,
        hp: 4,
        coins: 0,
        fired: false
      };
      const E = map.layers.find(l => l.name === 'entities').objects.filter(o => o.type === 'enemy_rotroot').map(o => ({
        x: o.x,
        y: o.y,
        x0: o.x - 48,
        x1: o.x + 40,
        dir: -1,
        hp: 2,
        hurt: 0,
        dead: 0,
        atk: 0
      }));
      const C = [0, 1, 2].map(i => ({
        x: 104 + i * 32,
        y: 138,
        got: false
      }));
      const B = [],
        X = [];
      let tick = 0,
        lastHud = '';
      const hurt = dir => {
        if (H.inv > 0 || H.dead) return;
        H.hp -= 0.5;
        H.hurtT = 16;
        H.inv = 70;
        H.vx = -2 * dir;
        H.vy = -3;
        H.ground = false;
        if (H.hp <= 0) {
          H.dead = 1;
          H.vx = 0;
        }
      };
      const drawStrip = (im, n, f, x, y, w, flip) => {
        f = Math.min(n - 1, f);
        ctx.save();
        if (flip) {
          ctx.translate(Math.round(x) + w, Math.round(y));
          ctx.scale(-1, 1);
          ctx.drawImage(im, f * w, 0, w, im.height, 0, 0, w, im.height);
        } else ctx.drawImage(im, f * w, 0, w, im.height, Math.round(x), Math.round(y), w, im.height);
        ctx.restore();
      };
      const drawLayer = arr => arr.forEach((id, i) => {
        if (id < 0) return;
        if (id === 32) id = 32 + Math.floor(tick / 10) % 4;
        if (id === 36) id = 36 + Math.floor(tick / 6) % 4;
        ctx.drawImage(img.tiles, id % 8 * 32, Math.floor(id / 8) * 32, 32, 32, i % 20 * 32, Math.floor(i / 20) * 32, 32, 32);
      });
      const step = () => {
        tick++;
        // hero input
        if (H.dead) {
          H.dead++;
          if (H.dead === 60) onEnd('over');
        } else {
          const L1 = keys.ArrowLeft || keys.KeyA,
            R1 = keys.ArrowRight || keys.KeyD;
          if (H.hurtT <= 0) {
            H.vx = (R1 ? 1.8 : 0) - (L1 ? 1.8 : 0);
            if (H.vx) H.face = Math.sign(H.vx);
            if (H.attackT > 0 && H.ground) H.vx *= 0.3;
          }
          if ((keys.Space || keys.ArrowUp || keys.KeyW) && H.ground && H.hurtT <= 0) {
            H.vy = -8.3;
            H.ground = false;
          }
          if ((keys.KeyJ || keys.KeyF || keys.KeyX) && H.attackT <= 0 && H.hurtT <= 0) {
            H.attackT = 24;
            H.fired = false;
          }
        }
        if (H.attackT > 0) {
          H.attackT--;
          if (!H.fired && H.attackT <= 12) {
            H.fired = true;
            B.push({
              x: H.x + (H.face > 0 ? 26 : -10),
              y: H.y + 10,
              vx: 4.2 * H.face,
              t: 0
            });
          }
        }
        if (H.hurtT > 0) H.hurtT--;
        if (H.inv > 0) H.inv--;
        if (H.landT > 0) H.landT--;
        // physics
        H.vy = Math.min(7, H.vy + 0.35);
        const nx = H.x + H.vx;
        const edge = H.vx > 0 ? nx + 22 : nx + 10;
        if (!(EH_SOLID.has(tileAt(edge, H.y + 14)) || EH_SOLID.has(tileAt(edge, H.y + 24)))) H.x = Math.max(-8, nx);
        const prevFeet = H.y + 31;
        let ny = H.y + H.vy;
        let feet = ny + 31;
        let best = null;
        if (H.vy >= 0) for (const px of [H.x + 12, H.x + 16, H.x + 20]) for (let ty = Math.floor((prevFeet - 8) / 32); ty <= Math.floor((feet + (H.ground ? 6 : 0)) / 32); ty++) {
          const s = surface(px, ty);
          if (s == null) continue;
          const id = tileAt(px, ty * 32);
          const okTop = EH_PLAT.has(id) ? prevFeet <= s + 1 : s >= prevFeet - 8;
          if (okTop && s <= feet + (H.ground ? 6 : 0) && (best == null || s < best)) best = s;
        }
        if (best != null) {
          if (!H.ground && H.vy > 3) H.landT = 8;
          H.y = best - 31;
          H.vy = 0;
          H.ground = true;
        } else {
          H.y = ny;
          H.ground = false;
        }
        if (H.vy < 0 && EH_SOLID.has(tileAt(H.x + 16, H.y + 8))) {
          H.vy = 0;
        }
        // hazards / water / exits
        if (!H.dead) {
          if (EH_HAZ.has(tileAt(H.x + 16, H.y + 26)) || EH_HAZ.has(tileAt(H.x + 16, H.y + 16))) hurt(H.face);
          const tw = tileAt(H.x + 16, H.y + 28);
          if (tw === 31 || tw === 32) {
            H.inv = 0;
            hurt(1);
            if (!H.dead) Object.assign(H, spawn, {
              vx: 0,
              vy: 0
            });
          }
          if (H.x > 612) onEnd('complete', H.coins);
          if (H.y > 380) {
            H.hp = 0;
            H.dead = 1;
          }
        }
        // coins
        C.forEach(c => {
          if (!c.got && Math.abs(H.x + 16 - (c.x + 8)) < 14 && Math.abs(H.y + 20 - (c.y + 8)) < 18) {
            c.got = true;
            H.coins++;
          }
        });
        // enemies
        E.forEach(e => {
          if (e.dead) {
            e.dead++;
            return;
          }
          if (e.hurt > 0) {
            e.hurt--;
            return;
          }
          e.x += 0.45 * e.dir;
          if (e.x < e.x0 || e.x > e.x1) e.dir *= -1;
          if (!H.dead && Math.abs(H.x + 16 - (e.x + 16)) < 14 && Math.abs(H.y - e.y) < 22) hurt(Math.sign(e.x - H.x) || 1);
        });
        // fireballs
        for (let i = B.length - 1; i >= 0; i--) {
          const b = B[i];
          b.x += b.vx;
          b.t++;
          let hit = EH_SOLID.has(tileAt(b.x + 8, b.y + 8)) || b.x < -16 || b.x > 656;
          E.forEach(e => {
            if (!e.dead && !hit && b.x + 12 > e.x + 9 && b.x + 4 < e.x + 23 && b.y + 8 > e.y + 12) {
              hit = true;
              e.hp--;
              e.hurt = 14;
              if (e.hp <= 0) e.dead = 1;
            }
          });
          if (hit) {
            X.push({
              x: b.x - 8,
              y: b.y - 8,
              t: 0
            });
            B.splice(i, 1);
          }
        }
        for (let i = X.length - 1; i >= 0; i--) if (++X[i].t > 20) X.splice(i, 1);
        const hud = H.hp + ':' + H.coins;
        if (hud !== lastHud) {
          lastHud = hud;
          onHud({
            hp: H.hp,
            coins: H.coins
          });
        }
      };
      const draw = () => {
        const par = {
          sky: 0,
          far: 0.1,
          mid: 0.25,
          near: 0.45
        };
        for (const k of ['sky', 'far', 'mid', 'near']) {
          const o = Math.round((H.x * par[k] % 640 + 640) % 640);
          ctx.drawImage(img[k], -o, 0);
          ctx.drawImage(img[k], 640 - o, 0);
        }
        drawLayer(decorB);
        drawLayer(ground);
        drawLayer(decor);
        C.forEach((c, i) => {
          if (!c.got) ctx.drawImage(img.coin, Math.floor(tick / 7 + i * 2) % 6 * 16, 0, 16, 16, c.x, c.y + Math.round(Math.sin(tick / 20 + i) * 1.5), 16, 16);
        });
        E.forEach(e => {
          if (e.dead > 40) return;
          const a = e.dead ? 'death' : e.hurt ? 'hurt' : 'move';
          const f = e.dead ? Math.floor(e.dead / 8) : e.hurt ? Math.floor((14 - e.hurt) / 7) : Math.floor(tick / 8) % 6;
          drawStrip(img['r_' + a], EH_ROT[a], f, e.x, e.y, 32, e.dir < 0);
        });
        let a, f;
        if (H.dead) {
          a = 'death';
          f = Math.floor(H.dead / 8);
        } else if (H.hurtT > 0) {
          a = 'hurt';
          f = H.hurtT > 8 ? 0 : 1;
        } else if (H.attackT > 0) {
          a = 'attack';
          f = Math.floor((24 - H.attackT) / 4);
        } else if (!H.ground) {
          a = H.vy < 0 ? 'jump' : 'fall';
          f = Math.floor(tick / 8) % 2;
        } else if (H.landT > 0) {
          a = 'land';
          f = H.landT > 4 ? 0 : 1;
        } else if (Math.abs(H.vx) > 0.1) {
          a = 'run';
          f = Math.floor(tick / 5) % 8;
        } else {
          a = 'idle';
          f = Math.floor(tick / 10) % 4;
        }
        if (!(H.inv > 0 && !H.dead && H.hurtT <= 0 && Math.floor(tick / 3) % 2)) drawStrip(img['h_' + a], EH_HERO[a], f, H.x, H.y, 32, H.face < 0);
        B.forEach(b => drawStrip(img.ball, 4, Math.floor(b.t / 4) % 4, b.x, b.y, 16, b.vx < 0));
        X.forEach(x => drawStrip(img.boom, 4, Math.floor(x.t / 5), x.x, x.y, 32, false));
      };
      const loop = () => {
        if (!alive) return;
        if (!pausedRef.current) step();
        draw();
        raf = requestAnimationFrame(loop);
      };
      loop();
    })();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, [runId]);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: cv,
    width: 640,
    height: 360,
    style: {
      width: '100%',
      height: '100%',
      imageRendering: 'pixelated',
      display: 'block'
    }
  });
}
window.GameView = GameView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/game/GameView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/game/Screens.jsx
try { (() => {
// Menu screens composed from the DS components. Stage is 1280x720 (2x the 640x360 game view).
const EHK = new Proxy({}, {
  get: (_, k) => (window.ElementalHeroesDesignSystem_0f20c7 || {})[k]
});
const EHK_A = '../../../assets/';
function ParallaxBackdrop({
  dim
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, ['sky', 'far', 'mid', 'near'].map(k => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url(${EHK_A}backgrounds/forest/bg_forest_${k}.png)`,
      backgroundSize: '1280px 720px',
      imageRendering: 'pixelated'
    }
  })), dim && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--eh-ink)',
      opacity: 0.55
    }
  }));
}
function TitleScreen({
  onStart
}) {
  const {
    PixelButton,
    Sprite
  } = EHK;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement(ParallaxBackdrop, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 96,
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 128,
      lineHeight: 1,
      color: 'var(--eh-gold)',
      textShadow: '-6px 0 0 var(--eh-ink),6px 0 0 var(--eh-ink),0 -6px 0 var(--eh-ink),0 6px 0 var(--eh-ink),6px 12px 0 var(--eh-ember)'
    }
  }, "Elemental Heroes"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 24,
      color: 'var(--eh-bone)',
      textShadow: 'var(--text-outline)',
      textTransform: 'uppercase'
    }
  }, "World 1 \xB7 The Forest"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 21,
      alignItems: 'center',
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(PixelButton, {
    size: "lg",
    onClick: onStart
  }, "Start"), /*#__PURE__*/React.createElement(PixelButton, {
    variant: "secondary",
    disabled: true
  }, "Level Select"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 96,
      bottom: 72
    }
  }, /*#__PURE__*/React.createElement(Sprite, {
    src: EHK_A + 'sprites/heroes/fire/hero_fire_idle.png',
    frames: 4,
    fps: 6,
    scale: 6
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 96,
      bottom: 72
    }
  }, /*#__PURE__*/React.createElement(Sprite, {
    src: EHK_A + 'sprites/enemies/forest/enemy_rotroot_idle.png',
    frames: 4,
    fps: 5,
    scale: 6,
    flip: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 24,
      width: '100%',
      textAlign: 'center',
      fontFamily: 'var(--font-ui)',
      fontSize: 16,
      color: 'var(--eh-bone)',
      textShadow: 'var(--text-outline)'
    }
  }, "\u2190 \u2192 move \xB7 space jump \xB7 F fire \xB7 esc pause"));
}
function Overlay({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(13,11,20,.6)',
      display: 'grid',
      placeItems: 'center'
    }
  }, children);
}
function PauseMenu({
  onResume,
  onRestart,
  onQuit
}) {
  const {
    PixelPanel,
    PixelButton
  } = EHK;
  return /*#__PURE__*/React.createElement(Overlay, null, /*#__PURE__*/React.createElement(PixelPanel, {
    title: "Paused",
    style: {
      width: 360
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(PixelButton, {
    variant: "ghost",
    selected: true,
    onClick: onResume
  }, "Resume"), /*#__PURE__*/React.createElement(PixelButton, {
    variant: "ghost",
    onClick: onRestart
  }, "Restart"), /*#__PURE__*/React.createElement(PixelButton, {
    variant: "ghost",
    onClick: onQuit
  }, "Quit to title"))));
}
function ResultPanel({
  kind,
  coins,
  onRetry,
  onQuit
}) {
  const {
    PixelPanel,
    PixelButton,
    CoinCounter
  } = EHK;
  const win = kind === 'complete';
  return /*#__PURE__*/React.createElement(Overlay, null, /*#__PURE__*/React.createElement(PixelPanel, {
    title: win ? 'Level Complete' : 'Game Over',
    tone: win ? 'stone' : 'dark',
    style: {
      width: 440
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      alignItems: 'center'
    }
  }, win ? /*#__PURE__*/React.createElement(CoinCounter, {
    count: coins,
    scale: 3,
    src: EHK_A + 'sprites/items/item_coin_spin.png'
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      textAlign: 'center'
    }
  }, "The flame goes out. For now."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 21
    }
  }, /*#__PURE__*/React.createElement(PixelButton, {
    onClick: onRetry
  }, win ? 'Play again' : 'Retry'), /*#__PURE__*/React.createElement(PixelButton, {
    variant: "secondary",
    onClick: onQuit
  }, "Title")))));
}
function Hud({
  hp,
  coins
}) {
  const {
    HeartMeter,
    CoinCounter,
    ElementBadge
  } = EHK;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      top: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(HeartMeter, {
    value: hp,
    max: 4,
    scale: 2,
    src: EHK_A + 'ui/ui_heart_states.png'
  }), /*#__PURE__*/React.createElement(CoinCounter, {
    count: coins,
    scale: 2,
    src: EHK_A + 'sprites/items/item_coin_spin.png'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 22,
      top: 22
    }
  }, /*#__PURE__*/React.createElement(ElementBadge, {
    element: "fire",
    scale: 2,
    icon: EHK_A + 'ui/icon_element_fire.png'
  })));
}
Object.assign(window, {
  TitleScreen,
  PauseMenu,
  ResultPanel,
  Hud
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/game/Screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CoinCounter = __ds_scope.CoinCounter;

__ds_ns.ElementBadge = __ds_scope.ElementBadge;

__ds_ns.HeartMeter = __ds_scope.HeartMeter;

__ds_ns.Sprite = __ds_scope.Sprite;

__ds_ns.PixelButton = __ds_scope.PixelButton;

__ds_ns.PixelPanel = __ds_scope.PixelPanel;

})();

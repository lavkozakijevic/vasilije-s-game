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
const EH_WOLF = { idle:4, run:6, lunge:4, hurt:2, death:5 };
const EH_SSPR = { fly:4, attack:5, hurt:2, death:5 };
const EH_FROST = { walk:6, shield_up:3, shield_hold:2, hurt:2, death:6 };
const EH_YETI = { idle:4, walk:6, stomp:5, throw:5, hurt:2, defeat:6 };
const EH_FW = { idle:4, telegraph:4, attack_spikes:6, attack_breath:6, hurt:2, death:8 };
const EH_MC = { idle:4, telegraph:4, attack_slam:6, attack_rain:6, hurt:2, death:8 };
const EH_SLIME = { idle:4, hop:6, hurt:2, death:5, frozen:1 };
const EH_BAT = { hang:2, fly:4, swoop:4, hurt:2, death:5 };
const EH_GOLEM = { walk:6, shell_up:3, shell_hold:2, shell_crack:4, hurt:2, death:6 };
const EH_SAL = { idle:4, walk:6, dive:5, surface:5, spit:5, hurt:2, defeat:6 };
// shielded enemies: a shot at their face is blocked unless it is one of these elements
const EH_SHIELD = { frost: ['fire', 'light'], golem: ['ice', 'water'], hknight: ['light'] };
const EH_SHADE = { fly:4, fade_out:4, fade_in:4, attack:5, hurt:2, death:6 };
const EH_GARG = { perch:1, wake:4, fly:4, swoop:4, hurt:2, death:6 };
const EH_HK = { walk:6, shield_up:3, shield_hold:2, attack:5, hurt:2, death:6 };
const EH_UMBRA = { idle:4, dash:4, attack:5, stunned:4, kneel:4 };
const EH_MRAK = { idle:4, telegraph:4, shadow_attack:6, summon:6, hurt:2, phase_change:6, defeat:8, warden_roots:6, warden_frost:6, warden_magma:6, laugh:4, stagger:4 };
// Playable roster: the four cousins (keys 1-4), then each Hearth Knight once its statue is woken (Q/E cycles everyone).
// Projectile stats per element are placeholders for tuning: v = speed (px/tick), dmg = damage, arc = lobbed, pierce = passes through enemies.
const EH_POWER = {
  fire: { v: 4.2, dmg: 1 }, water: { v: 3.6, dmg: 1 }, earth: { v: 3.4, dmg: 2, arc: true }, air: { v: 5.2, dmg: 1, pierce: true },
  ice: { v: 4.8, dmg: 1 }, lightning: { v: 6.5, dmg: 1 }, shadow: { v: 3.2, dmg: 2 }, light: { v: 5.6, dmg: 1, pierce: true },
  // Ruby: a present lobbed in an arc that bursts where it lands (hurts everything near); Vera: a golden ray (one hit for any enemy, three for any boss)
  present: { v: 2.83, dmg: 2, arc: true, vy: -4.33, g: 0.194, bomb: true }, gold: { v: 5.33, dmg: 1, pierce: true },
};
const EH_COUSINS = [
  { id: 'konstantin', el: 'light', name: 'Kosta', kid: true },
  { id: 'katarina',   el: 'fire',  name: 'Katarina', kid: true },
  { id: 'vasilije',   el: 'ice',   name: 'Vasilije', kid: true },
  { id: 'dimitrije',  el: 'air',   name: 'Dimitrije', kid: true },
];
const EH_KNIGHTS = { fire: 'Cinder', water: 'Brine', earth: 'Basalt', air: 'Wisp', ice: 'Rime', lightning: 'Jolt', shadow: 'Umbra', light: 'Aurel' };
const EH_ELEMENTS = ['fire', 'water', 'earth', 'air', 'ice', 'lightning', 'shadow', 'light'];   // the knights' elements
// unlockable heroes (keys 5 and 6): Ruby after the toy level, Baba Vera for a cousin with perfect runs of levels 1-4
const EH_EXTRA = [{ id: 'ruby', el: 'present', name: 'Rubi', kid: true, key: 5 }, { id: 'vera', el: 'gold', name: 'Baba Vera', kid: true, key: 6 }];
// Per-level setup. Each level has a star cousin: the level starts with them and only they can land the final blow on its boss.
// T = the tileset's rules (ids from its .tsj): solid, one-way, hazards, water, animated tiles, crumble planks, bounce tile, slippery ice.
const EH_LV = {
  l1: { id: 'l1', map: 'maps/forest_mock.tmj', tiles: 'tilesets/forest/tileset_forest.png', bg: 'backgrounds/forest/bg_forest_', fg: 'backgrounds/forest/fg_forest_branches.png', fgAlways: false,
    shrine: 'sprites/props/forest/prop_checkpoint_shrine_', arch: 'sprites/props/forest/prop_exit_arch.png', star: 'dimitrije', starKey: 4, knights: ['air', 'earth'], pet: 'puppy',
    T: { solid: EH_SOLID, plat: EH_PLAT, feetHaz: [26, 27, 28], bodyHaz: [29, 36], water: [31, 32], anim: { 32: [32, 4, 10], 36: [36, 4, 6] }, crumble: [56, 57, 58, 59], bounce: [63, 64, 65, 66, 67], ice: new Set(), noSafe: id => id === 30 || id >= 63 } },
  l2: { id: 'l2', map: 'maps/peaks_l2.tmj', tiles: 'tilesets/peaks/tileset_peaks.png', bg: 'backgrounds/peaks/bg_peaks_', fg: 'backgrounds/peaks/fg_peaks_snowfall.png', fgAlways: true,
    shrine: 'sprites/props/peaks/prop_checkpoint_shrine_snow_', arch: 'sprites/props/peaks/prop_exit_arch_ice.png', star: 'katarina', starKey: 2, knights: ['ice', 'water'], pet: 'cheetah',
    T: { solid: new Set([0,1,2,3,4,7,8,9,10,11,12,13,14,15,16,17,18,22,23,24,25,26,34,42,43,44,45,46,47,48,50,52]), plat: new Set([19,20,21,27,28,29,30,31,32]),
      feetHaz: [40], bodyHaz: [], water: [35, 36], anim: { 36: [36, 4, 10] }, crumble: [30, 31, 32, 33], bounce: [42, 43, 44, 45, 46], ice: new Set([22, 23, 24, 25, 26, 34]), noSafe: id => id === 34 || (id >= 42 && id <= 46) } },
};
EH_LV.l3 = { id: 'l3', map: 'maps/caves_l3.tmj', tiles: 'tilesets/caves/tileset_caves.png', bg: 'backgrounds/caves/bg_caves_', fg: 'backgrounds/caves/fg_caves_embers.png', fgAlways: true,
  shrine: 'sprites/props/caves/prop_checkpoint_shrine_cave_', arch: 'sprites/props/caves/prop_exit_arch_obsidian.png', gem: 'sprites/items/item_gem_caves.png', star: 'vasilije', starKey: 3, knights: ['fire', 'lightning'], pet: 'fox',
  T: { solid: new Set([0,1,2,3,4,7,8,9,10,11,12,13,14,15,16,17,18,35,36,48,49,50,51,52,53,54,56,58]), plat: new Set([19,20,21,22,23,24,25,26,27]),
    feetHaz: [46], bodyHaz: [], water: [29, 30], lava: true, anim: { 30: [30, 4, 10], 38: [38, 4, 8], 42: [42, 4, 8] }, crumble: [25, 26, 27, 28], bounce: [48, 49, 50, 51, 52], ice: new Set(), noSafe: id => id === 35 || id === 36 || (id >= 48 && id <= 52) } };
EH_LV.l4 = { id: 'l4', map: 'maps/keep_l4.tmj', tiles: 'tilesets/keep/tileset_keep.png', bg: 'backgrounds/keep/bg_keep_', fg: 'backgrounds/keep/fg_keep_dust.png', fgAlways: true,
  shrine: 'sprites/props/keep/prop_checkpoint_shrine_keep_', arch: null, gem: 'sprites/items/item_gem_keep.png', star: 'konstantin', starKey: 1, knights: ['light', 'shadow'], pet: 'eagle', ride: true,
  T: { solid: new Set([0,1,2,3,4,7,8,9,10,11,12,13,14,15,16,17,18,46,47,48,49,50,51,52,54,56]), plat: new Set([19,20,21,22,23,24,25,26,27,31,34]),
    feetHaz: [40], bodyHaz: [42], water: [35, 36], anim: { 36: [36, 4, 10], 42: [42, 4, 8] }, crumble: [25, 26, 27, 28], bounce: [46, 47, 48, 49, 50], ice: new Set(), noSafe: id => id === 31 || (id >= 46 && id <= 50),
    bridge: true, hidden: true } };
// Level 5, the Big Tidy-Up: the living room, no enemies; pick up every toy in 60 seconds.
// The room is built from tiles at the kids' scale (walls, windows, low ceiling), so the painted backgrounds are not drawn.
// Only the chosen cousin plays (no knights, no pets).
EH_LV.l5 = { id: 'l5', map: 'maps/house_l5.tmj', tiles: 'tilesets/house/tileset_house.png', bg: 'backgrounds/house/bg_house_', fg: 'backgrounds/house/fg_house_sunbeams.png', fgAlways: true,
  shrine: 'sprites/props/forest/prop_checkpoint_shrine_', arch: null, star: null, starKey: 0, knights: [], pet: null, toys: true, solo: true, noBg: true,
  T: { solid: new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,22,23,44,60,61,62,63,64,65,66,67,68,69]), plat: new Set([24,25,26,27,28,29,30,31,32,33,34,35,40,41,42,43,45,46,47,48,49,50,55,56,59]),
    feetHaz: [], bodyHaz: [], water: [], anim: {}, crumble: [999, 999, 999, 999], bounce: [60, 61, 62, 63, 64], bounce2: [65, 66, 67, 68, 69], ice: new Set(), noSafe: id => id >= 60 && id <= 69 } };
// Level 6, Mishika in the Attic: only Mita; 90 seconds to find Marija's blue cat (she hides twice), then 90 new seconds
// to carry her back to the hatch. Rats chase him; swinging ropes, beams, creaky boards, a mattress trampoline.
EH_LV.l6 = { id: 'l6', map: 'maps/attic_l6.tmj', tiles: 'tilesets/attic/tileset_attic.png', bg: 'backgrounds/attic/bg_attic_', fg: 'backgrounds/attic/fg_attic_dust.png', fgAlways: true,
  shrine: 'sprites/props/forest/prop_checkpoint_shrine_', arch: null, star: null, starKey: 0, knights: [], pet: null, solo: 'dimitrije', cat: true, timer: 90,
  T: { solid: new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,24,30,31,32,33,34,35,36,37,38,39,40,43,44,45,46,58,59,60,61,62]),
    plat: new Set([20,21,22,23,25,26,27,28,41,42,54,56,57,83,84]), feetHaz: [], bodyHaz: [], water: [], anim: {}, crumble: [26, 27, 28, 29], bounce: [58, 59, 60, 61, 62],
    ice: new Set(), noSafe: id => id >= 58 && id <= 62 } };
const EH_LV_ORDER = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'];
const EH_RAT = { idle:4, run:6, chase:6, hurt:2, death:5 };
const EH_SPIDER = { idle:4, drop:2, climb:4, hurt:2, death:5 }, EH_WASP = { fly:4, attack:4, hurt:2, death:5 };
const EH_CAT = { idle:4, sit:4, run:6, hide:4, found:4 };
const EH_TOY_NAMES = { football: ['the football', 'fudbalsku loptu'], lego: ['the Lego', 'lego kockice'], teddy: ['the teddy', 'medu'], car: ['the toy car', 'autić'], stick: ['the stick', 'štap'],
  crayons: ['the crayons', 'bojice'], markers: ['the markers', 'flomastere'], pencils: ['the pencils', 'olovke'], chessboard: ['the chessboard', 'šahovsku tablu'], cards: ['the cards', 'karte'],
  uno: ['the Uno cards', 'UNO karte'], plush_bunny: ['the plush bunny', 'plišanog zeku'], plush_dino: ['the plush dino', 'plišanog dinosaurusa'], plush_cat: ['the plush cat', 'plišanu mačku'], sword: ['the toy sword', 'drveni mač'] };
// Companions: each belongs to one cousin, joins in that cousin's level and follows them from then on (bark: finds gems, pounce: jumps on enemies)
const EH_PETS = {
  puppy:   { id: 'puppy',   owner: 'dimitrije', ownerName: 'DIMITRIJE', key: 4, sprite: 'companion_puppy',   skill: 'bark',   yarn: true },
  cheetah: { id: 'cheetah', owner: 'katarina',  ownerName: 'KATARINA',  key: 2, sprite: 'companion_cheetah', skill: 'pounce', yarn: false },
  eagle:   { id: 'eagle',   owner: 'konstantin', ownerName: 'KOSTA',   key: 1, sprite: 'companion_golden_eagle', skill: 'scout', yarn: false, fly: true },   // flies; marks hidden ledges
  fox:     { id: 'fox',     owner: 'vasilije',  ownerName: 'VASILIJE',  key: 3, sprite: 'companion_fire_fox', skill: 'fetch',  yarn: false },   // dashes to coins you can't reach
};
const GROUND_Y = 288;
function ehImg(src){ return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }); }

function GameView({ level = 'l1', paused, runId, onHud, onEnd, onStory, heroes = [], player = null }) {
  const LV = EH_LV[level] || EH_LV.l1, T = LV.T, EH_STAR = LV.star, before = LV.solo ? [] : EH_LV_ORDER.slice(0, EH_LV_ORDER.indexOf(LV.id));
  const cv = React.useRef(null);
  const pausedRef = React.useRef(paused);
  pausedRef.current = paused;
  React.useEffect(() => {
    let alive = true, raf = 0;
    const keys = {}; let wantHero = -1, cycle = 0, jumpBuf = 0, spaceBuf = 0;   // jumpBuf remembers a jump press for a few ticks so quick taps aren't lost
    const kd = e => { keys[e.code] = true; const d = /^Digit([1-6])$/.exec(e.code); if (d) wantHero = 'k' + d[1]; if (['Space','ArrowUp','KeyW'].includes(e.code) && !e.repeat) jumpBuf = 8; if (e.code === 'Space' && !e.repeat) spaceBuf = 8; if (e.code === 'KeyQ') cycle = -1; if (e.code === 'KeyE') cycle = 1; if (['Space','ArrowUp','ArrowDown'].includes(e.code)) e.preventDefault(); };
    const ku = e => { keys[e.code] = false; };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    (async () => {
      const map = await (await fetch(EHA + LV.map, { cache: 'no-cache' })).json();
      // tile layers: ids (-1 = empty) plus horizontal-flip flags (Tiled keeps flips in the gid's top bits)
      const L = n => { const l = map.layers.find(l => l.name === n); if (!l) return null; return { id: l.data.map(g => (g % 0x20000000) - 1), flip: l.data.map(g => g >= 0x80000000) }; };
      const GL = L('ground'), DBL = L('decor_back'), DL = L('decor'), FGL = L('foreground'), ground = GL.id;
      const crumble = {}, bounceT = {}; let fgA = 1;   // per-tile crumble timers, bounce animations, foreground fade
      const S = EHA + 'sprites/', img = {};
      const load = async (k, p) => { img[k] = await ehImg(EHA + p); };
      await Promise.all([
        load('tiles', LV.tiles),
        ...['sky','far','mid','near','arena_near'].map(k => load(k, `${LV.bg}${k}.png`)),
        load('fg', LV.fg),
        load('coin', 'sprites/items/item_coin_spin.png'), load('heart', 'sprites/items/item_heart_pickup.png'), load('gem', LV.gem || 'sprites/items/item_gem_forest.png'),
        load('fx_coin', 'sprites/items/fx_pickup_coin.png'), load('fx_heart', 'sprites/items/fx_pickup_heart.png'),
        ...['dust_jump','dust_land','splash_water','hit_spark','hero_respawn'].map(k => load('fx_' + k, `sprites/fx/fx_${k}.png`)),
        ...['idle','activate','lit'].map(k => load('cp_' + k, `${LV.shrine}${k}.png`)),
        load('arch', LV.arch || 'sprites/props/forest/prop_exit_arch.png'),
        ...EH_ELEMENTS.map(el => load('st_' + el, `sprites/statues/statue_knight_${el}.png`)), load('st_awaken', 'sprites/statues/fx_statue_awaken.png'),
        ...Object.values(EH_PETS).flatMap(pt => (pt.fly ? ['fly', 'glide', 'dive', 'carry_konstantin'] : ['idle', 'run', 'jump', 'special']).map(k => load(`pet_${pt.id}_${k}`, `sprites/companions/${pt.sprite}/${pt.sprite}_${k}.png`))),
        load('yarn', 'sprites/items/item_yarn_ball.png'),
        load('p_present', 'sprites/heroes/present/fx_present_projectile.png'), load('boom', 'sprites/heroes/present/fx_present_explosion.png'), load('i_present', 'sprites/heroes/present/fx_present_projectile.png'),
        load('p_gold', 'sprites/heroes/gold/fx_gold_projectile.png'), load('i_gold', 'sprites/heroes/gold/fx_gold_impact.png'),
        ...[...EH_COUSINS, ...EH_EXTRA].flatMap(c => [...Object.keys(EH_HERO), 'respawn'].map(k => load(`h_${c.id}_${k}`, `sprites/heroes/kids/${c.id}/hero_${c.id}_${k}.png`))),
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
        ...(LV.id === 'l2' ? [
          ...Object.keys(EH_WOLF).map(k => load('w_' + k, `sprites/enemies/peaks/ice_wolf/enemy_ice_wolf_${k}.png`)),
          ...Object.keys(EH_SSPR).map(k => load('ss_' + k, `sprites/enemies/peaks/snow_sprite/enemy_snow_sprite_${k}.png`)),
          load('snowball', 'sprites/enemies/peaks/snow_sprite/fx_snowball.png'), load('fx_snowball_burst', 'sprites/enemies/peaks/snow_sprite/fx_snowball_burst.png'),
          ...Object.keys(EH_FROST).map(k => load('fr_' + k, `sprites/enemies/peaks/frostling/enemy_frostling_${k}.png`)),
          load('icicle', 'sprites/hazards/hazard_icicle.png'), load('fx_icicle_shatter', 'sprites/hazards/hazard_icicle_shatter.png'),
          ...Object.keys(EH_YETI).map(k => load('y_' + k, `sprites/bosses/peaks/yeti_cub/boss_yeti_cub_${k}.png`)), load('bigball', 'sprites/bosses/peaks/yeti_cub/fx_big_snowball.png'),
          ...Object.keys(EH_FW).map(k => load('fw_' + k, `sprites/bosses/peaks/frost_warden/boss_frost_warden_${k}.png`)),
          load('ice_spike', 'sprites/bosses/peaks/frost_warden/fx_ice_spike.png'), load('breath', 'sprites/bosses/peaks/frost_warden/fx_frost_breath.png'), load('warn_frost', 'sprites/bosses/peaks/frost_warden/fx_warning_frost.png'),
          load('scarf', 'sprites/items/item_baba_red_scarf.png')] : []),
        ...(LV.id === 'l3' ? [
          ...Object.keys(EH_SLIME).map(k => load('sl_' + k, `sprites/enemies/caves/magma_slime/enemy_magma_slime_${k}.png`)),
          ...Object.keys(EH_BAT).map(k => load('bt_' + k, `sprites/enemies/caves/ember_bat/enemy_ember_bat_${k}.png`)),
          ...Object.keys(EH_GOLEM).map(k => load('gl_' + k, `sprites/enemies/caves/cinder_golem/enemy_cinder_golem_${k}.png`)),
          load('rock', 'sprites/hazards/hazard_falling_rock.png'), load('fx_rock_shatter', 'sprites/hazards/hazard_falling_rock_shatter.png'),
          load('bubble', 'sprites/hazards/hazard_lava_bubble.png'), load('fx_lava_splash', 'sprites/hazards/hazard_lava_bubble_splash.png'),
          ...Object.keys(EH_SAL).map(k => load('sa_' + k, `sprites/bosses/caves/lava_salamander/boss_lava_salamander_${k}.png`)), load('salball', 'sprites/bosses/caves/lava_salamander/fx_salamander_fireball.png'),
          ...Object.keys(EH_MC).map(k => load('fw_' + k, `sprites/bosses/caves/magma_colossus/boss_magma_colossus_${k}.png`)),
          load('lava_wave', 'sprites/bosses/caves/magma_colossus/fx_lava_wave.png'), load('magma', 'sprites/bosses/caves/magma_colossus/fx_falling_magma.png'), load('warn_frost', 'sprites/bosses/caves/magma_colossus/fx_warning_heat.png'),
          load('scarf', 'sprites/items/item_baba_family_photo.png'),
          ...['open', 'closing', 'closed', 'opening'].map(k => load('cg_' + k, `sprites/props/caves/prop_cave_gate_${k}.png`)),
          load('rlava', 'backgrounds/caves/rising_lava.png'), load('rlava_body', 'backgrounds/caves/rising_lava_body.png')] : []),
        ...(LV.cat ? [...Object.keys(EH_RAT).map(k => load('rat_' + k, `sprites/enemies/attic/rat/enemy_rat_${k}.png`)), load('ratling', 'sprites/enemies/attic/rat/enemy_rat_small_run.png'),
          ...Object.keys(EH_CAT).map(k => load('cat_' + k, `sprites/npc/mishika/npc_mishika_${k}.png`)), load('rope', 'sprites/props/attic/prop_rope.png'), load('wasp_nest', 'sprites/props/attic/prop_wasp_nest.png'),
          ...Object.keys(EH_SPIDER).map(k => load('sp_' + k, `sprites/enemies/attic/spider/enemy_spider_${k}.png`)), ...Object.keys(EH_WASP).map(k => load('wa_' + k, `sprites/enemies/attic/wasp/enemy_wasp_${k}.png`)), load('hatch_glow', 'sprites/props/attic/prop_hatch_glow.png'),
          ...['idle', 'run', 'jump', 'fall', 'land', 'hurt'].map(k => load('carry_' + k, `sprites/heroes/kids/dimitrije/hero_dimitrije_carry_${k}.png`)),
          load('ui_timer', 'ui/ui_timer.png'), load('ui_cat', 'ui/ui_cat_icon.png'), load('ui_hatch', 'ui/ui_hatch_icon.png')] : []),
        ...(LV.toys ? [...Object.keys(EH_TOY_NAMES).map(k => load('toy_' + k, `sprites/items/toys/toy_${k}.png`)), load('fx_toy_pickup', 'sprites/items/toys/fx_toy_pickup.png'),
          load('ui_timer', 'ui/ui_timer.png'), load('ui_toybox', 'ui/ui_toy_counter_icon.png'), ...['idle', 'walk', 'wag_finger', 'laugh'].map(k => load('mj_' + k, `sprites/npc/marija/npc_marija_${k}.png`))] : []),
        ...(LV.id === 'l4' ? [
          ...Object.keys(EH_SHADE).map(k => load('sh_' + k, `sprites/enemies/keep/shadow_shade/enemy_shadow_shade_${k}.png`)),
          ...Object.keys(EH_GARG).map(k => load('ga_' + k, `sprites/enemies/keep/stone_gargoyle/enemy_stone_gargoyle_${k}.png`)),
          ...Object.keys(EH_HK).map(k => load('hk_' + k, `sprites/enemies/keep/hollow_knight/enemy_hollow_knight_${k}.png`)),
          ...Object.keys(EH_UMBRA).map(k => load('um_' + k, `sprites/npc/umbra/npc_umbra_${k}.png`)),
          load('chand', 'sprites/hazards/hazard_chandelier.png'), load('fx_chand_crash', 'sprites/hazards/hazard_chandelier_crash.png'), load('fx_eagle_mark', 'sprites/fx/fx_eagle_mark.png'),
          ...Object.keys(EH_MRAK).map(k => load('mk_' + k, `sprites/bosses/keep/mrak/boss_mrak_${k}.png`)),
          load('mrak_wave', 'sprites/bosses/keep/mrak/fx_mrak_shadow_wave.png'), load('mrak_orb', 'sprites/bosses/keep/mrak/fx_mrak_orb.png'), load('beam', 'sprites/bosses/keep/mrak/fx_four_stones_beam.png'),
          load('ice_spike', 'sprites/bosses/peaks/frost_warden/fx_ice_spike.png'), load('lava_wave', 'sprites/bosses/caves/magma_colossus/fx_lava_wave.png'),
          ...['locked', 'opening', 'open'].map(k => load('cage_' + k, `sprites/props/keep/prop_baba_cage_${k}.png`)),
          load('cliff', 'backgrounds/keep/bg_keep_cliff.png')] : []),
      ]);
      if (!alive) return;
      const ctx = cv.current.getContext('2d'); ctx.imageSmoothingEnabled = false;
      const MW = map.width, MH = map.height, LW = MW * 32; let cam = 0, camF = 0;
      const tileAt = (px, py) => { const tx = Math.floor(px / 32), ty = Math.floor(py / 32); if (tx < 0 || tx >= MW || ty < 0 || ty >= MH) return -1; return ground[ty * MW + tx]; };
      const surface = (px, ty) => { const tx = Math.floor(px / 32); if (tx < 0 || tx >= MW || ty < 0 || ty >= MH) return null; const id = ground[ty * MW + tx], xx = px - tx * 32;
        if (T.solid.has(id)) return ty * 32; if (id === 5) return ty * 32 + 31 - xx; if (id === 6) return ty * 32 + xx; if (T.plat.has(id)) return ty * 32 + 1; return null; };
      const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
      const ents = map.layers.find(l => l.name === 'entities').objects, of = t => ents.filter(o => o.type === t);
      const sp = ents.find(o => o.name === 'player_spawn');
      const spawn = { x: sp ? sp.x : 64, y: sp ? sp.y : 257 }; let safe = { ...spawn };
      const SOLO = LV.solo ? EH_COUSINS.find(c => c.id === (typeof LV.solo === 'string' ? LV.solo : ({ kosta: 'konstantin' }[player] || player))) || EH_COUSINS[0] : null;
      const ROSTER = SOLO ? [{ ...SOLO }] : [...EH_COUSINS.map(c => ({ ...c })), ...EH_EXTRA.filter(x => heroes.includes(x.id)).map(x => ({ ...x })), ...before.flatMap(l => EH_LV[l].knights).map(el => ({ id: 'k_' + el, el, name: EH_KNIGHTS[el], kid: false }))];   // knights woken in earlier levels come along
      const H = { ...spawn, vx: 0, vy: 0, face: 1, ground: true, attackT: 0, hurtT: 0, inv: 0, landT: 0, dead: 0, hp: 4, coins: 0, fired: false, hero: Math.max(0, ROSTER.findIndex(r => r.id === EH_STAR)), swapT: 0 };
      // Hearth Knight statues: touching one wakes the knight, who joins the roster
      const ST = ents.filter(o => o.type === 'knight_statue').map(o => ({ el: o.name, x: o.x, y: o.y, woke: false, wakeT: -1 }));
      // companions: pets from earlier levels start off screen and run in when their cousin is picked; this level's pet waits to be befriended
      const PETS = before.map(l => ({ ...EH_PETS[EH_LV[l].pet], x: -99, y: 0, st: 'gone', face: 1, anim: 'idle', t: 0, barkT: 0, spT: 0, cool: 120, vy: 0, stuck: 0 }));
      const po = ents.find(o => (o.type || '').startsWith('companion_'));
      if (po) PETS.push({ ...EH_PETS[LV.pet], x: po.x, y: po.y, st: 'wait', face: -1, anim: 'idle', t: 0, barkT: 0, spT: 0, cool: 120, hinted: false });
      else if (LV.pet === 'eagle') PETS.push({ ...EH_PETS.eagle, x: spawn.x - 24, y: spawn.y - 40, st: 'follow', face: 1, anim: 'glide', t: 0, barkT: 0, spT: 0, cool: 60, vy: 0 });   // the eagle arrives with the ride
      let toast = null; const say = text => { toast = { text, t: 0 }; };
      const heroBox = () => ({ x: H.x + 10, y: H.y + 8, w: 12, h: 23 });
      // enemies share one list; kind decides behaviour, hitbox and sprites
      const E = [
        ...of('enemy_rotroot').map(o => ({ kind: 'rot', x: o.x, y: o.y, x0: o.x - 48, x1: o.x + 40, dir: -1, hp: 2, hurt: 0, dead: 0 })),
        ...of('enemy_mothwing').map(o => ({ kind: 'moth', x: o.x + 16, y: o.y + 16, bx: o.x + 16, by: o.y + 16, x0: o.x - 48, x1: o.x + 80, dir: 1, hp: 1, hurt: 0, dead: 0, st: 'fly', t: 0, cd: 0, tx: 0, ty: 0 })),
        ...of('enemy_sporecap').map(o => ({ kind: 'spore', x: o.x, y: o.y, dir: -1, hp: 2, hurt: 0, dead: 0, st: 'idle', t: 0, cd: 60 })),
        // peaks: ice wolves patrol and lunge, snow sprites hover and lob snowballs, frostlings raise an ice shield against shots from the front
        ...of('enemy_ice_wolf').map(o => ({ kind: 'wolf', x: o.x, y: o.y, x0: o.x - 80, x1: o.x + 80, dir: -1, hp: 2, hurt: 0, dead: 0, st: 'run', t: 0, cd: 60 })),
        ...of('enemy_snow_sprite').map(o => ({ kind: 'sprite', x: o.x + 16, y: o.y + 16, bx: o.x + 16, by: o.y + 16, x0: o.x - 56, x1: o.x + 56, dir: 1, face: 1, hp: 1, hurt: 0, dead: 0, st: 'fly', t: 0, cd: 90 })),
        ...of('enemy_frostling').map(o => ({ kind: 'frost', x: o.x, y: o.y, x0: o.x - 56, x1: o.x + 56, dir: -1, hp: 3, hurt: 0, dead: 0, sh: 0 })),
        // caves: magma slimes hop at you (ice freezes them), ember bats hang and swoop, cinder golems curl into a shell only ice/water cracks
        ...of('enemy_magma_slime').map(o => ({ kind: 'slime', x: o.x, y: o.y, dir: -1, hp: 2, hurt: 0, dead: 0, st: 'idle', t: 0, frz: 0, hy: 0 })),
        ...of('enemy_ember_bat').map(o => ({ kind: 'bat', x: o.x + 16, y: o.y + 16, hx: o.x + 16, hy: o.y + 16, dir: -1, hp: 1, hurt: 0, dead: 0, st: 'hang', t: 0, cd: 0, tx: 0, ty: 0 })),
        ...of('enemy_cinder_golem').map(o => ({ kind: 'golem', x: o.x, y: o.y, x0: o.x - 56, x1: o.x + 56, dir: -1, hp: 3, hurt: 0, dead: 0, sh: 0, crk: 0 })),
        // keep: shadow shades (only light hurts them; anything else makes them fade away and come back), stone gargoyles, hollow knights (light breaks their shield)
        ...of('enemy_shadow_shade').map(o => ({ kind: 'shade', x: o.x + 16, y: o.y + 16, dir: -1, hp: 2, hurt: 0, dead: 0, st: 'fly', t: 0 })),
        ...of('enemy_stone_gargoyle').map(o => ({ kind: 'garg', x: o.x + 16, y: o.y + 16, px: o.x + 16, py: o.y + 16, dir: -1, hp: 3, hurt: 0, dead: 0, st: 'perch', t: 0, tx: 0, ty: 0 })),
        ...of('enemy_rat').map(o => ({ kind: 'rat', sx: o.x, x: o.x, y: o.y, x0: o.x - 96, x1: o.x + 96, dir: -1, hp: 1, hurt: 0, dead: 0, chase: false })),
        ...of('enemy_rat_small').map(o => ({ kind: 'ratling', sx: o.x, x: o.x, y: o.y + 16, dir: 1, hp: 1, hurt: 0, dead: 0 })),
        ...of('enemy_hollow_knight').map(o => ({ kind: 'hknight', x: o.x, y: o.y, x0: o.x - 80, x1: o.x + 80, dir: -1, hp: 4, hurt: 0, dead: 0, sh: 0, atk: 0 })),
      ];
      const EBOX = { rot: e => ({ x: e.x + 9, y: e.y + 12, w: 14, h: 20 }), moth: e => ({ x: e.x - 9, y: e.y - 9, w: 18, h: 14 }), spore: e => ({ x: e.x + 6, y: e.y + 9, w: 20, h: 22 }),
        wolf: e => ({ x: e.x + 5, y: e.y + 14, w: 22, h: 17 }), slime: e => ({ x: e.x + 6, y: e.y + 14 + e.hy, w: 20, h: 17 }), bat: e => ({ x: e.x - 8, y: e.y - 8, w: 16, h: 14 }), golem: e => ({ x: e.x + 5, y: e.y + 10, w: 22, h: 21 }), rat: e => ({ x: e.x + 4, y: e.y + 22, w: 22, h: 9 }), spider: e => ({ x: e.x - 7, y: e.y - 6, w: 14, h: 12 }), wasp: e => ({ x: e.x - 7, y: e.y - 5, w: 14, h: 10 }), ratling: e => ({ x: e.x + 3, y: e.y + 9, w: 18, h: 6 }),
        shade: e => e.st === 'gone' ? { x: -999, y: -999, w: 0, h: 0 } : { x: e.x - 8, y: e.y - 10, w: 16, h: 20 }, garg: e => ({ x: e.x - 9, y: e.y - 9, w: 18, h: 18 }), hknight: e => ({ x: e.x + 10, y: e.y + 8, w: 12, h: 23 }), sprite: e => ({ x: e.x - 9, y: e.y - 9, w: 18, h: 18 }), frost: e => ({ x: e.x + 5, y: e.y + 10, w: 22, h: 21 }) };
      const ebox = e => EBOX[e.kind](e);
      const ICE = [...of('hazard_icicle').map(o => ({ k: 'icicle', x: o.x, y: o.y, y0: o.y, st: 'hang', t: 0, vy: 0 })), ...of('hazard_falling_rock').map(o => ({ k: 'rock', x: o.x, y: o.y, y0: o.y, st: 'hang', t: 0, vy: 0 })), ...of('hazard_chandelier').map(o => ({ k: 'chand', w: 32, x: o.x, y: o.y, y0: o.y, st: 'hang', t: 0, vy: 0 }))];
      // lava bubbles leap out of the lava every 2.2s; frozen lava crust (Vasilije's ice) holds ~3s, cracks, melts back
      const BUB = of('hazard_lava_bubble').map((o, i) => ({ x: o.x, y0: o.y, y: o.y, vy: 0, out: false, t: i * 40 })), CRUST = {};
      // the trap: a gate slams behind Vasilije and lava rises; he climbs out alone (no switching) while the fox runs for help
      const tz = ents.find(o => o.type === 'trap_zone'), cg = ents.find(o => o.type === 'cave_gate');
      const TRAP = tz ? { x0: tz.x, x1: tz.x + tz.width, gate: cg ? { x: cg.x, y: cg.y, st: 'open', t: 0 } : null, st: 'idle', lavaY: 400 } : null;
      // Lava Salamander (caves mid-boss): lives in a lava pool, spits fireballs, dives and resurfaces; falls asleep when beaten
      const so = ents.find(o => o.type === 'boss_lava_salamander'), sa = ents.find(o => o.type === 'sal_arena');
      const SAL = so ? { x: so.x, y: so.y, hp: 12, max: 12, st: 'wait', t: 0, n: 0, dir: -1, hurt: 0, dead: 0, awake: false, name: 'LAVA SALAMANDER', aL: sa ? sa.x : so.x - 320, aR: sa ? sa.x + sa.width : so.x + 320 } : null;
      const salBox = () => ({ x: SAL.x + 6, y: SAL.y + 34, w: 56, h: 29 }), salUp = () => SAL && !SAL.dead && (SAL.st === 'idle' || SAL.st === 'spit' || SAL.st === 'surface' || (SAL.st === 'dive' && SAL.t < 16));
      const bd = (b, boss) => b.el === 'gold' ? Math.ceil(boss.max / 3) : b.dmg;   // damage a shot does to a boss (Vera: three hits for any boss)
      const mrakDown = () => { MRAK.dead = 1; MRAK.st = 'defeat'; MRAK.waves = []; MRAK.orbs = []; MRAK.roots = []; MRAK.spikes = []; MRAK.spots = []; MRAK.beamT = 40; };
      // toys (level 5): find them all in 60 seconds
      const TOYS = of('toy').map(o => ({ k: o.name, x: o.x, y: o.y, got: false }));
      const TIMER = LV.toys || LV.cat ? { left: 60 * 60, st: 'run', t: 0 } : null;
      const MARIJA = { on: false, x: 0, y: GROUND_Y - 32, t: 0 };
      if (TIMER && LV.timer) TIMER.left = LV.timer * 60;
      // Mishika: hides twice when Mita gets close (hide, then she is at the next spot); the third time she leaps into his arms
      const SPOTS = of('cat_spot').sort((a, b) => a.name.localeCompare(b.name)), CAT = SPOTS.length ? { i: 0, x: SPOTS[0].x, y: SPOTS[0].y, st: 'sit', t: 0 } : null;
      const ROPES = of('rope').map(o => ({ x: o.x, y: o.y, a: 0.2, w: 0 })), HATCH = ents.find(o => o.type === 'hatch');
      const WASP_HOMES = [[14, 70], [31, 60], [48, 64], [60, 90]], ROPE_L = 176, ropeKnot = r => ({ x: r.x + Math.sin(r.a) * ROPE_L, y: r.y + Math.cos(r.a) * ROPE_L });   // the rope is a pendulum: a = angle, w = swing speed
      const FIREB = [], TRIG = of('story_trigger'), SB = {};   // SB: shadow-bridge tiles lit by light shots
      // the eagle ride up the cliff plays before the keep level starts
      const RIDE = LV.ride ? { t: 0, on: true } : null;
      // Umbra, spellbound: a short duel; light stuns him; when beaten the spell breaks, he kneels and joins
      const uo = ents.find(o => o.type === 'npc_umbra');
      const UMB = uo ? { x: uo.x, y: uo.y, hp: 6, st: 'wait', t: 0, dir: -1, hurt: 0, stun: 0 } : null;
      const umbBox = () => ({ x: UMB.x + 10, y: UMB.y + 8, w: 12, h: 23 }), umbFight = () => UMB && ['idle', 'dash', 'attack'].includes(UMB.st);
      // Mrak, the Hollow King: phase 1 shadow (wave, homing orbs), phase 2 the wardens' powers (roots, ice spikes, lava wave),
      // phase 3 together: only the four cousins' stones hurt him; when all four have hit him the braided beam staggers him (three times), then Kosta finishes it
      const mko = ents.find(o => o.type === 'boss_mrak'), cgo2 = ents.find(o => o.type === 'baba_cage');
      const MRAK = mko ? { x: mko.x, y: mko.y, hp: 30, max: 30, ph: 1, st: 'idle', t: 60, n: 0, hurt: 0, dead: 0, awake: false, name: 'MRAK', waves: [], orbs: [], roots: [], spikes: [], spots: [], lit: new Set(), stag: 0, beamT: 0,
        cage: cgo2 ? { x: cgo2.x, y: cgo2.y, st: 'locked', t: 0 } : null } : null;
      const mBody = () => ({ x: MRAK.x + 36, y: MRAK.y + 24, w: 56, h: 103 }), mCore = () => ({ x: MRAK.x + 59, y: MRAK.y + 55, w: 9, h: 9 });   // hang, wobble 0.6s when the hero passes below, fall, shatter, grow back
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
      // Snow Yeti Cub (peaks mid-boss): a grumpy cub guarding the bridge. Walks at you, stomps (snow falls), throws a big snowball. Sits down and sulks when beaten.
      const yo = ents.find(o => o.type === 'boss_yeti_cub'), ya = ents.find(o => o.type === 'yeti_arena');
      const YETI = yo ? { x: yo.x, y: yo.y, sx: yo.x, hp: 8, max: 8, st: 'wait', t: 0, n: 0, dir: -1, hurt: 0, dead: 0, awake: false, name: 'YETI CUB', aL: ya ? ya.x : yo.x - 320, aR: ya ? ya.x + ya.width : yo.x + 320 } : null;
      const yetiBox = () => ({ x: YETI.x + 14, y: YETI.y + 18, w: 36, h: 46 });
      // Frost Warden (peaks boss): ice spike line / freezing breath; the chest crack is the weak point and takes double damage while it glows
      const fo = ents.find(o => o.type === 'boss_frost_warden' || o.type === 'boss_magma_colossus'), MC = fo && fo.type === 'boss_magma_colossus';   // Magma Colossus: same rig, lava wave + molten rain
      const FW = fo ? { x: fo.x, y: fo.y, hp: 24, max: 24, st: 'idle', t: 60, n: 0, hurt: 0, dead: 0, awake: false, spots: [], spikes: [], breath: null, waves: [], rain: [], name: MC ? 'MAGMA COLOSSUS' : 'FROST WARDEN' } : null;
      const fwBody = () => ({ x: FW.x + 20, y: FW.y + 12, w: 58, h: 83 }), fwWeak = () => MC ? { x: FW.x + 42, y: FW.y + 45, w: 13, h: 15 } : { x: FW.x + 43, y: FW.y + 38, w: 12, h: 28 };   // flipped: it faces left
      const fwGlow = () => FW.st !== 'idle' || FW.hurt > 0;
      const FW_ANG = 0.5, fwMouth = () => ({ x: FW.x + 27, y: FW.y + 29 });   // the breath cone angles down to reach the ground
      const SNOW = [], BIGS = []; let shake = 0;
      const floorAt = (x, y) => surface(x, Math.floor((y + 32) / 32)) != null;
      // a finished run: coins and gems picked up, the totals, and the time from level start to the exit (seconds of play; pauses and dialogues don't count)
      const runStats = () => ({ gems: GM.filter(g => g.got).length, gemTotal: GM.length, coinsGot: C.filter(c => c.got).length, coinTotal: C.length, time: Math.round(tick / 6) / 10 });
      let tick = 0, lastHud = '';
      const told = new Set(), story = id => { if (!told.has(id)) { told.add(id); onStory && onStory(id); } };   // each story moment plays once per run
      const hurt = dir => { if (H.inv > 0 || H.dead) return; H.hp -= 0.5; H.hurtT = 16; H.inv = 70; H.vx = -2 * dir; H.vy = -3; H.ground = false; if (H.hp <= 0) { H.dead = 1; H.vx = 0; } };
      const drawStrip = (im, n, f, x, y, w, flip) => { if (!im) return; f = Math.max(0, Math.min(n - 1, Math.floor(f))); ctx.save(); ctx.translate(Math.round(x) + (flip ? w : 0), Math.round(y)); ctx.scale(flip ? -1 : 1, 1); ctx.drawImage(im, f * w, 0, w, im.height, 0, 0, w, im.height); ctx.restore(); };
      const drawLayer = lay => { if (!lay) return; const c0 = Math.max(0, Math.floor(cam / 32)), c1 = Math.min(MW, c0 + 22);
        for (let r = 0; r < MH; r++) for (let c = c0; c < c1; c++) { const i = r * MW + c; let id = lay.id[i]; if (id < 0) continue;
          const an = T.anim[id]; if (an) id = an[0] + (Math.floor(tick / an[2]) % an[1]); if (id === T.bounce[0] && bounceT[i] != null) id = T.bounce[1 + Math.min(3, Math.floor(bounceT[i] / 5))]; else if (T.bounce2 && id === T.bounce2[0] && bounceT[i] != null) id = T.bounce2[1 + Math.min(3, Math.floor(bounceT[i] / 5))];
          const sx = (id % 8) * 32, sy = Math.floor(id / 8) * 32;
          if (lay.flip[i]) { ctx.save(); ctx.translate(c * 32 + 32, r * 32); ctx.scale(-1, 1); ctx.drawImage(img.tiles, sx, sy, 32, 32, 0, 0, 32, 32); ctx.restore(); }
          else ctx.drawImage(img.tiles, sx, sy, 32, 32, c * 32, r * 32, 32, 32); } };
      const resetBosses = () => {
        if (ELD && !ELD.dead) { Object.assign(ELD, { x: ELD.sx, hp: ELD.max, st: 'wait', t: 0, awake: false, hurt: 0 }); gates[0].st = 'open'; SEEDS.length = 0; }
        if (BOSS && !BOSS.dead) Object.assign(BOSS, { hp: BOSS.max, state: 'idle', t: 0, awake: false, spots: [], roots: [] });
        if (FW && !FW.dead) Object.assign(FW, { hp: FW.max, st: 'idle', t: 60, awake: false, spots: [], spikes: [], breath: null, waves: [], rain: [] });
        if (YETI && !YETI.dead) Object.assign(YETI, { x: YETI.sx, hp: YETI.max, st: 'wait', t: 0, awake: false }), BIGS.length = 0;
        if (SAL && !SAL.dead) Object.assign(SAL, { hp: SAL.max, st: 'wait', t: 0, awake: false }), FIREB.length = 0;
        if (MRAK && !MRAK.dead) Object.assign(MRAK, { hp: Math.max(MRAK.hp, MRAK.ph === 3 ? 10 : MRAK.ph === 2 ? 20 : 30), st: MRAK.ph === 3 ? 'laugh' : 'idle', t: 60, waves: [], orbs: [], roots: [], spikes: [], spots: [], lit: new Set() });
        if (UMB && umbFight()) Object.assign(UMB, { hp: 6, st: 'wait', t: 0 });
        if (TRAP && TRAP.st !== 'done') { TRAP.st = 'idle'; TRAP.lavaY = 400; if (TRAP.gate) TRAP.gate.st = 'open'; }
      };
      const damage = (e, dmg) => { e.hp -= dmg; e.hurt = 14; if (e.hp <= 0) { e.dead = 1; if (e.kind === 'spore') fx('fx_spore_burst', 4, 12, e.x + 8, e.y + 10, 16); } else if (EH_SHIELD[e.kind]) e.sh = 0; };

      const step = () => {
        tick++;
        if (RIDE && RIDE.on) { RIDE.t++; if (RIDE.t === 1) { const CH = ROSTER[H.hero]; onHud({ hp: H.hp, coins: H.coins, element: CH.el, name: CH.name }); } if (RIDE.t === 50) story(LV.id + '_start'); if (RIDE.t >= 230) RIDE.on = false; return; }   // the eagle carries Kosta up the cliff
        if (tick === 1 && !RIDE) story(LV.id + '_start');
        if (TIMER) {
          if (TIMER.st === 'run') { if (--TIMER.left <= 0) { TIMER.left = 0; TIMER.st = LV.cat ? 'timeup' : 'lost'; TIMER.t = 0; if (!LV.cat) { MARIJA.on = true; MARIJA.x = Math.min(cam + 560, H.x + 220); } } }
          else if (TIMER.st === 'timeup') { TIMER.t++; if (TIMER.t === 2) story('l6_lost'); if (TIMER.t === 4) onEnd('timeup', 0, { carrying: !!H.carry }); return; }
          else if (TIMER.st === 'lost') {   // grandma Marija shuffles in, counts what was left, and the level starts again
            TIMER.t++; if (MARIJA.x > H.x + 70) MARIJA.x -= 0.6;
            if (TIMER.t === 150) { const left = TOYS.filter(t => !t.got), sr = window.EH_LANG === 'sr', names = left.slice(0, 4).map(t => (EH_TOY_NAMES[t.k] || [t.k, t.k])[sr ? 1 : 0]);
              const list = names.length > 1 ? names.slice(0, -1).join(', ') + (sr ? ' i ' : ' and ') + names[names.length - 1] + (left.length > 4 ? (sr ? ' i još' : ' and more') : '') : names[0];
              EH_DIALOGUE.l5_lost = [
                { who: 'marija', mood: 'grumpy', text: sr ? 'Deco, opet ste ostavili igračke!' : 'Kids, you left toys out again!' },
                { who: 'marija', mood: 'grumpy', text: sr ? `Našla sam ${left.length}: ${list}.` : `I found ${left.length}: ${list}.` },
                { who: 'marija', mood: 'laughing', text: sr ? 'Samo da znate, njih više nema. Možete da im kažete zbogom!' : "Just so you know, they're gone. You can say goodbye to them!" },
                { who: 'ruby', mood: 'worried', text: sr ? 'Brzo, hajde ponovo pre nego što nađe još!' : 'Quick, let’s try again before she finds more!' }];
              story('l5_lost'); }
            if (TIMER.t === 152) onEnd('retry');
            return; }
          else if (TIMER.st === 'won') { TIMER.t++; if (TIMER.t === 2) story(LV.cat ? 'l6_win' : 'l5_win'); if (TIMER.t === 4) onEnd('complete', 0, { ...runStats(), toys: TOYS.length }); return; }
        }
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
          if (H.hurtT <= 0) { let tv = ((R1 ? 1.8 : 0) - (L1 ? 1.8 : 0)) * (H.slowT > 0 ? 0.5 : 1); if (tv) H.face = Math.sign(tv); if (H.attackT > 0 && H.ground) tv *= 0.3;
            H.vx = H.ice && H.ground ? H.vx + (tv - H.vx) * 0.06 : tv; }   // packed ice: the hero slides a little
          if (jumpBuf > 0) jumpBuf--; if (spaceBuf > 0) spaceBuf--;
          if ((keys.Space || keys.ArrowUp || keys.KeyW || jumpBuf > 0) && H.ground && H.hurtT <= 0) { jumpBuf = 0; H.vy = -8.3; H.ground = false; H.jumpT = tick; H.jumpV = -8.3; fx('fx_dust_jump', 4, 16, H.x, H.y + 31 - 16, 32); }
          if ((keys.KeyJ || keys.KeyF || keys.KeyX) && H.attackT <= 0 && H.hurtT <= 0 && !H.carry) { H.attackT = 24; H.fired = false; }
          if (cycle) { wantHero = (H.hero + cycle + ROSTER.length) % ROSTER.length; cycle = 0; }
          if (TRAP && TRAP.st === 'rising' && typeof wantHero === 'string') wantHero = -1;
          if (TRAP && TRAP.st === 'rising' && wantHero >= 0 && wantHero !== H.hero) { wantHero = -1; say(window.EH_LANG === 'sr' ? 'VASILIJE JE SAM! PENJI SE!' : 'VASILIJE IS ON HIS OWN! CLIMB!'); }
          if (typeof wantHero === 'string') { const n = +wantHero.slice(1); wantHero = n <= 4 ? n - 1 : ROSTER.findIndex(r => r.key === n); }   // keys 1-4 cousins, 5 Ruby, 6 Vera (when unlocked)
          if (wantHero >= 0 && wantHero < ROSTER.length && wantHero !== H.hero) { H.hero = wantHero; H.swapT = 40; H.attackT = 0; fx('i_' + ROSTER[wantHero].el, 4, 12, H.x, H.y, 32); }
          wantHero = -1;
        }
        if (H.attackT > 0) { H.attackT--; if (!H.fired && H.attackT <= 12) { H.fired = true;
          B.push({ x: H.x + (H.face > 0 ? 26 : -10), y: H.y + (HR.kid ? 14 : 10), vx: PW.v * H.face, vy: PW.arc ? (PW.vy || -3.2) : 0, g: PW.g || 0.2, t: 0, el: HR.el, who: HR.id, dmg: PW.dmg, arc: !!PW.arc, pierce: !!PW.pierce && !LV.cat, bomb: !!PW.bomb, hit: new Set() }); } }
        if (H.hurtT > 0) H.hurtT--; if (H.inv > 0) H.inv--; if (H.landT > 0) H.landT--; if (H.swapT > 0) H.swapT--; if (H.slowT > 0) H.slowT--;
        // ---- hero physics ----
        if (!H.dead && !H.rope) {
          if (H.boost && !H.ground) { H.vx += H.boost; H.boost *= 0.95; if (Math.abs(H.boost) < 0.1) H.boost = 0; } else if (H.ground) H.boost = 0;
          H.vy = Math.min(7, H.vy + 0.35);
          const nx = H.x + H.vx; const edge = H.vx > 0 ? nx + 22 : nx + 10;
          if (!(T.solid.has(tileAt(edge, H.y + 14)) || T.solid.has(tileAt(edge, H.y + 24)))) H.x = Math.min(LW - 20, Math.max(-8, nx));
          for (const g of gates) if (g.st !== 'open') { const hb = heroBox(); if (hb.x < g.x + 32 && hb.x + hb.w > g.x) H.x = H.x + 16 < g.x + 16 ? g.x - 22 : g.x + 32 - 10; }
          if (BOSS && !BOSS.dead) { H.x = Math.min(H.x, bossBody().x - 26); if (BOSS.awake) H.x = Math.max(H.x, finalL - 4); }
          if (FW && !FW.dead) { H.x = Math.min(H.x, fwBody().x - 26); if (FW.awake) H.x = Math.max(H.x, finalL - 4); }
          if (MRAK && !MRAK.dead) { H.x = Math.min(H.x, mBody().x - 26); if (MRAK.awake) H.x = Math.max(H.x, finalL - 4); }
          if (TRAP && TRAP.gate && TRAP.gate.st !== 'open') { const g = TRAP.gate; if (H.x + 10 < g.x + 32 && H.x + 22 > g.x && H.y + 31 > g.y) H.x = g.x + 32 - 10; }
          if (TRAP && TRAP.st === 'rising') H.x = Math.max(TRAP.x0 + 22, H.x);
          if (SAL && SAL.awake && !SAL.dead) H.x = Math.max(SAL.aL - 4, Math.min(SAL.aR - 26, H.x));
          if (YETI && YETI.awake && !YETI.dead) H.x = Math.max(YETI.aL - 4, Math.min(YETI.aR - 26, H.x));   // the bridge fight holds you on screen
          const prevFeet = H.y + 31; let ny = H.y + H.vy; let feet = ny + 31; let best = null;
          if (H.vy >= 0) for (const px of [H.x + 12, H.x + 16, H.x + 20]) for (let ty = Math.floor((prevFeet - 8) / 32); ty <= Math.floor((feet + (H.ground ? 6 : 0)) / 32); ty++) {
            const s = surface(px, ty); if (s == null) continue; const id = tileAt(px, ty * 32);
            const okTop = T.plat.has(id) ? prevFeet <= s + 1 : s >= prevFeet - 8;
            if (okTop && s <= feet + (H.ground ? 6 : 0) && (best == null || s < best)) best = s;
          }
          if (best != null) { if (!H.ground && H.vy > 3) { H.landT = 8; fx('fx_dust_land', 4, 16, H.x, best - 16, 32); } H.y = best - 31; H.vy = 0; H.ground = true;
            const under = tileAt(H.x + 16, H.y + 33); if (T.solid.has(under) && !T.noSafe(under) && !T.feetHaz.includes(tileAt(H.x + 16, H.y + 30))) safe = { x: H.x, y: H.y };
            H.ice = T.ice.has(under);
            const row = Math.floor((H.y + 33) / 32) * MW;
            for (const px of [H.x + 12, H.x + 16, H.x + 20]) { const i = row + Math.floor(px / 32), id = ground[i];
              // bounce mushroom: the tileset says 2x jump velocity, which would fly off the top of the 360px view, so it's ~1.45x (about 6 tiles)
              if (T.bounce.includes(id) || (T.bounce2 && T.bounce2.includes(id))) { H.vy = T.bounce2 && T.bounce2.includes(id) ? -13 : -12; H.ground = false; H.jumpT = tick; H.jumpV = H.vy; bounceT[i] = 0; fx('fx_dust_jump', 4, 16, H.x, H.y + 15, 32); break; }
              if (T.crumble.indexOf(id) >= 0 && T.crumble.indexOf(id) < 3 && crumble[i] == null) crumble[i] = 0; } }
          else { H.y = ny; H.ground = false; }
          if (H.vy < 0 && T.solid.has(tileAt(H.x + 16, H.y + 8))) { H.vy = 0; }
          // hazards / water / exit
          // spikes/brambles (26-28) only hurt what lands on or walks into them (feet level, not while rising);
          // hanging thorns (29) and fire-jet flames (36) hurt on any touch
          const feetHaz = tileAt(H.x + 16, H.y + 30), bodyHaz = [tileAt(H.x + 16, H.y + 16), tileAt(H.x + 16, H.y + 26)];
          if ((H.vy >= 0 && T.feetHaz.includes(feetHaz)) || bodyHaz.some(t => T.bodyHaz.includes(t))) hurt(H.face);
          const tw = tileAt(H.x + 16, H.y + 28);
          if (T.water.includes(tw)) { if (T.lava) fx('fx_lava_splash', 4, 14, H.x, GROUND_Y - 16, 32); else fx('fx_splash_water', 5, 14, H.x, GROUND_Y - 32, 32); H.inv = 0; hurt(1); if (!H.dead) Object.assign(H, safe, { vx: 0, vy: 0, inv: 70 }); }
          if (H.y > 380) { H.hp = 0; H.dead = 1; }
          if (ex && (!BOSS || BOSS.dead > 70) && (!FW || FW.dead > 70) && overlap(heroBox(), { x: ex.x + 15, y: ex.y + 20, w: 34, h: 75 })) onEnd('complete', H.coins, runStats());
        }
        if (TIMER && TIMER.st === 'run' && !H.dead) TOYS.forEach(t => { if (!t.got && Math.abs(H.x + 16 - (t.x + 8)) < 16 && Math.abs(H.y + 20 - (t.y + 8)) < 20) { t.got = true; fx('fx_toy_pickup', 6, 14, t.x - 8, t.y - 8, 32);
            if (TOYS.every(x => x.got)) { TIMER.st = 'won'; TIMER.t = 0; } } });
        if (CAT && TIMER && TIMER.st === 'run') { CAT.t++;
          if ((CAT.st === 'sit' || CAT.st === 'idle') && !H.dead && Math.abs(H.x - CAT.x) < 64 && Math.abs(H.y - CAT.y) < 48) { CAT.st = CAT.i < SPOTS.length - 1 ? 'hide' : 'found'; CAT.t = 0; }
          else if (CAT.st === 'hide' && CAT.t >= 24) { CAT.i++; CAT.x = SPOTS[CAT.i].x; CAT.y = SPOTS[CAT.i].y; CAT.st = 'sit'; CAT.t = 0; say(window.EH_LANG === 'sr' ? 'MIŠIKA JE POBEGLA! TRAŽI DALJE!' : 'MISHIKA RAN OFF! KEEP LOOKING!'); }
          else if (CAT.st === 'found' && CAT.t >= 30) { CAT.st = 'carried'; H.carry = true; TIMER.left = LV.timer * 60; story('l6_found');
            // the attic wakes up: the rats come back, spiders drop from the ceiling, wasps leave their nest
            E.forEach(e => { if ((e.kind === 'rat' || e.kind === 'ratling') && e.dead) Object.assign(e, { dead: 0, hurt: 0, hp: 1, x: e.sx, chase: false }); });
            [9, 18, 27, 34, 45, 51, 59].forEach(c => E.push({ kind: 'spider', x: c * 32 + 16, y: 40, top: 40, low: 150 + (c % 3) * 30, st: 'up', t: (c * 17) % 90, dir: 1, hp: 1, hurt: 0, dead: 0 }));
            WASP_HOMES.forEach(([c, y]) => E.push({ kind: 'wasp', x: c * 32, y, bx: c * 32, by: y, t: c * 7, dir: -1, hp: 1, hurt: 0, dead: 0 }));
            say(window.EH_LANG === 'sr' ? 'PAZI! PAUCI I OSE!' : 'WATCH OUT! SPIDERS AND WASPS!'); } }
        if (H.carry && HATCH && TIMER && TIMER.st === 'run' && !H.dead && overlap(heroBox(), { x: HATCH.x, y: HATCH.y - 40, w: 64, h: 48 })) { TIMER.st = 'won'; TIMER.t = 0; }
        ROPES.forEach(r => { r.w += -0.0016 * Math.sin(r.a); r.w *= H.rope === r ? 0.997 : 0.99; r.a = Math.max(-0.75, Math.min(0.75, r.a + r.w)); if (H.rope !== r && Math.abs(r.a) < 0.02 && Math.abs(r.w) < 0.002) r.w += 0.004; });
        if (ROPES.length && !H.dead) { if (H.ropeCd > 0) H.ropeCd--;
          if (!H.rope && !H.ground && !(H.ropeCd > 0)) for (const r of ROPES) { const kn = ropeKnot(r); if (overlap(heroBox(), { x: kn.x - 10, y: kn.y - 30, w: 20, h: 40 })) { H.rope = r; r.w += (H.vx || 0) / ROPE_L * 0.6; jumpBuf = spaceBuf = 0; break; } }
          if (H.rope) { const r = H.rope, kn = ropeKnot(r); H.x = kn.x - 16; H.y = kn.y - 20; H.vy = 0; H.ground = false;   // hanging on: left/right pumps the swing, Space jumps off with the swing's speed, down drops
            const R = keys.ArrowRight || keys.KeyD, L = keys.ArrowLeft || keys.KeyA; if (R) { r.w += 0.0007; H.face = 1; } if (L) { r.w -= 0.0007; H.face = -1; }
            if (spaceBuf > 0) { jumpBuf = spaceBuf = 0; H.rope = null; H.ropeCd = 20; const v = r.w * ROPE_L; H.vy = -6.5 - Math.abs(v) * 0.4; H.boost = Math.max(-3.5, Math.min(3.5, v * Math.cos(r.a) * 0.9 + (R ? 0.8 : L ? -0.8 : 0))); }
            else if (keys.ArrowDown || keys.KeyS) { H.rope = null; H.ropeCd = 25; } } }
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
          say(window.EH_LANG === 'sr' ? EH_SR_HINT.joined(EH_KNIGHTS[s.el].toUpperCase()) : `${EH_KNIGHTS[s.el].toUpperCase()} JOINED · Q / E TO SWITCH`); story(LV.id + '_knight_' + s.el); } });
        for (const PUP of PETS) {
          PUP.t++;
        // the puppy runs on the ground like the heroes: gravity, landing, hops over walls and pits (the eagle will just fly)
        const pupStep = (vx, wantUp, dropDown) => {
          const land = y => { const ty = Math.floor((y + 32) / 32); for (const t of [ty, ty + 1]) { const g = surface(PUP.x + 16, t); if (g == null || (dropDown && T.plat.has(tileAt(PUP.x + 16, t * 32)))) continue; if (y + 32 >= g - 1 && y + 32 <= g + 8) return g; } return null; };
          const d = Math.sign(vx), ax = d < 0 ? PUP.x + 6 : PUP.x + 26;
          if (vx && !T.solid.has(tileAt(ax + vx, PUP.y + 20)) && !T.solid.has(tileAt(ax + vx, PUP.y + 6))) PUP.x += vx;
          const g0 = PUP.vy >= 0 ? land(PUP.y) : null; PUP.gr = g0 != null;
          if (PUP.gr) { PUP.y = g0 - 32; PUP.vy = 0;
            const wall = d && (T.solid.has(tileAt(ax + d * 6, PUP.y + 20)) || T.solid.has(tileAt(ax + d * 6, PUP.y + 6)));
            const gap = d && (() => { const fx2 = PUP.x + 16 + d * 36; for (let t = Math.floor((PUP.y + 32) / 32); t < MH; t++) { const id = tileAt(fx2, t * 32); if (T.water.includes(id)) return true; if (surface(fx2, t) != null) return false; } return true; })();   // a pit or water: hop it; a ledge: just drop down
            if (wantUp) PUP.vy = wantUp; else if (wall || gap) PUP.vy = -8.3; }
          else { PUP.vy = Math.min(7, PUP.vy + 0.35); if (PUP.vy < 0 && T.solid.has(tileAt(PUP.x + 16, PUP.y + PUP.vy))) PUP.vy = 0; }
          PUP.y += PUP.vy;
        };
          if (PUP.fly) {   // the golden eagle: flies, never lands; scouts for hidden ledges and marks them
            const own = ROSTER[H.hero].id === PUP.owner;
            if (!own && PUP.st !== 'gone') { PUP.st = 'away'; PUP.mark = null; PUP.x -= 4; PUP.y -= 1.5; PUP.face = -1; PUP.anim = 'fly'; if (PUP.x < cam - 48 || PUP.y < -40) PUP.st = 'gone'; continue; }
            if (!own) continue;
            if (PUP.st !== 'follow') { PUP.st = 'follow'; PUP.x = cam - 40; PUP.y = H.y - 60; }
            let tx, ty;
            if (PUP.mark != null) { tx = (PUP.mark % MW) * 32; ty = Math.floor(PUP.mark / MW) * 32 - 24;
              if (Math.hypot(tx - PUP.x, ty - PUP.y) < 8) { const r = Math.floor(PUP.mark / MW); let c = PUP.mark % MW; while (c > 0 && ground[r * MW + c - 1] === 33) c--;
                for (; c < MW && ground[r * MW + c] === 33; c++) { ground[r * MW + c] = 34; fx('fx_eagle_mark', 6, 10, c * 32 + 8, r * 32 - 12, 16); } PUP.mark = null; PUP.cool = 40; } }
            else { tx = H.x - 20 * H.face; ty = H.y - 40 + Math.sin(PUP.t / 20) * 4;
              if (T.hidden && --PUP.cool <= 0) { PUP.cool = 30; let best = null, bd = 1e9;   // any hidden ledge on screen?
                for (let c = Math.max(0, Math.floor(cam / 32)); c < Math.min(MW, Math.floor(cam / 32) + 21); c++) for (let r = 0; r < MH; r++) if (ground[r * MW + c] === 33) { const d = Math.abs(c * 32 - H.x); if (d < bd) { bd = d; best = r * MW + c; } }
                if (best != null && bd < 260) PUP.mark = best; } }
            const ddx = tx - PUP.x, ddy = ty - PUP.y, d = Math.hypot(ddx, ddy), sp = PUP.mark != null ? 4 : Math.min(5, d * 0.1);
            if (d > 700) { PUP.x = tx; PUP.y = ty; } else if (d > 0.5) { PUP.x += ddx / d * sp; PUP.y += ddy / d * sp; }
            if (Math.abs(ddx) > 2) PUP.face = Math.sign(ddx); PUP.anim = sp > 1.5 ? 'fly' : 'glide';
            continue;
          }
          if (PUP.st === 'follow' && T.solid.has(tileAt(PUP.x + 16, PUP.y + 16)) && !H.dead) { fx('fx_dust_land', 4, 12, H.x - 18 * H.face - 8, H.y + 4, 32); PUP.x = H.x - 18 * H.face; PUP.y = H.y - 1; PUP.vy = 0; }
          const isOwner = ROSTER[H.hero].id === PUP.owner && !(TRAP && TRAP.st === 'rising');   // in the trap the fox runs off to fetch the others
          if (PUP.st === 'wait') { if (!H.dead && Math.abs(H.x - PUP.x) < 48 && Math.abs(H.y - PUP.y) < 40) {
              if (isOwner) { PUP.st = 'follow'; story(LV.id + '_' + PUP.id); } else if (!PUP.hinted) { PUP.hinted = true; say(window.EH_LANG === 'sr' ? EH_SR_HINT.petWaits[PUP.id] : `THE ${PUP.id.toUpperCase()} WAITS FOR ${PUP.ownerName} · PRESS ${PUP.key}`); } } }
          else if (!isOwner && PUP.st !== 'gone') {   // not the owner: run off the left edge of the screen
            if (PUP.st !== 'away') { PUP.st = 'away'; PUP.vy = 0; }
            PUP.barkT = 0; PUP.spT = 0; PUP.face = -1;
            const px0 = PUP.x; pupStep(-3.2, false);
            PUP.blk = PUP.x === px0 ? (PUP.blk || 0) + 1 : 0;   // blocked by a wall it can't hop: just slip away
            if (PUP.x < cam - 48 || PUP.blk > 20) { PUP.st = 'gone'; PUP.blk = 0; }
          }
          else if (!isOwner) { /* gone: off screen until the owner is back */ }
          else {
            if (PUP.st === 'gone') {   // run back in from the left, standing on the open ground there nearest the hero's height
              PUP.x = cam - 40; let best = null;
              for (let t = 1; t < MH; t++) { const g = surface(PUP.x + 16, t); if (g != null && !T.solid.has(tileAt(PUP.x + 16, (t - 1) * 32)) && (best == null || Math.abs(g - H.y - 32) < Math.abs(best - H.y - 32))) best = g; }
              if (best == null || Math.abs(best - H.y - 32) > 96) { PUP.x = H.x - 18 * H.face; best = H.y + 31; }   // no ground at the edge near the hero: appear beside the hero instead
              PUP.y = best - 32; PUP.vy = 0; PUP.stuck = 0; }   // re-enter standing on the ground   // owner is back: run in from the left
            PUP.st = 'follow'; if (PUP.vy == null) { PUP.vy = 0; PUP.stuck = 0; }
            const tx = H.x - 18 * H.face, dx = tx - PUP.x, far = Math.abs(dx) > 700 || Math.abs(H.y - PUP.y) > 200;
            if (far || (PUP.stuck = PUP.stuck || 0, PUP.stuck = Math.abs(dx) > 60 || H.y - 1 - PUP.y < -40 ? PUP.stuck + 1 : 0) > 240) { const puff = () => { fx('fx_dust_land', 4, 12, PUP.x - 8, PUP.y + 4, 32); fx('fx_dust_land', 4, 12, PUP.x + 8, PUP.y + 4, 32); }; puff(); PUP.x = tx; PUP.y = H.y - 1; PUP.vy = 0; PUP.stuck = 0; puff(); }   // lost or stuck: catch up
            if (PUP.spT > 0 && PUP.skill === 'fetch') {   // fox: lean, dash through the air to a coin, snap it up, drop back down
              PUP.spT++; const c = PUP.fetch;
              if (c && !c.got && PUP.spT > 6) { const ddx = c.x - 8 - PUP.x, ddy = c.y - 16 - PUP.y, d = Math.hypot(ddx, ddy); PUP.face = Math.sign(ddx) || PUP.face;
                if (d < 10) { c.got = true; H.coins++; fx('fx_coin', 4, 14, c.x, c.y, 16); PUP.fetch = null; PUP.spT = 18; PUP.vy = 0; } else { PUP.x += ddx / d * 5; PUP.y += ddy / d * 5; } }
              else if (!c || c.got) { PUP.fetch = null; if (PUP.spT >= 30) PUP.spT = 0; pupStep(0, 0, false); }
              if (PUP.spT > 120) { PUP.spT = 0; PUP.fetch = null; }
              PUP.anim = 'special';
            } else if (PUP.spT > 0) {   // cheetah pounce: crouch, leap at the enemy (frames 1-2), bite, settle
              PUP.spT++; const fr = Math.floor(PUP.spT / 6);
              if (PUP.spT === 6 && PUP.target) { const tb = ebox(PUP.target); PUP.leap = Math.max(-7, Math.min(7, (tb.x + tb.w / 2 - 16 * PUP.face - PUP.x - 16 + 16 * PUP.face) / 12)); }
              if ((fr === 1 || fr === 2) && PUP.leap && !T.solid.has(tileAt(PUP.x + 16 + PUP.leap + 12 * PUP.face, PUP.y + 20))) PUP.x += PUP.leap;
              if (PUP.spT === 15 && PUP.target && !PUP.target.dead && overlap({ x: PUP.x + 4, y: PUP.y + 10, w: 24, h: 20 }, ebox(PUP.target))) { damage(PUP.target, 1); fx('fx_hit_spark', 3, 18, PUP.x + 16 + 8 * PUP.face, PUP.y + 12, 16); }
              if (PUP.spT >= 24) PUP.spT = 0; pupStep(0, 0, false); PUP.anim = 'special';
            } else {
              const sp = Math.abs(dx) > 80 ? 3.6 : 2.4, vx = Math.abs(dx) > 6 ? Math.max(-sp, Math.min(sp, dx * 0.12)) : 0;
              // hop up after the owner when he is higher up and close by; drop through one-way ledges when he is below
              const hf = H.y + 31 - (PUP.y + 32), down = H.ground && hf > 40;   // hf: owner's feet vs the puppy's
              // jump with Dimitrije: same jump, a moment after him (a mushroom bounce too, if the puppy is on it)
              const up = H.jumpT != null && tick - H.jumpT >= 4 && tick - H.jumpT <= 10 && PUP.lastJ !== H.jumpT && Math.abs(H.x - PUP.x) < 120 ? (PUP.lastJ = H.jumpT, H.jumpV) : 0;
              pupStep(vx, up, down);
              if (Math.abs(dx) > 2) PUP.face = Math.sign(dx);
              PUP.anim = !PUP.gr ? 'jump' : vx ? 'run' : 'idle';
              if (PUP.skill === 'fetch' && PUP.gr && --PUP.cool <= 0) {   // a coin that is up high and close by
                const c = C.filter(c => !c.got && Math.abs(c.x - PUP.x - 16) < 170 && c.y < PUP.y - 30 && PUP.y - c.y < 200).sort((a, b) => Math.abs(a.x - PUP.x) - Math.abs(b.x - PUP.x))[0];
                if (c) { PUP.fetch = c; PUP.spT = 1; PUP.cool = 150; } else PUP.cool = 20; }
              if (PUP.skill === 'pounce' && PUP.gr && --PUP.cool <= 0) {
                const tgt = E.filter(e => !e.dead && Math.abs(ebox(e).x + ebox(e).w / 2 - PUP.x - 16) < 110 && Math.abs(ebox(e).y + ebox(e).h - PUP.y - 32) < 40).sort((a, b) => Math.abs(a.x - PUP.x) - Math.abs(b.x - PUP.x))[0];
                if (tgt) { PUP.target = tgt; PUP.leap = 0; PUP.face = Math.sign(ebox(tgt).x + ebox(tgt).w / 2 - PUP.x - 16) || PUP.face; PUP.spT = 1; PUP.cool = 150; } else PUP.cool = 10; }
            }
            if (PUP.skill !== 'bark') {}
            else if (PUP.barkT > 0) { if (++PUP.barkT > 24) PUP.barkT = 0; if (PUP.barkT === 18) GM.forEach(g => { if (!g.got && Math.hypot(g.x - PUP.x, g.y - PUP.y) < 140) fx('fx_heart', 5, 14, g.x - 8, g.y - 8, 32); }); }
            else if (--PUP.cool <= 0 && GM.some(g => !g.got && Math.hypot(g.x - PUP.x, g.y - PUP.y) < 140)) { PUP.barkT = 1; PUP.cool = 240; }
          }
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
          else if (e.kind === 'wolf') {
            e.t++; if (e.cd > 0) e.cd--;
            const blocked = nx => !floorAt(nx + 16 + e.dir * 12, e.y) || T.solid.has(tileAt(nx + 16 + e.dir * 14, e.y + 20));
            if (e.st === 'run') { const nx = e.x + 0.9 * e.dir; if (nx < e.x0 || nx > e.x1 || blocked(nx)) e.dir *= -1; else e.x = nx;
              if (!H.dead && e.cd <= 0 && Math.abs(dx) < 96 && Math.abs(H.y - e.y) < 28) { e.st = 'tell'; e.t = 0; e.dir = Math.sign(dx) || e.dir; } }
            else if (e.st === 'tell') { if (e.t >= 18) { e.st = 'lunge'; e.t = 0; } }   // crouch + glowing eyes, then pounce
            else { const nx = e.x + 3.6 * e.dir; if (e.t < 16 && !blocked(nx)) e.x = nx; if (e.t >= 26) { e.st = 'run'; e.cd = 100; } }
          } else if (e.kind === 'sprite') {
            e.t++; if (e.cd > 0) e.cd--;
            if (e.st === 'fly') { e.bx += 0.5 * e.dir; if (e.bx < e.x0 || e.bx > e.x1) e.dir *= -1; e.x = e.bx; e.y = e.by + 10 * Math.sin(e.t / 30); e.face = Math.sign(dx) || e.face;
              if (!H.dead && e.cd <= 0 && Math.abs(dx) < 220 && Math.abs(dx) > 24) { e.st = 'attack'; e.t = 0; } }
            else { if (e.t === 18) {   // snowball released on attack frame 3, lobbed at the hero
                const x0 = e.x + 2 * e.face - 8, y0 = e.y - 20, vy0 = -2.6, g = 0.15, dy = H.y + 20 - y0, disc = vy0 * vy0 + 2 * g * dy, tt = disc > 0 ? (-vy0 + Math.sqrt(disc)) / g : 40;
                SNOW.push({ x: x0, y: y0, vx: Math.max(-3.5, Math.min(3.5, (H.x + 8 - x0) / tt)), vy: vy0, t: 0 }); }
              if (e.t >= 30) { e.st = 'fly'; e.cd = 120; } }
          } else if (e.kind === 'frost') {
            if (e.sh > 0) e.sh--;
            else { const chase = Math.abs(dx) < 140; if (chase) e.dir = Math.sign(dx) || e.dir; const nx = e.x + 0.4 * e.dir;   // near the hero it turns to face them (shield first)
              const stop = nx < e.x0 || nx > e.x1 || !floorAt(nx + 16 + e.dir * 12, e.y) || T.solid.has(tileAt(nx + 16 + e.dir * 14, e.y + 20));
              if (!stop) e.x = nx; else if (!chase) e.dir *= -1; }
          }
          else if (e.kind === 'slime') {
            if (e.frz > 0) { e.frz--; return; }   // frozen solid: harmless for a moment
            e.t++;
            if (e.st === 'idle') { if (e.t >= 50) { e.st = 'hop'; e.t = 0; if (Math.abs(dx) < 260) e.dir = Math.sign(dx) || e.dir; } }
            else { if (e.t >= 6 && e.t < 30) { const nx = e.x + 1.3 * e.dir; if (floorAt(nx + 16 + e.dir * 10, e.y) && !T.solid.has(tileAt(nx + 16 + e.dir * 14, e.y + 20))) e.x = nx; else e.dir *= -1; }
              e.hy = e.t >= 6 && e.t < 30 ? -Math.round(Math.sin((e.t - 6) / 24 * Math.PI) * 16) : 0; if (e.t >= 36) { e.st = 'idle'; e.t = 0; e.hy = 0; } }
          } else if (e.kind === 'bat') {
            e.t++; if (e.cd > 0) e.cd--;
            if (e.st === 'hang') { if (!H.dead && e.cd <= 0 && Math.abs(dx) < 90 && H.y > e.y) { e.st = 'swoop'; e.t = 0; e.tx = H.x + 16; e.ty = H.y + 16; e.dir = Math.sign(dx) || e.dir; } }
            else if (e.st === 'swoop') { const ddx = e.tx - e.x, ddy = e.ty - e.y, d = Math.hypot(ddx, ddy); if (d < 3 || e.t > 70) { e.st = 'climb'; e.t = 0; } else { e.x += ddx / d * 2.6; e.y += ddy / d * 2.6; } }
            else { const ddx = e.hx - e.x, ddy = e.hy - e.y, d = Math.hypot(ddx, ddy); if (d < 2) { e.x = e.hx; e.y = e.hy; e.st = 'hang'; e.cd = 100; } else { e.x += ddx / d * 1.4; e.y += ddy / d * 1.4; e.dir = Math.sign(ddx) || e.dir; } }
          } else if (e.kind === 'golem') {
            if (e.crk > 0) e.crk--;
            if (e.sh > 0) e.sh--;
            else { const chase = Math.abs(dx) < 140; if (chase) e.dir = Math.sign(dx) || e.dir; const nx = e.x + 0.35 * e.dir;
              const stop = nx < e.x0 || nx > e.x1 || !floorAt(nx + 16 + e.dir * 12, e.y) || T.solid.has(tileAt(nx + 16 + e.dir * 14, e.y + 20));
              if (!stop) e.x = nx; else if (!chase) e.dir *= -1; }
          }
          else if (e.kind === 'rat') {   // scurries; chases Mita when he is close on the same level, gives up 200px away
            if (!H.dead && Math.abs(H.y - e.y) < 28 && Math.abs(dx) < 128) e.chase = true; if (Math.abs(dx) > 200 || Math.abs(H.y - e.y) > 60) e.chase = false;
            if (e.chase) e.dir = Math.sign(dx) || e.dir; const nx = e.x + (e.chase ? 2 : 1.17) * e.dir;
            const stop = (!e.chase && (nx < e.x0 || nx > e.x1)) || !floorAt(nx + 16 + e.dir * 10, e.y) || T.solid.has(tileAt(nx + 16 + e.dir * 12, e.y + 24));
            if (!stop) e.x = nx; else if (!e.chase) e.dir *= -1; }
          else if (e.kind === 'spider') {   // waits by the ceiling, drops on its thread when Mita comes near, then climbs back up
            e.t++; if (e.st === 'up' && Math.abs(dx) < 80 && e.t > 60) { e.st = 'drop'; e.t = 0; }
            else if (e.st === 'drop') { e.y = Math.min(e.low, e.y + 3); if (e.y >= e.low && e.t > 70) { e.st = 'climb'; e.t = 0; } }
            else if (e.st === 'climb') { e.y = Math.max(e.top, e.y - 1.2); if (e.y <= e.top) { e.st = 'up'; e.t = 0; } } }
          else if (e.kind === 'wasp') {   // buzzes in a loop around its spot and darts at Mita when he passes under it
            e.t++; const ddx = H.x + 16 - e.x, ddy = H.y + 12 - e.y, dd = Math.hypot(ddx, ddy) || 1;
            e.atk = dd < 140; if (e.atk) { e.x += ddx / dd * 1.0; e.y += ddy / dd * 1.0 + Math.sin(e.t / 5) * 0.8; e.dir = Math.sign(ddx) || e.dir; }
            else { e.x += (e.bx + Math.sin(e.t / 40) * 40 - e.x) * 0.05; e.y += (e.by + Math.sin(e.t / 13) * 10 - e.y) * 0.05; e.dir = Math.cos(e.t / 40) > 0 ? 1 : -1; } }
          else if (e.kind === 'ratling') { const nx = e.x + 1.83 * e.dir; if (!floorAt(nx + 12 + e.dir * 8, e.y - 16) || T.solid.has(tileAt(nx + 12 + e.dir * 10, e.y + 8))) e.dir *= -1; else e.x = nx; }
          else if (e.kind === 'shade') {
            e.t++; const ddx = H.x + 16 - e.x, ddy = H.y + 16 - e.y, dd = Math.hypot(ddx, ddy) || 1;
            if (e.st === 'fly') { if (dd < 300) { e.x += ddx / dd * 0.67; e.y += ddy / dd * 0.67; e.dir = Math.sign(ddx) || e.dir; } if (dd < 28) { e.st = 'attack'; e.t = 0; } }
            else if (e.st === 'attack') { if (e.t >= 30) { e.st = 'fly'; e.t = 0; } }
            else if (e.st === 'fadeout') { if (e.t >= 20) { e.st = 'gone'; e.t = 0; } }
            else if (e.st === 'gone') { if (e.t >= 72) { e.x += (Math.random() < 0.5 ? -48 : 48); e.st = 'fadein'; e.t = 0; } }
            else if (e.st === 'fadein') { if (e.t >= 20) { e.st = 'fly'; e.t = 0; } }
          } else if (e.kind === 'garg') {
            e.t++;
            if (e.st === 'perch') { if (!H.dead && Math.abs(dx) < 100 && Math.abs(H.y - e.y) < 160) { e.st = 'wake'; e.t = 0; e.dir = Math.sign(dx) || e.dir; } }
            else if (e.st === 'wake') { if (e.t >= 30) { e.st = 'hover'; e.t = 0; } }
            else if (e.st === 'hover') { const ty2 = e.py - 32; e.y += (ty2 - e.y) * 0.1; e.x += (e.px - e.x) * 0.05; if (e.t >= 50 && !H.dead) { e.st = 'swoop'; e.t = 0; e.tx = H.x + 16; e.ty = H.y + 16; e.dir = Math.sign(e.tx - e.x) || e.dir; } }
            else if (e.st === 'swoop') { const ddx = e.tx - e.x, ddy = e.ty - e.y, d = Math.hypot(ddx, ddy); if (d < 4 || e.t > 50) { e.st = 'back'; e.t = 0; } else { e.x += ddx / d * 4; e.y += ddy / d * 4; } }
            else { const ddx = e.px - e.x, ddy = e.py - 32 - e.y, d = Math.hypot(ddx, ddy); if (d < 3) { e.st = 'hover'; e.t = 0; } else { e.x += ddx / d * 1.8; e.y += ddy / d * 1.8; e.dir = Math.sign(ddx) || e.dir; } }
          } else if (e.kind === 'hknight') {
            if (e.sh > 0) e.sh--;
            if (e.atk > 0) { e.atk++; if (e.atk >= 10 && e.atk <= 20 && !H.dead && overlap(heroBox(), { x: e.x + (e.dir > 0 ? 20 : 0), y: e.y + 10, w: 12, h: 18 })) hurt(e.dir); if (e.atk >= 26) e.atk = 0; }
            else if (e.sh <= 0) { const chase = Math.abs(dx) < 200; if (chase) e.dir = Math.sign(dx) || e.dir; const nx = e.x + 0.5 * e.dir;
              const stop = nx < e.x0 || nx > e.x1 || !floorAt(nx + 16 + e.dir * 12, e.y) || T.solid.has(tileAt(nx + 16 + e.dir * 14, e.y + 20));
              if (!stop) e.x = nx; else if (!chase) e.dir *= -1; if (chase && Math.abs(dx) < 30 && Math.abs(H.y - e.y) < 24) e.atk = 1; }
          }
          if (!H.dead && !(e.kind === 'slime' && e.frz > 0) && !(e.kind === 'shade' && e.st !== 'fly' && e.st !== 'attack') && !(e.kind === 'garg' && e.st === 'perch') && overlap(heroBox(), ebox(e))) hurt(Math.sign(-dx) || 1);
        });
        BUB.forEach(u => { u.t++;
          if (!u.out) { if (u.t >= 132) { u.out = true; u.vy = -6.3; u.t = 0; } }
          else { u.vy += 0.194; u.y += u.vy; if (u.vy > 0 && u.y >= u.y0) { u.y = u.y0; u.out = false; u.t = 0; fx('fx_lava_splash', 4, 14, u.x - 8, u.y0 - 8, 32); }
            if (!H.dead && overlap(heroBox(), { x: u.x + 4, y: u.y + 2, w: 8, h: 12 })) hurt(Math.sign(H.x + 16 - u.x - 8) || 1); } });
        TRIG.forEach(o => { if (!H.dead && H.x > o.x) story(o.name); });
        // frozen lava crust: 34 freezing (150ms) -> 35 solid (3s) -> 36 cracking (0.8s) -> 37 melting -> lava again
        for (const k in CRUST) { const t = ++CRUST[k]; ground[k] = t < 9 ? 34 : t < 189 ? 35 : t < 237 ? 36 : t < 246 ? 37 : 30; if (t >= 246) delete CRUST[k]; }
        // ---- the trap: gate slams, lava rises, Vasilije climbs out alone ----
        if (TRAP) {
          const g = TRAP.gate; if (g) { g.t++; if (g.st === 'closing' && g.t >= 16) { g.st = 'closed'; shake = 10; } }
          if (TRAP.st === 'idle' && !H.dead && H.x > TRAP.x0 + 96 && H.x < TRAP.x1 - 64) {
            TRAP.st = 'rising'; TRAP.lavaY = 400; if (g) { g.st = 'closing'; g.t = 0; }
            const vi = ROSTER.findIndex(r => r.id === EH_STAR); if (H.hero !== vi) { H.hero = vi; H.swapT = 40; fx('i_' + ROSTER[vi].el, 4, 12, H.x, H.y, 32); }
            story('l3_trap');
          } else if (TRAP.st === 'rising') {
            TRAP.lavaY -= 0.32;
            if (!H.dead && H.y + 31 > TRAP.lavaY + 6) { fx('fx_lava_splash', 4, 14, H.x, TRAP.lavaY - 8, 32); H.inv = 0; hurt(1); if (!H.dead) { Object.assign(H, { x: TRAP.x0 + 64, y: GROUND_Y - 31, vx: 0, vy: 0, inv: 70 }); TRAP.lavaY = 400; } }
            if (H.x > TRAP.x1 + 8) { TRAP.st = 'done'; story('l3_trap_after'); }
          } else if (TRAP.st === 'done' && TRAP.lavaY < 400) TRAP.lavaY += 1;
        }
        for (const k in SB) { const t = ++SB[k]; ground[k] = t < 9 ? 30 : t < 249 ? 31 : t < 297 ? 32 : 29; if (t >= 297) delete SB[k]; }
        // ---- Umbra ----
        if (UMB && UMB.st !== 'joined') { UMB.t++; if (UMB.hurt > 0) UMB.hurt--; const dxU = H.x - UMB.x;
          if (UMB.st === 'wait') { if (!H.dead && Math.abs(dxU) < 220) { story('l4_umbra'); UMB.st = 'idle'; UMB.t = 0; } }
          else if (UMB.stun > 0) UMB.stun--;
          else if (UMB.st === 'idle') { UMB.dir = Math.sign(dxU) || UMB.dir; if (UMB.t >= 50) { UMB.st = 'dash'; UMB.t = 0; } }
          else if (UMB.st === 'dash') { const nx = UMB.x + 3 * UMB.dir; if (!T.solid.has(tileAt(nx + 16 + UMB.dir * 12, UMB.y + 20)) && floorAt(nx + 16 + UMB.dir * 10, UMB.y)) UMB.x = nx; if (UMB.t >= 20 || Math.abs(dxU) < 40) { UMB.st = 'attack'; UMB.t = 0; UMB.dir = Math.sign(dxU) || UMB.dir; } }
          else if (UMB.st === 'attack') { if (UMB.t === 13) FIREB.push({ x: UMB.x + (UMB.dir > 0 ? 24 : -8), y: UMB.y + 12, vx: 3 * UMB.dir, vy: 0, t: 0, img: 'p_shadow', fx: 'i_shadow' }); if (UMB.t >= 30) { UMB.st = 'idle'; UMB.t = 0; } }
          else if (UMB.st === 'down') { if (UMB.t === 70) { ROSTER.push({ id: 'k_shadow', el: 'shadow', name: EH_KNIGHTS.shadow, kid: false }); fx('i_shadow', 4, 12, UMB.x, UMB.y, 32);
              say(window.EH_LANG === 'sr' ? EH_SR_HINT.joined('UMBRA') : 'UMBRA JOINED · Q / E TO SWITCH'); story('l4_knight_shadow'); UMB.st = 'joined'; } }
          if (umbFight() && UMB.stun <= 0 && !H.dead && overlap(heroBox(), umbBox())) hurt(Math.sign(-dxU) || 1); }
        // ---- Mrak ----
        if (MRAK) {
          if (MRAK.hurt > 0) MRAK.hurt--; if (MRAK.beamT > 0) MRAK.beamT--;
          const cg2 = MRAK.cage; if (cg2) cg2.t++;
          if (MRAK.dead) { MRAK.dead++; if (cg2 && MRAK.dead === 70) { cg2.st = 'opening'; cg2.t = 0; } if (cg2 && cg2.st === 'opening' && cg2.t >= 45) cg2.st = 'open';
            if (MRAK.dead === 130) story('l4_free'); if (MRAK.dead === 160) onEnd('complete', H.coins, runStats()); }
          else {
            if (!MRAK.awake && H.x > LW - 600) { story('l4_mrak'); MRAK.awake = true; MRAK.t = 60; }
            if (MRAK.awake && !H.dead) {
              MRAK.t++; const aL = LW - 630, aR = mBody().x - 20, front = MRAK.x + 20;
              if (MRAK.st !== 'phase' && ((MRAK.ph === 1 && MRAK.hp <= 20) || (MRAK.ph === 2 && MRAK.hp <= 10))) { MRAK.ph++; MRAK.st = 'phase'; MRAK.t = 0; MRAK.spots = []; }
              if (MRAK.st === 'phase') { if (MRAK.t >= 45) { MRAK.st = MRAK.ph === 3 ? 'laugh' : 'idle'; MRAK.t = 0; if (MRAK.ph === 3) story('l4_together'); } }
              else if (MRAK.ph === 1) {
                if (MRAK.st === 'idle' && MRAK.t > 100) { MRAK.st = 'telegraph'; MRAK.t = 0; }
                else if (MRAK.st === 'telegraph' && MRAK.t >= 30) { if (MRAK.n++ % 2) { MRAK.st = 'shadow_attack'; MRAK.t = 0; }
                  else { for (let i = 0; i < 2; i++) MRAK.orbs.push({ x: front, y: MRAK.y + 50 + i * 24, t: -i * 20 }); MRAK.st = 'idle'; MRAK.t = 0; } }
                else if (MRAK.st === 'shadow_attack') { if (MRAK.t === 15) MRAK.waves.push({ x: front - 64, img: 'mrak_wave', v: 2.33, t: 0 }); if (MRAK.t >= 30) { MRAK.st = 'idle'; MRAK.t = 0; } }
              } else if (MRAK.ph === 2) {
                const move = ['warden_roots', 'warden_frost', 'warden_magma'][MRAK.n % 3];
                if (MRAK.st === 'idle' && MRAK.t > 80) { MRAK.st = 'telegraph'; MRAK.t = 0; MRAK.next = move; MRAK.spots = [];
                  if (move === 'warden_roots') for (let i = -1; i <= 1; i++) MRAK.spots.push(Math.max(aL, Math.min(aR, H.x + 16 + i * 48)));
                  if (move === 'warden_frost') for (let i = 0; i < 4; i++) MRAK.spots.push(Math.max(aL, Math.min(aR, front - 32 - i * 44))); }
                else if (MRAK.st === 'telegraph' && MRAK.t >= 45) { MRAK.st = MRAK.next; MRAK.t = 0; MRAK.n++; }
                else if (MRAK.st.startsWith('warden_')) {
                  if (MRAK.t === 12) { if (MRAK.st === 'warden_roots') MRAK.roots = MRAK.spots.map(x => ({ x, t: 0 }));
                    else if (MRAK.st === 'warden_frost') MRAK.spikes = MRAK.spots.map((x, i) => ({ x, t: -i * 4 }));
                    else MRAK.waves.push({ x: front - 64, img: 'lava_wave', v: 2.5, t: 0 }); MRAK.spots = []; shake = 8; }
                  if (MRAK.t >= 36) { MRAK.st = 'idle'; MRAK.t = 0; } }
              } else {
                if (MRAK.st === 'stagger' && MRAK.t >= 40) { MRAK.st = 'laugh'; MRAK.t = 0; }
                if (MRAK.st === 'laugh' && MRAK.t % 240 === 239) MRAK.orbs.push({ x: front, y: MRAK.y + 60, t: 0 });
              }
              if (overlap(heroBox(), mBody())) hurt(1);
            }
          }
          MRAK.waves.forEach(v => { v.t++; v.x -= v.v; if (!H.dead && overlap(heroBox(), { x: v.x + 4, y: GROUND_Y - 32 + 12, w: 56, h: 20 })) hurt(-1); });
          MRAK.waves = MRAK.waves.filter(v => v.x > finalL - 70 && !MRAK.dead);
          MRAK.orbs.forEach(o => { o.t++; if (o.t < 0) return;   // orbs aim once when thrown, then fly straight: step or jump out of the way, or shoot them
            if (o.vx == null) { const ddx = H.x + 16 - o.x - 8, ddy = H.y + 16 - o.y - 8, d = Math.hypot(ddx, ddy) || 1; o.vx = ddx / d * 1.7; o.vy = ddy / d * 1.7; }
            o.x += o.vx; o.y += o.vy; if (o.y > GROUND_Y) o.t = 999;
            if (!H.dead && overlap(heroBox(), { x: o.x + 3, y: o.y + 3, w: 10, h: 10 })) { hurt(Math.sign(o.vx) || 1); o.t = 999; } });
          MRAK.orbs = MRAK.orbs.filter(o => o.t < 400 && o.x > finalL - 40 && !MRAK.dead);
          MRAK.roots.forEach(r => { r.t++; const f = Math.floor(r.t / 5); if ((f === 2 || f === 3) && !H.dead && overlap(heroBox(), { x: r.x - 16 + 6, y: 224 + 14, w: 20, h: 50 })) hurt(Math.sign(r.x - H.x - 16) || 1); });
          MRAK.roots = MRAK.roots.filter(r => r.t < 30);
          MRAK.spikes.forEach(k => { k.t++; const f = Math.floor(k.t / 5); if (k.t >= 0 && (f === 2 || f === 3) && !H.dead && overlap(heroBox(), { x: k.x - 16 + 8, y: GROUND_Y - 64 + 6, w: 16, h: 58 })) hurt(Math.sign(k.x - H.x - 16) || 1); });
          MRAK.spikes = MRAK.spikes.filter(k => k.t < 30);
        }
        // ---- Lava Salamander ----
        if (SAL) {
          if (SAL.hurt > 0) SAL.hurt--;
          if (SAL.dead) { SAL.dead++; if (SAL.dead === 80) story('l3_salamander_bye'); }
          else {
            if (!SAL.awake && H.x + 10 > SAL.aL + 40 && H.x < SAL.aR) { story('l3_salamander'); SAL.awake = true; SAL.st = 'idle'; SAL.t = 0; }
            if (SAL.awake && !H.dead) {
              SAL.t++; const enr = SAL.hp <= SAL.max / 2; SAL.dir = Math.sign(H.x + 16 - SAL.x - 32) || SAL.dir;
              if (SAL.st === 'idle' && SAL.t >= (enr ? 50 : 80)) { SAL.st = SAL.n++ % 3 === 2 ? 'dive' : 'spit'; SAL.t = 0; }
              else if (SAL.st === 'spit') { if (SAL.t === 18) { const x0 = SAL.x + (SAL.dir > 0 ? 55 : 1), y0 = SAL.y + 30, ddx = H.x + 16 - x0 - 8, ddy = H.y + 16 - y0 - 8, d = Math.hypot(ddx, ddy) || 1;
                  FIREB.push({ x: x0, y: y0, vx: ddx / d * 2.7, vy: ddy / d * 2.7, t: 0 }); if (enr) FIREB.push({ x: x0, y: y0, vx: ddx / d * 2.7, vy: ddy / d * 2.7 - 1.2, t: 0 }); }
                if (SAL.t >= 30) { SAL.st = 'idle'; SAL.t = 0; } }
              else if (SAL.st === 'dive') { if (SAL.t >= 38) { SAL.st = 'hidden'; SAL.t = 0; } }
              else if (SAL.st === 'hidden') { if (SAL.t >= 72) { SAL.st = 'surface'; SAL.t = 0; } }
              else if (SAL.st === 'surface') { if (SAL.t >= 38) { SAL.st = 'idle'; SAL.t = 0; } }
              if (salUp() && overlap(heroBox(), salBox())) hurt(Math.sign(SAL.x + 32 - H.x - 16) || 1);
            }
          }
        }
        for (let i = FIREB.length - 1; i >= 0; i--) { const f = FIREB[i]; f.x += f.vx; f.y += f.vy; f.t++;
          let gone = T.solid.has(tileAt(f.x + 8, f.y + 8)) || f.t > 240 || f.y > 380 || f.y < -20;
          if (!gone && !H.dead && overlap(heroBox(), { x: f.x + 3, y: f.y + 3, w: 10, h: 10 })) { hurt(Math.sign(f.vx) || 1); gone = true; }
          if (gone) { fx(f.fx || 'i_fire', 4, 12, f.x - 8, f.y - 8, 32); FIREB.splice(i, 1); } }
        for (let i = SNOW.length - 1; i >= 0; i--) { const s = SNOW[i]; s.vy += 0.15; s.x += s.vx; s.y += s.vy; s.t++;
          const sf = s.vy > 0 ? surface(s.x + 8, Math.floor((s.y + 14) / 32)) : null;
          let gone = T.solid.has(tileAt(s.x + 8, s.y + 12)) || s.y > 380 || (sf != null && s.y + 14 >= sf);
          if (!gone && !H.dead && overlap(heroBox(), { x: s.x + 3, y: s.y + 3, w: 10, h: 10 })) { hurt(Math.sign(s.vx) || 1); gone = true; }
          if (gone) { fx('fx_snowball_burst', 4, 14, s.x, s.y, 16); SNOW.splice(i, 1); } }
        ICE.forEach(ic => { ic.t++;
          const iw = ic.w || 16;
          if (ic.st === 'hang') { if (!H.dead && Math.abs(H.x + 16 - (ic.x + iw / 2)) < (ic.k === 'chand' ? 32 : 24) && H.y > ic.y) { ic.st = 'wobble'; ic.t = 0; } }
          else if (ic.st === 'wobble') { if (ic.t >= (ic.k === 'rock' ? 30 : 36)) { ic.st = 'fall'; ic.vy = 0; } }
          else if (ic.st === 'fall') { ic.vy = Math.min(9, ic.vy + 0.25); ic.y += ic.vy;
            const ty = Math.floor((ic.y + 28) / 32), sf = surface(ic.x + iw / 2, ty), hitH = !H.dead && overlap(heroBox(), ic.k === 'chand' ? { x: ic.x + 4, y: ic.y + 12, w: 24, h: 12 } : { x: ic.x + 4, y: ic.y + 3, w: 8, h: 24 });
            if (hitH) hurt(Math.sign(H.x + 16 - ic.x - iw / 2) || 1);
            if (hitH || (sf != null && ic.y + 28 >= sf) || ic.y > 380) { if (ic.k === 'chand') fx('fx_chand_crash', 4, 14, ic.x - 16, (sf != null ? sf : ic.y + 28) - 32, 64); else fx(ic.k === 'rock' ? 'fx_rock_shatter' : 'fx_icicle_shatter', 4, 14, ic.x - 8, (sf != null ? sf : ic.y + 28) - 16, 32); ic.st = 'gone'; ic.t = 0; } }
          else if (ic.st === 'gone' && ic.t > 300) { ic.st = 'hang'; ic.y = ic.y0; ic.t = 0; } });
        for (let i = SPORES.length - 1; i >= 0; i--) { const s = SPORES[i]; s.vy += 0.167; s.x += s.vx; s.y += s.vy; s.t++;
          let gone = T.solid.has(tileAt(s.x + 8, s.y + 12)) || s.y > 380;
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
        // ---- Yeti Cub ----
        if (shake > 0) shake--;
        if (YETI) {
          if (YETI.hurt > 0) YETI.hurt--;
          if (YETI.dead) { YETI.dead++; if (YETI.dead === 50) story('l2_yeti_bye'); }
          else {
            if (!YETI.awake && H.x + 10 > YETI.aL + 40 && H.x < YETI.aR) { story('l2_yeti'); YETI.awake = true; YETI.st = 'walk'; YETI.t = 0; }
            if (YETI.awake && !H.dead) {
              YETI.t++; const dxY = H.x + 16 - (YETI.x + 32), enr = YETI.hp <= YETI.max / 2;
              if (YETI.st === 'walk') { YETI.dir = Math.sign(dxY) || YETI.dir; if (Math.abs(dxY) > 40) YETI.x += 0.7 * YETI.dir; if (YETI.t >= (enr ? 60 : 90)) { YETI.st = YETI.n++ % 2 ? 'throw' : 'stomp'; YETI.t = 0; } }
              else if (YETI.st === 'stomp') { if (YETI.t === 12) { shake = 18; for (let i = 0; i < (enr ? 5 : 3); i++) SNOW.push({ x: YETI.aL + 48 + Math.random() * (YETI.aR - YETI.aL - 96), y: -20 - i * 40, vx: 0, vy: 0, t: 0 }); }
                if (YETI.t >= 30) { YETI.st = 'rest'; YETI.t = 0; } }
              else if (YETI.st === 'throw') { YETI.dir = Math.sign(dxY) || YETI.dir; if (YETI.t === 12) BIGS.push({ x: YETI.x + 32 + YETI.dir * 12 - 16, y: YETI.y + 8, vx: 2.2 * YETI.dir, vy: -4, t: 0 });
                if (YETI.t >= 30) { YETI.st = 'rest'; YETI.t = 0; } }
              else if (YETI.st === 'rest') { if (YETI.t >= 40) { YETI.st = 'walk'; YETI.t = 0; } }
              YETI.x = Math.max(YETI.aL, Math.min(YETI.aR - 64, YETI.x));
              if (overlap(heroBox(), yetiBox())) hurt(Math.sign(YETI.x + 32 - H.x - 16) || 1);
            }
          }
        }
        for (let i = BIGS.length - 1; i >= 0; i--) { const s = BIGS[i]; s.vy = Math.min(7, s.vy + 0.25); s.x += s.vx; s.t++;
          const ty = Math.floor((s.y + 32 + s.vy) / 32), sf = s.vy >= 0 ? surface(s.x + 16, ty) : null;
          if (sf != null && s.y + 32 + s.vy >= sf) { s.y = sf - 32; s.vy = 0; } else s.y += s.vy;   // lands, then rolls along the ground
          let gone = s.y > 380 || T.solid.has(tileAt(s.x + 16 + Math.sign(s.vx) * 16, s.y + 16)) || (YETI && (s.x < YETI.aL - 16 || s.x > YETI.aR - 16));
          if (!gone && !H.dead && overlap(heroBox(), { x: s.x + 5, y: s.y + 5, w: 22, h: 22 })) { hurt(Math.sign(s.vx) || 1); gone = true; }
          if (gone) { fx('fx_snowball_burst', 4, 14, s.x + 8, s.y + 8, 16); BIGS.splice(i, 1); } }
        // ---- Frost Warden ----
        if (FW) {
          if (FW.dead) FW.dead++;
          else {
            if (!FW.awake && H.x > LW - 600) { story(MC ? 'l3_colossus' : 'l2_warden'); FW.awake = true; FW.t = 60; }
            if (FW.hurt > 0) FW.hurt--;
            if (FW.awake && !H.dead) {
              FW.t++;
              const enr = FW.hp <= FW.max / 2, aL = LW - 630, aR = fwBody().x - 20;
              if (FW.st === 'idle' && FW.t > (enr ? 90 : 140)) {
                FW.next = FW.n % 2 ? 'breath' : 'spikes'; FW.spots = [];
                if (MC && FW.next === 'breath') { const cnt = enr ? 7 : 5; FW.spots.push(H.x + 16); for (let i = 1; i < cnt; i++) FW.spots.push(aL + 24 + Math.random() * (aR - aL - 48)); }   // molten rain: one spot under the hero
                else if (MC) {}
                else if (FW.next === 'spikes') { const cnt = enr ? 6 : 4, aimed = FW.n % 4 === 2;   // README pattern (4 spots 40px apart, 32px in front) or aimed at the hero
                  for (let i = 0; i < cnt; i++) FW.spots.push(aimed ? H.x + 16 + (i - (cnt - 1) / 2) * 40 : fwBody().x - 32 - 16 - i * 40);
                  FW.spots = FW.spots.map(x => Math.max(aL, Math.min(aR, x))); }
                FW.n++; FW.st = 'telegraph'; FW.t = 0;
              } else if (FW.st === 'telegraph' && FW.t >= (enr ? 36 : 60)) { FW.st = FW.next; FW.t = 0; }
              else if (MC && FW.st === 'spikes') {   // magma slam: a lava wave runs along the floor toward the hero (two when enraged)
                if (FW.t === 12 || (enr && FW.t === 40)) FW.waves.push({ x: FW.x + 14 - 64, t: 0 }); if (FW.t >= (enr ? 60 : 36)) { FW.st = 'idle'; FW.t = 0; } }
              else if (MC && FW.st === 'breath') { if (FW.t === 42) { FW.rain = FW.spots.map((x, i) => ({ x, y: -40 - i * 6, vy: 0 })); FW.spots = []; } if (FW.t >= 48) { FW.st = 'idle'; FW.t = 0; } }
              else if (FW.st === 'spikes') { if (FW.t === 12) { FW.spikes = FW.spots.map((x, i) => ({ x, t: -i * 4 })); FW.spots = []; shake = 8; } if (FW.t >= 36) { FW.st = 'idle'; FW.t = 0; } }
              else if (FW.st === 'breath') { if (FW.t === 15) FW.breath = { t: 0 }; if (FW.t >= 45) { FW.st = 'idle'; FW.t = 0; } }
              if (overlap(heroBox(), fwBody())) hurt(1);
            }
          }
          FW.spikes.forEach(k => { k.t++; const f = Math.floor(k.t / 5);
            if (k.t >= 0 && (f === 2 || f === 3) && !H.dead && overlap(heroBox(), { x: k.x - 16 + 8, y: GROUND_Y - 64 + 6, w: 16, h: 58 })) hurt(Math.sign(k.x - H.x - 16) || 1); });
          FW.spikes = FW.spikes.filter(k => k.t < 30);
          FW.waves.forEach(v => { v.t++; v.x -= 2.5; if (!H.dead && overlap(heroBox(), { x: v.x + 4, y: GROUND_Y - 32 + 12, w: 56, h: 20 })) hurt(-1); });
          FW.waves = FW.waves.filter(v => v.x > finalL - 70 && !FW.dead);
          FW.rain.forEach(r => { r.vy = Math.min(8, r.vy + 0.25); r.y += r.vy; if (!H.dead && overlap(heroBox(), { x: r.x - 8 + 3, y: r.y + 17, w: 10, h: 13 })) { hurt(1); r.y = 999; }
            if (r.y + 30 >= GROUND_Y && r.y < 999) { fx('fx_rock_shatter', 4, 14, r.x - 16, GROUND_Y - 16, 32); r.y = 999; } });
          FW.rain = FW.rain.filter(r => r.y < 999 && !FW.dead);
          if (FW.breath) { const b = FW.breath; b.t++; const f = Math.floor(b.t / 6), m = fwMouth();
            if (f >= 2 && f <= 4 && !H.dead) {   // distance from the hero's middle to the breath cone's centre line
              const ex2 = m.x - Math.cos(FW_ANG) * 90, ey2 = m.y + Math.sin(FW_ANG) * 90, px = H.x + 16, py = H.y + 20, vx = ex2 - m.x, vy = ey2 - m.y;
              const k = Math.max(0, Math.min(1, ((px - m.x) * vx + (py - m.y) * vy) / (vx * vx + vy * vy))), d = Math.hypot(px - m.x - k * vx, py - m.y - k * vy);
              if (d < 6 + 12 * k) { hurt(1); H.slowT = 90; } }
            if (b.t >= 36 || FW.dead) FW.breath = null; }
        }
        // ---- hero projectiles ----
        for (let i = B.length - 1; i >= 0; i--) { const b = B[i]; b.x += b.vx; b.t++;
          if (b.arc) { b.vy = Math.min(6, b.vy + b.g); b.y += b.vy; }
          if (b.bomb) {   // Ruby's present: flies until it touches the floor or an enemy, then bursts and hurts everything around it
            const sb = { x: b.x + 3, y: b.y + 3, w: 10, h: 10 }, row = Math.floor((b.y + 14) / 32), sf = surface(b.x + 8, row);
            const land = T.solid.has(tileAt(b.x + 8, b.y + 8)) || (b.vy > 0 && sf != null && b.y + 14 >= sf) || E.some(e => !e.dead && overlap(sb, ebox(e))) || b.y > 380;
            if (!land) { if (b.x < cam - 16 || b.x > cam + 656) B.splice(i, 1); continue; }
            b.boom = true; b.pierce = true; fx('boom', 6, 12, b.x + 8 - 24, b.y + 8 - 24, 48); shake = Math.max(shake, 4); }
          let hit = T.solid.has(tileAt(b.x + 8, b.y + 8)) || b.x < cam - 16 || b.x > cam + 656 || b.y > 380, wall = hit;
          for (const g of gates) if (g.st !== 'open' && b.x + 12 > g.x && b.x + 4 < g.x + 32) { hit = wall = true; }
          const pb = b.boom ? { x: b.x + 8 - 36, y: b.y + 8 - 36, w: 72, h: 72 } : b.el === 'gold' ? { x: b.x + 2, y: b.y + 4, w: 28, h: 8 } : { x: b.x + 3, y: b.y + 3, w: 10, h: 10 };
          const spark = () => fx('fx_hit_spark', 3, 18, b.x, b.y, 16);
          for (const e of E) { if (hit) break; if (!e.dead && !b.hit.has(e) && overlap(pb, ebox(e))) { b.hit.add(e);
            // frostling: a shot at its face is blocked by its ice shield, unless it is fire or light (they break it)
            if (e.kind === 'shade' && b.el !== 'light' && b.el !== 'gold') { if (e.st === 'fly' || e.st === 'attack') { e.st = 'fadeout'; e.t = 0; } hit = wall = true; continue; }
            if (e.kind === 'garg' && e.st === 'perch' && b.el !== 'gold') { e.st = 'wake'; e.t = 0; hit = wall = true; continue; }
            const brk = EH_SHIELD[e.kind];
            if (brk && Math.sign(b.vx) === -e.dir && !brk.includes(b.el) && b.el !== 'gold' && !b.boom) { if (e.sh <= 0) e.sh = 75; else e.sh = Math.max(e.sh, 20); hit = wall = true; continue; }
            if (brk) { if (e.kind === 'golem' && e.sh > 0) e.crk = 24; e.sh = 0; }
            if (e.kind === 'slime' && (b.el === 'ice' || b.el === 'water')) e.frz = 150;
            damage(e, b.el === 'gold' ? 99 : b.dmg); spark(); if (!b.pierce) hit = true; } }
          if (T.lava && (b.el === 'ice' || b.el === 'water' || b.el === 'gold')) {   // ice (and water) shots freeze the lava under them into a crust you can stand on
            const c = Math.floor((b.x + 8) / 32), r0 = Math.floor((b.y + 8) / 32), inPool = SAL && !SAL.dead && b.x > SAL.aL && b.x < SAL.aR;
            for (let r = r0; r <= r0 + 3 && r < MH && !inPool; r++) { const i = r * MW + c; if (T.solid.has(ground[i]) && ground[i] !== 35 && ground[i] !== 36) break;
              if (ground[i] === 30 || ground[i] === 37) { for (const cc of [c - 1, c, c + 1]) { const j = r * MW + cc; if (cc >= 0 && cc < MW && (ground[j] === 30 || ground[j] === 37)) { CRUST[j] = 0; ground[j] = 34; } } break; } } }
          if (T.bridge && (b.el === 'light' || b.el === 'gold')) {   // Kosta's (and Aurel's) light makes the shadow bridge solid for a few seconds
            const c = Math.floor((b.x + 8) / 32), r0 = Math.floor((b.y + 8) / 32);
            for (let r = r0; r <= r0 + 3 && r < MH; r++) { const i = r * MW + c; if (T.solid.has(ground[i])) break;
              if ([29, 30, 31, 32].includes(ground[i])) { for (const cc of [c - 1, c, c + 1]) { const j = r * MW + cc; if (cc >= 0 && cc < MW && [29, 30, 31, 32].includes(ground[j])) { if (ground[j] === 31) SB[j] = 9; else { SB[j] = 0; ground[j] = 30; } } } break; } } }
          if (UMB && umbFight() && !hit && overlap(pb, umbBox())) { UMB.hp -= b.dmg; UMB.hurt = 10; spark(); hit = true; if (b.el === 'light') UMB.stun = 30;
            if (UMB.hp <= 0) { UMB.st = 'down'; UMB.t = 0; } }
          if (MRAK && !hit) for (const o of MRAK.orbs) if (o.t >= 0 && overlap(pb, { x: o.x + 2, y: o.y + 2, w: 12, h: 12 })) { o.t = 999; spark(); hit = true; break; }   // shoot the orbs down
          if (MRAK && MRAK.awake && !MRAK.dead && !hit && overlap(pb, mBody())) { hit = true; spark();
            if (b.who === 'vera') { MRAK.hp -= bd(b, MRAK); MRAK.hurt = 10; if (MRAK.hp <= 0) mrakDown(); }   // Baba Vera needs nobody's help
            else if (MRAK.st === 'phase') {}
            else if (MRAK.ph < 3) { MRAK.hp -= b.dmg * (MRAK.st === 'telegraph' && overlap(pb, mCore()) ? 2 : 1); MRAK.hurt = 10; }
            else { const RH = ROSTER.find(r => r.id === b.who); MRAK.hurt = 6;
              if (MRAK.callStar) { if (b.who === EH_STAR) mrakDown(); }
              else if (RH && EH_COUSINS.some(c => c.id === b.who)) { MRAK.lit.add(b.who); MRAK.last = b.who;
                if (MRAK.lit.size === 4) { MRAK.lit.clear(); MRAK.beamT = 40; MRAK.st = 'stagger'; MRAK.t = 0; MRAK.stag++; MRAK.hp = Math.max(1, MRAK.hp - 3);
                  if (MRAK.stag >= 3) { if (b.who === EH_STAR) mrakDown(); else { MRAK.hp = 1; MRAK.callStar = true; say(window.EH_LANG === 'sr' ? EH_SR_HINT.finish.konstantin : 'PRESS 1 · KOSTA FINISHES IT'); story('l4_finish'); } } } } } }
          if (SAL && SAL.awake && !SAL.dead && !hit && salUp() && overlap(pb, salBox())) { SAL.hp -= b.el === 'gold' ? bd(b, SAL) : b.dmg * (b.el === 'ice' || b.el === 'water' ? 2 : 1); SAL.hurt = 10; spark(); hit = true;
            if (SAL.hp <= 0) { SAL.dead = 1; FIREB.length = 0; } }
          if (YETI && YETI.awake && !YETI.dead && !hit && overlap(pb, yetiBox())) { YETI.hp -= bd(b, YETI); YETI.hurt = 10; spark(); hit = true;
            if (YETI.hp <= 0) { YETI.dead = 1; BIGS.length = 0; SNOW.length = 0; } }
          if (FW && !FW.dead && !hit && overlap(pb, fwBody())) {
            FW.hp -= b.el === 'gold' ? bd(b, FW) : b.dmg * (fwGlow() && overlap(pb, fwWeak()) ? 2 : 1); FW.hurt = 10; FW.awake = true; spark();
            if (FW.hp <= 0 && b.who !== EH_STAR && b.who !== 'vera') { FW.hp = 1; if (!FW.callStar) { FW.callStar = true; say(window.EH_LANG === 'sr' ? EH_SR_HINT.finish[EH_STAR] : `PRESS ${LV.starKey} · ${EH_STAR.toUpperCase()} FINISHES IT`); story(LV.id + '_finish'); } }
            if (FW.hp <= 0) { FW.dead = 1; FW.spots = []; FW.spikes = []; FW.breath = null; FW.waves = []; FW.rain = []; }
            hit = true; }
          if (ELD && ELD.awake && !ELD.dead && !hit && overlap(pb, elderBox())) { ELD.hp -= bd(b, ELD); ELD.hurt = 10; spark(); hit = true;
            if (ELD.hp <= 0) { ELD.dead = 1; SEEDS.length = 0; gates.forEach(g => { if (g.st !== 'open') { g.st = 'opening'; g.t = 0; } }); } }
          if (BOSS && !BOSS.dead && !hit && overlap(pb, bossBody())) {
            BOSS.hp -= b.el === 'gold' ? bd(b, BOSS) : b.dmg * (overlap(pb, bossWeak()) ? 2 : 1); BOSS.hurt = 10; BOSS.awake = true; spark();
            if (BOSS.hp <= 0 && b.who !== EH_STAR && b.who !== 'vera') { BOSS.hp = 1; if (!BOSS.callStar) { BOSS.callStar = true; say(window.EH_LANG === 'sr' ? EH_SR_HINT.finish[EH_STAR] : `PRESS ${LV.starKey} · ${EH_STAR.toUpperCase()} FINISHES IT`); story(LV.id + '_finish'); } }
            if (BOSS.hp <= 0) { BOSS.dead = 1; BOSS.spots = []; BOSS.roots = []; }
            hit = true; }
          if (hit || b.boom) { if (wall && !b.boom) fx('i_' + b.el, 4, 12, b.x - 8, b.y - 8, 32); B.splice(i, 1); } }
        for (let i = X.length - 1; i >= 0; i--) if (++X[i].t >= X[i].n * X[i].d) X.splice(i, 1);
        // crumble planks: 450ms after being stepped on they crack, break and fall away, then grow back after 3s
        for (const k in crumble) { const t = ++crumble[k]; const cr = T.crumble; ground[k] = t < 27 ? cr[0] : t < 36 ? cr[1] : t < 45 ? cr[2] : t < 225 ? cr[3] : cr[0]; if (t >= 225) delete crumble[k]; }
        for (const k in bounceT) if (++bounceT[k] >= 20) delete bounceT[k];
        if (toast && ++toast.t > 240) toast = null;
        const hud = H.hp + ':' + H.coins + ':' + H.hero; if (hud !== lastHud) { lastHud = hud; const CH = ROSTER[H.hero]; onHud({ hp: H.hp, coins: H.coins, element: CH.el, name: CH.name }); }
      };

      const drawRide = () => {   // the eagle carries Kosta up the cliff face
        const t = RIDE.t; ctx.fillStyle = '#0d0b14'; ctx.fillRect(0, 0, 640, 360); if (img.cliff) ctx.drawImage(img.cliff, 0, 0);
        const y = 380 - Math.min(1, t / 200) * 330, x = 260 + Math.sin(t / 30) * 30; drawStrip(img.pet_eagle_carry_konstantin, 4, (t / 6) % 4, x, y, 64);
        const fade = Math.min(1, t / 20, (230 - t) / 20); if (fade < 1) { ctx.globalAlpha = 1 - Math.max(0, fade); ctx.fillStyle = '#0d0b14'; ctx.fillRect(0, 0, 640, 360); ctx.globalAlpha = 1; } };
      const draw = () => {
        if (RIDE && RIDE.on) return drawRide();
        const eldFight = ELD && ELD.awake && !ELD.dead, bwFight = (BOSS && BOSS.awake && !BOSS.dead) || (FW && FW.awake && !FW.dead) || (MRAK && MRAK.awake && (!MRAK.dead || MRAK.dead < 400)), yetiFight = YETI && YETI.awake && !YETI.dead;
        const trapFight = TRAP && TRAP.st === 'rising', salFight = SAL && SAL.awake && !SAL.dead;
        const camT = eldFight ? gates[0].x : yetiFight ? YETI.aL : trapFight ? TRAP.x0 : salFight ? SAL.aL : bwFight ? finalL : Math.max(0, Math.min(LW - 640, H.x + 16 - 280));
        camF = Math.abs(camT - camF) < 0.5 ? camT : camF + (camT - camF) * 0.12; cam = Math.round(camF);
        // how much of the view is inside a boss arena -> blend in the arena backdrop + foreground branches
        const ov = (a, b) => Math.max(0, Math.min(cam + 640, b) - Math.max(cam, a)) / 640;
        const arenaW = Math.min(1, (gates.length ? ov(gates[0].x, gates[1].x + 32) : 0) + ov(finalL, LW));
        const par = { sky: 0, far: 0.1, mid: 0.25, near: 0.45 };
        const bg = (k, p) => { const o = Math.round(((cam * p) % 640 + 640) % 640); ctx.drawImage(img[k], -o, 0); ctx.drawImage(img[k], 640 - o, 0); };
        if (LV.noBg) { ctx.fillStyle = '#e8e0d0'; ctx.fillRect(0, 0, 640, 360); } else for (const k of ['sky','far','mid','near']) bg(k, par[k]);
        if (arenaW > 0 && img.arena_near) { ctx.globalAlpha = arenaW; bg('arena_near', par.near); ctx.globalAlpha = 1; }
        ctx.save(); ctx.translate(-cam + (shake > 0 ? Math.round(Math.random() * 4 - 2) : 0), shake > 0 ? Math.round(Math.random() * 4 - 2) : 0);
        drawLayer(DBL); drawLayer(GL); drawLayer(DL);
        CP.forEach(c => { if (c.st === 'idle') drawStrip(img.cp_idle, 1, 0, c.x, c.y, 32); else if (c.st === 'activate') drawStrip(img.cp_activate, 6, c.t / 6, c.x, c.y, 32); else drawStrip(img.cp_lit, 4, (tick / 7.5) % 4, c.x, c.y, 32); });
        if (ex) drawStrip(img.arch, 4, (tick / 7.5) % 4, ex.x, ex.y, 64);
        ST.forEach(s => { if (s.woke) return; const f = s.wakeT < 0 ? -1 : Math.floor(s.wakeT / 6);
          if (f < 3) drawStrip(img['st_' + s.el], 1, 0, s.x, s.y, 32); else drawStrip(img[`h_k_${s.el}_idle`], 4, 0, s.x, s.y, 32);
          if (f >= 0) drawStrip(img.st_awaken, 6, f, s.x, s.y, 32); });
        for (const PUP of PETS) { if (PUP.st === 'gone') continue; if (PUP.st === 'wait' && PUP.yarn) drawStrip(img.yarn, 6, (tick / 6) % 6, PUP.x + 20, PUP.y + 15, 16);
          const a = PUP.barkT > 0 || PUP.spT > 0 ? 'special' : PUP.anim, fsp = PUP.skill === 'fetch' && PUP.spT > 0 ? Math.min(3, PUP.spT < 7 ? 0 : PUP.fetch ? 1 + (Math.floor(PUP.spT / 4) % 2) : 3) : null, n = { idle: 4, run: 6, jump: 2, special: 4, fly: 4, glide: 2, dive: 4 }[a], f = PUP.fly ? (tick / 6) % n : fsp != null ? fsp : a === 'special' ? (PUP.spT || PUP.barkT) / 6 : a === 'jump' ? (PUP.st === 'away' ? (PUP.vy < 0 ? 0 : 1) : PUP.y < H.y ? 1 : 0) : (tick / (a === 'run' ? 5 : 12)) % n;
          drawStrip(img[`pet_${PUP.id}_${a}`], n, f, PUP.x, PUP.y, 32, PUP.face < 0); }
        C.forEach((c, i) => { if (!c.got) drawStrip(img.coin, 6, (tick / 6.7 + i * 2) % 6, c.x, c.y + Math.round(Math.sin(tick / 20 + i) * 1.5), 16); });
        GM.forEach((g, i) => { if (!g.got) drawStrip(img.gem, 6, (tick / 7.5 + i) % 6, g.x, g.y, 16); });
        if (LV.cat) WASP_HOMES.forEach(([c], i) => drawStrip(img.wasp_nest, 4, (tick / 10 + i) % 4, c * 32 - 16, 40, 32));
        ROPES.forEach(r => { for (let i = 0; i <= ROPE_L; i += 2) { const px = Math.round(r.x + Math.sin(r.a) * i), py = Math.round(r.y + Math.cos(r.a) * i); ctx.fillStyle = '#1a1420'; ctx.fillRect(px - 2, py, 4, 2); ctx.fillStyle = i % 8 < 4 ? '#b0884e' : '#8a6236'; ctx.fillRect(px - 1, py, 2, 2); }
          const kn = ropeKnot(r); ctx.fillStyle = '#1a1420'; ctx.fillRect(Math.round(kn.x) - 4, Math.round(kn.y) - 3, 8, 7); ctx.fillStyle = '#b0884e'; ctx.fillRect(Math.round(kn.x) - 3, Math.round(kn.y) - 2, 6, 5); });
        if (H.carry && HATCH && img.hatch_glow) drawStrip(img.hatch_glow, 4, (tick / 10) % 4, HATCH.x, HATCH.y - 32, 64);
        if (CAT && CAT.st !== 'carried') { const a = CAT.st === 'hide' ? 'hide' : CAT.st === 'found' ? 'found' : 'sit', f = a === 'hide' ? CAT.t / 6 : a === 'found' ? CAT.t / 7.5 : (tick / 10) % 4;
          drawStrip(img['cat_' + a], 4, f, CAT.x, CAT.y, 32, H.x < CAT.x); }
        TOYS.forEach((t, i) => { if (!t.got) drawStrip(img['toy_' + t.k], 4, (tick / 10 + i) % 4, t.x, t.y, 16); });
        if (MARIJA.on) { const walking = TIMER && TIMER.t < 150 && MARIJA.x > H.x + 70; drawStrip(img[walking ? 'mj_walk' : 'mj_wag_finger'], 4 + (walking ? 2 : 0), (tick / (walking ? 12 : 8)) % (walking ? 6 : 4), MARIJA.x, MARIJA.y, 32, true); }
        HP.forEach((h, i) => { if (!h.got) drawStrip(img.heart, 6, (tick / 7.5 + i) % 6, h.x, h.y, 16); });
        E.forEach(e => {
          if (e.dead > 40) return;
          if (e.kind === 'rot') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : 'move'; const f = e.dead ? e.dead / 8 : e.hurt ? (14 - e.hurt) / 7 : (tick / 8) % 6; drawStrip(img['r_' + a], EH_ROT[a], f, e.x, e.y, 32, e.dir < 0); }
          else if (e.kind === 'moth') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.st === 'dive' ? 'attack' : 'fly'; const f = e.dead ? e.dead / 7.5 : e.hurt ? (14 - e.hurt) / 7 : a === 'attack' ? Math.min(3, e.t / 6) : (tick / 6) % 4; drawStrip(img['m_' + a], EH_MOTH[a], f, e.x - 16, e.y - 16, 32, e.dir < 0); }
          else if (e.kind === 'wolf') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.st === 'tell' || e.st === 'lunge' ? 'lunge' : 'run';
            const f = e.dead ? e.dead / 7.5 : e.hurt ? (14 - e.hurt) / 7 : e.st === 'tell' ? 0 : e.st === 'lunge' ? (e.t < 16 ? 1 + e.t / 8 : 3) : (tick / 5) % 6; drawStrip(img['w_' + a], EH_WOLF[a], f, e.x, e.y, 32, e.dir < 0); }
          else if (e.kind === 'sprite') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.st === 'attack' ? 'attack' : 'fly';
            const f = e.dead ? e.dead / 6 : e.hurt ? (14 - e.hurt) / 7 : a === 'attack' ? e.t / 6 : (tick / 7.5) % 4; drawStrip(img['ss_' + a], EH_SSPR[a], f, e.x - 16, e.y - 16, 32, e.face < 0); }
          else if (e.kind === 'slime') { const a = e.dead ? 'death' : e.frz > 0 ? 'frozen' : e.hurt ? 'hurt' : e.st === 'hop' ? 'hop' : 'idle';
            const f = e.dead ? e.dead / 6 : a === 'frozen' ? 0 : e.hurt ? (14 - e.hurt) / 7 : a === 'hop' ? e.t / 6 : (tick / 10) % 4; drawStrip(img['sl_' + a], EH_SLIME[a], f, e.x, e.y + (e.hy || 0), 32, e.dir < 0); }
          else if (e.kind === 'bat') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.st === 'hang' ? 'hang' : e.st === 'swoop' ? 'swoop' : 'fly';
            const f = e.dead ? e.dead / 6 : e.hurt ? (14 - e.hurt) / 7 : a === 'hang' ? (tick / 20) % 2 : (tick / 5) % 4; drawStrip(img['bt_' + a], EH_BAT[a], f, e.x - 16, e.y - 16, 32, e.dir < 0); }
          else if (e.kind === 'golem') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.crk > 0 ? 'shell_crack' : e.sh > 60 ? 'shell_up' : e.sh > 0 ? 'shell_hold' : 'walk';
            const f = e.dead ? e.dead / 6 : e.hurt ? (14 - e.hurt) / 7 : a === 'shell_crack' ? (24 - e.crk) / 6 : a === 'shell_up' ? (75 - e.sh) / 5 : a === 'shell_hold' ? (tick / 10) % 2 : (tick / 7.5) % 6; drawStrip(img['gl_' + a], EH_GOLEM[a], f, e.x, e.y, 32, e.dir < 0); }
          else if (e.kind === 'rat') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.chase ? 'chase' : 'run'; const f = e.dead ? e.dead / 6 : e.hurt ? (14 - e.hurt) / 7 : (tick / 4) % 6;
            drawStrip(img['rat_' + a], EH_RAT[a], f, e.x - (e.dead ? e.dead * 2 : 0), e.y, 32, e.dir < 0); }
          else if (e.kind === 'spider') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.st === 'drop' ? 'drop' : e.st === 'climb' ? 'climb' : 'idle', f = e.dead ? e.dead / 6 : e.hurt ? (14 - e.hurt) / 7 : (tick / (a === 'drop' ? 6 : a === 'climb' ? 7.5 : 10)) % EH_SPIDER[a];
            if (!e.dead) { ctx.fillStyle = '#d8d0e0'; ctx.fillRect(Math.round(e.x), 32, 1, Math.round(e.y) - 48); }
            drawStrip(img['sp_' + a], EH_SPIDER[a], f, e.x - 16, e.y - 16 + (e.dead ? e.dead * 2 : 0), 32); }
          else if (e.kind === 'wasp') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.atk ? 'attack' : 'fly', f = e.dead ? e.dead / 6 : e.hurt ? (14 - e.hurt) / 7 : (tick / 3) % 4;
            drawStrip(img['wa_' + a], EH_WASP[a], f, e.x - 16, e.y - 16 + (e.dead ? e.dead * 2 : 0), 32, e.dir < 0); }
          else if (e.kind === 'ratling') { if (!e.dead) drawStrip(img.ratling, 6, (tick / 4) % 6, e.x, e.y, 24, e.dir < 0); }
          else if (e.kind === 'shade') { if (e.st === 'gone') return; const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.st === 'fadeout' ? 'fade_out' : e.st === 'fadein' ? 'fade_in' : e.st === 'attack' ? 'attack' : 'fly';
            const f = e.dead ? e.dead / 6 : e.hurt ? (14 - e.hurt) / 7 : a === 'fade_out' || a === 'fade_in' ? e.t / 5 : a === 'attack' ? e.t / 6 : (tick / 7.5) % 4; drawStrip(img['sh_' + a], EH_SHADE[a], f, e.x - 16, e.y - 16, 32, e.dir < 0); }
          else if (e.kind === 'garg') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.st === 'perch' ? 'perch' : e.st === 'wake' ? 'wake' : e.st === 'swoop' ? 'swoop' : 'fly';
            const f = e.dead ? e.dead / 6 : e.hurt ? (14 - e.hurt) / 7 : a === 'wake' ? e.t / 7.5 : a === 'perch' ? 0 : (tick / 6) % 4; drawStrip(img['ga_' + a], EH_GARG[a], f, e.x - 16, e.y - 16, 32, e.dir < 0); }
          else if (e.kind === 'hknight') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.atk > 0 ? 'attack' : e.sh > 60 ? 'shield_up' : e.sh > 0 ? 'shield_hold' : 'walk';
            const f = e.dead ? e.dead / 7.5 : e.hurt ? (14 - e.hurt) / 7 : a === 'attack' ? e.atk / 5 : a === 'shield_up' ? (75 - e.sh) / 5 : a === 'shield_hold' ? (tick / 10) % 2 : (tick / 7.5) % 6; drawStrip(img['hk_' + a], EH_HK[a], f, e.x, e.y, 32, e.dir < 0); }
          else if (e.kind === 'frost') { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.sh > 60 ? 'shield_up' : e.sh > 0 ? 'shield_hold' : 'walk';
            const f = e.dead ? e.dead / 6 : e.hurt ? (14 - e.hurt) / 7 : a === 'shield_up' ? (75 - e.sh) / 5 : a === 'shield_hold' ? (tick / 10) % 2 : (tick / 7.5) % 6; drawStrip(img['fr_' + a], EH_FROST[a], f, e.x, e.y, 32, e.dir < 0); }
          else { const a = e.dead ? 'death' : e.hurt ? 'hurt' : e.st === 'attack' ? 'attack' : 'idle'; const f = e.dead ? e.dead / 7.5 : e.hurt ? (14 - e.hurt) / 7 : a === 'attack' ? e.t / 6 : (tick / 10) % 4; drawStrip(img['s_' + a], EH_SPORE[a], f, e.x, e.y, 32, e.dir < 0); }
        });
        SPORES.forEach(s => drawStrip(img.spore, 4, (s.t / 6) % 4, s.x, s.y, 16));
        SNOW.forEach(s => drawStrip(img.snowball, 4, (s.t / 5) % 4, s.x, s.y, 16));
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
        BUB.forEach(u => { if (u.out) drawStrip(img.bubble, 4, (u.vy < 0 ? 0 : 2) + (Math.floor(tick / 6) % 2), u.x, u.y, 16); });
        if (SAL) { let a, f, hide = false;
          if (SAL.dead) { a = 'defeat'; f = Math.min(5, SAL.dead / 12); }
          else if (SAL.st === 'hidden') hide = true;
          else if (SAL.st === 'dive') { a = 'dive'; f = SAL.t / 7.5; }
          else if (SAL.st === 'surface') { a = 'surface'; f = SAL.t / 7.5; }
          else if (SAL.st === 'spit') { a = 'spit'; f = SAL.t / 6; }
          else if (SAL.hurt > 0) { a = 'hurt'; f = SAL.hurt > 5 ? 0 : 1; }
          else { a = 'idle'; f = (tick / 12) % 4; }
          if (!hide) drawStrip(img['sa_' + a], EH_SAL[a], f, SAL.x, SAL.y, 64, SAL.dir < 0); }
        FIREB.forEach(fb => drawStrip(img[fb.img || 'salball'], 4, (fb.t / 5) % 4, fb.x, fb.y, 16, fb.vx < 0));
        if (TRAP && TRAP.gate) { const g = TRAP.gate; if (g.st === 'closing') drawStrip(img.cg_closing, 4, g.t / 4, g.x, g.y, 32); else drawStrip(img['cg_' + (g.st === 'closed' ? 'closed' : 'open')], 1, 0, g.x, g.y, 32); }
        ICE.forEach(ic => { if (ic.st === 'gone') return; if (ic.k === 'chand') drawStrip(img.chand, 5, ic.st === 'hang' ? 0 : ic.st === 'wobble' ? 1 + Math.floor(ic.t / 5) % 3 : 4, ic.x, ic.y, 32);
          else if (ic.k === 'rock') drawStrip(img.rock, 4, ic.st === 'hang' ? 0 : ic.st === 'wobble' ? Math.floor(ic.t / 4) % 3 : 3, ic.x, ic.y, 16);
          else drawStrip(img.icicle, 5, ic.st === 'hang' ? 0 : ic.st === 'wobble' ? 1 + (Math.floor(ic.t / 6) % 3) : 4, ic.x, ic.y, 16); });
        if (YETI) { let a, f;
          if (YETI.dead) { a = 'defeat'; f = YETI.dead < 40 ? YETI.dead / 10 : 4 + (Math.floor(YETI.dead / 12) % 2); }   // sits, sulks, then waves goodbye
          else if (YETI.hurt > 0) { a = 'hurt'; f = YETI.hurt > 5 ? 0 : 1; }
          else if (YETI.st === 'stomp' || YETI.st === 'throw') { a = YETI.st; f = YETI.t / 6; }
          else if (YETI.st === 'walk' && YETI.awake) { a = 'walk'; f = (tick / 7.5) % 6; }
          else { a = 'idle'; f = (tick / 12) % 4; }
          drawStrip(img['y_' + a], EH_YETI[a], f, YETI.x, YETI.y, 64, YETI.dir < 0); }
        BIGS.forEach(s => drawStrip(img.bigball, 4, (s.t / 6) % 4, s.x, s.y, 32, s.vx < 0));
        if (FW) {
          FW.spots.forEach(x => drawStrip(img.warn_frost, 4, (tick / 7.5) % 4, x - 16, GROUND_Y - 32, 32));
          FW.waves.forEach(v => drawStrip(img.lava_wave, 6, (v.t / 5) % 6, v.x, GROUND_Y - 32, 64, true));
          FW.rain.forEach(r => drawStrip(img.magma, 4, (tick / 6) % 4, r.x - 8, r.y, 16));
          let a, f;
          if (FW.dead) { a = 'death'; f = FW.dead / 7.5; }
          else if (FW.st === 'telegraph') { a = 'telegraph'; f = (FW.t / 15) % 4; }
          else if (FW.st === 'spikes') { a = MC ? 'attack_slam' : 'attack_spikes'; f = FW.t / 6; }
          else if (FW.st === 'breath') { a = MC ? 'attack_rain' : 'attack_breath'; f = FW.t / 7.5; }
          else if (FW.hurt > 0) { a = 'hurt'; f = FW.hurt > 5 ? 0 : 1; }
          else { a = 'idle'; f = (tick / 12) % 4; }
          drawStrip(img['fw_' + a], (MC ? EH_MC : EH_FW)[a], f, FW.x, FW.y, 96, true);
          if (FW.dead > 60 && img.scarf) drawStrip(img.scarf, 1, 0, FW.x + (MC ? 40 : 32), FW.y + 60 + Math.round(Math.sin(tick / 15) * 2), img.scarf.width);   // Baba's red scarf on the ice pile
          FW.spikes.forEach(k => { if (k.t >= 0) drawStrip(img.ice_spike, 6, k.t / 5, k.x - 16, GROUND_Y - 64, 32); });
          if (FW.breath && img.breath) { const m = fwMouth(); ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(-FW_ANG); ctx.scale(-1, 1);
            const bf = Math.min(5, Math.floor(FW.breath.t / 6)); ctx.drawImage(img.breath, bf * 96, 0, 96, 32, 0, -16, 96, 32); ctx.restore(); }
        }
        if (UMB && UMB.st !== 'wait' && UMB.st !== 'joined') { const a = UMB.st === 'down' ? (UMB.t < 24 ? 'stunned' : 'kneel') : UMB.stun > 0 ? 'stunned' : UMB.st === 'dash' ? 'dash' : UMB.st === 'attack' ? 'attack' : 'idle';
          const f = UMB.st === 'down' ? (UMB.t < 24 ? UMB.t / 6 : Math.min(3, (UMB.t - 24) / 7)) : UMB.stun > 0 ? (tick / 6) % 4 : a === 'attack' ? UMB.t / 6 : (tick / 8) % 4; drawStrip(img['um_' + a], EH_UMBRA[a], f, UMB.x, UMB.y, 32, UMB.dir < 0); }
        else if (UMB && UMB.st === 'wait') drawStrip(img.um_idle, 4, (tick / 10) % 4, UMB.x, UMB.y, 32, true);
        if (MRAK) {
          if (MRAK.cage) { const c = MRAK.cage; if (c.st === 'opening') drawStrip(img.cage_opening, 6, c.t / 7.5, c.x, c.y, 64); else drawStrip(img['cage_' + c.st], 1, 0, c.x, c.y, 64); }
          MRAK.spots.forEach(x => drawStrip(img.warn, 4, (tick / 7.5) % 4, x - 16, 256, 32));
          let a, f; const m = MRAK;
          if (m.dead) { a = 'defeat'; f = Math.min(7, m.dead / 7.5); }
          else if (m.st === 'phase') { a = 'phase_change'; f = m.t / 7.5; }
          else if (m.st === 'telegraph') { a = 'telegraph'; f = (m.t / 7.5) % 4; }
          else if (m.st === 'shadow_attack') { a = 'shadow_attack'; f = m.t / 5; }
          else if (m.st.startsWith('warden_')) { a = m.st; f = m.t / 6; }
          else if (m.st === 'stagger') { a = 'stagger'; f = Math.min(3, m.t / 6); }
          else if (m.st === 'laugh') { a = 'laugh'; f = (tick / 7.5) % 4; }
          else if (m.hurt > 0) { a = 'hurt'; f = m.hurt > 5 ? 0 : 1; }
          else { a = m.ph === 2 ? 'summon' : 'idle'; f = (tick / (a === 'summon' ? 7.5 : 12)) % (a === 'summon' ? 6 : 4); }
          if (!(m.dead && m.dead > 80)) drawStrip(img['mk_' + a], EH_MRAK[a], f, m.x, m.y, 128, true);
          m.roots.forEach(r => drawStrip(img.roots, 6, r.t / 5, r.x - 16, 224, 32));
          m.spikes.forEach(k => { if (k.t >= 0) drawStrip(img.ice_spike, 6, k.t / 5, k.x - 16, GROUND_Y - 64, 32); });
          m.waves.forEach(v => drawStrip(img[v.img], 6, (v.t / 5) % 6, v.x, GROUND_Y - 32, 64, true));
          m.orbs.forEach(o => { if (o.t >= 0 && o.t < 999) drawStrip(img.mrak_orb, 4, (o.t / 6) % 4, o.x, o.y, 16); });
          if (m.beamT > 0 && img.beam) { const bx0 = H.x + 24, bx1 = mBody().x + 20, by = H.y + 6, bf = Math.floor(tick / 5) % 6;   // the four stones' braided beam
            for (let x = bx0; x < bx1; x += 64) ctx.drawImage(img.beam, bf * 64, 0, Math.min(64, bx1 - x), 32, Math.round(x), by, Math.min(64, bx1 - x), 32); }
        }
        if (TRAP && TRAP.lavaY < 380 && img.rlava) { const ly = Math.round(TRAP.lavaY), lf = Math.floor(tick / 8) % 4;   // the rising lava, over everything in the trap room
          ctx.drawImage(img.rlava, lf * 640, 0, 640, 32, TRAP.x0, ly, 640, 32); for (let y = ly + 32; y < 360; y += 32) ctx.drawImage(img.rlava_body, TRAP.x0, y); }
        const CUR = ROSTER[H.hero], hkey = CUR.kid ? CUR.id : 'k_' + CUR.el;
        let a, f;
        if (H.dead) { a = 'death'; f = H.dead / 8; }
        else if (H.hurtT > 0) { a = 'hurt'; f = H.hurtT > 8 ? 0 : 1; }
        else if (H.attackT > 0) { a = 'attack'; f = (24 - H.attackT) / 4; }
        else if (!H.ground) { a = H.vy < 0 ? 'jump' : 'fall'; f = (tick / 8) % 2; }
        else if (H.landT > 0) { a = 'land'; f = H.landT > 4 ? 0 : 1; }
        else if (Math.abs(H.vx) > 0.1) { a = 'run'; f = (tick / 5) % 8; }
        else { a = 'idle'; f = (tick / 10) % 4; }
        const carryImg = H.carry && img['carry_' + a];   // Mita with Mishika in his arms
        if (!(H.inv > 0 && !H.dead && H.hurtT <= 0 && Math.floor(tick / 3) % 2)) drawStrip(carryImg || img[`h_${hkey}_${a}`], EH_HERO[a], f, H.x, H.y, 32, H.face < 0);
        B.forEach(b => drawStrip(img['p_' + b.el], 4, (b.t / 4) % 4, b.x, b.y, b.el === 'gold' ? 32 : 16, b.vx < 0));
        X.forEach(x => drawStrip(img[x.k], x.n, x.t / x.d, x.x, x.y, x.w));
        if (FGL) { const hb = heroBox(); let over = false;
          for (let r = Math.floor(hb.y / 32); r <= Math.floor((hb.y + hb.h) / 32) && !over; r++) for (let c = Math.floor(hb.x / 32); c <= Math.floor((hb.x + hb.w) / 32); c++)
            if (r >= 0 && r < MH && c >= 0 && c < MW && FGL.id[r * MW + c] >= 0) { over = true; break; }
          fgA += ((over ? 0.35 : 1) - fgA) * 0.15; ctx.globalAlpha = fgA; drawLayer(FGL); ctx.globalAlpha = 1; }
        ctx.restore();
        if (LV.fgAlways && img.fg) { const o = Math.round(((cam * 1.2) % 640 + 640) % 640), oy = Math.round((tick * 0.5) % 360);   // snowfall drifts down over everything
          for (const yy of [oy - 360, oy]) { ctx.drawImage(img.fg, -o, yy); ctx.drawImage(img.fg, 640 - o, yy); } }
        else if (arenaW > 0 && img.fg) { ctx.globalAlpha = arenaW; const o = Math.round(((cam * 1.2) % 640 + 640) % 640); ctx.drawImage(img.fg, -o, 0); ctx.drawImage(img.fg, 640 - o, 0); ctx.globalAlpha = 1; }
        if (toast) { ctx.font = '8px Silkscreen, "Pixelify Sans", monospace'; ctx.textAlign = 'center'; const w = ctx.measureText(toast.text).width + 16;
          ctx.fillStyle = '#0d0b14'; ctx.fillRect(320 - w / 2 - 1, 63, w + 2, 16); ctx.fillStyle = '#2a2233'; ctx.fillRect(320 - w / 2, 64, w, 14); ctx.fillStyle = '#ffc23d'; ctx.fillText(toast.text, 320, 74); }
        if (H.swapT > 0) { ctx.font = '8px Silkscreen, "Pixelify Sans", monospace'; ctx.textAlign = 'center'; const nm = CUR.name.toUpperCase(), sx = Math.round(H.x - cam + 16), sy = Math.round(H.y - 6);
          ctx.fillStyle = '#0d0b14'; ctx.fillText(nm, sx + 1, sy + 1); ctx.fillStyle = '#ffc23d'; ctx.fillText(nm, sx, sy); }
        // boss bar (ui_bossbar_frame: fill area x 20, y 4, w 184, h 8)
        const bb = eldFight || (ELD && ELD.dead && ELD.dead < 40) ? ELD : salFight || (SAL && SAL.dead && SAL.dead < 40) ? SAL : yetiFight || (YETI && YETI.dead && YETI.dead < 40) ? YETI : BOSS && BOSS.awake && BOSS.dead < 40 ? BOSS : FW && FW.awake && FW.dead < 40 ? FW : MRAK && MRAK.awake && MRAK.dead < 40 ? MRAK : null;
        if (TIMER) {   // the clock (ui_timer: digits inside x 31-89, y 9-23) and the toys still to find
          const sec = Math.ceil(TIMER.left / 60), tx = 320 - 48; if (img.ui_timer) ctx.drawImage(img.ui_timer, tx, 4);
          ctx.font = '16px Silkscreen, "Pixelify Sans", monospace'; ctx.textAlign = 'center'; ctx.fillStyle = sec <= 10 && Math.floor(tick / 15) % 2 ? '#e0521f' : '#e8e0d0';
          ctx.fillText(`${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`, tx + 60, 4 + 22);
          if (LV.cat) { const ic = H.carry ? img.ui_hatch : img.ui_cat, txt = H.carry ? (window.EH_LANG === 'sr' ? 'NAZAD DO OTVORA' : 'BACK TO THE HATCH') : (window.EH_LANG === 'sr' ? 'NAĐI MIŠIKU' : 'FIND MISHIKA');
            if (ic) ctx.drawImage(ic, 640 - 150, 46); ctx.font = '8px Silkscreen, "Pixelify Sans", monospace'; ctx.textAlign = 'left'; ctx.fillStyle = '#0d0b14'; ctx.fillText(txt, 640 - 129, 59); ctx.fillStyle = '#ffc23d'; ctx.fillText(txt, 640 - 130, 58); }
          const got = TOYS.filter(t => t.got).length; if (TOYS.length && img.ui_toybox) ctx.drawImage(img.ui_toybox, 640 - 120, 46);
          ctx.font = '8px Silkscreen, "Pixelify Sans", monospace'; ctx.textAlign = 'left'; if (TOYS.length) { ctx.fillStyle = '#0d0b14'; ctx.fillText(`${got}/${TOYS.length}`, 640 - 99, 59); ctx.fillStyle = '#ffc23d'; ctx.fillText(`${got}/${TOYS.length}`, 640 - 100, 58); } }
        if (MRAK && MRAK.awake && !MRAK.dead && MRAK.ph === 3) {   // the four stones: each cousin must hit him (gold Kosta, orange Katarina, frost Vasilije, green Dimitrije)
          [['konstantin', '#ffc23d'], ['katarina', '#e0521f'], ['vasilije', '#7fd4e8'], ['dimitrije', '#6fae3e']].forEach(([id, c], i) => { const x = 320 - 38 + i * 20, on = MRAK.lit.has(id);
            ctx.fillStyle = '#0d0b14'; ctx.fillRect(x - 1, 51, 14, 14); ctx.fillStyle = c; ctx.globalAlpha = on ? 1 : 0.3; ctx.fillRect(x, 52, 12, 12); ctx.globalAlpha = 1; if (on) { ctx.fillStyle = '#e8e0d0'; ctx.fillRect(x + 2, 54, 3, 3); } }); }
        if (bb && img.bar_frame) {
          const fx0 = 320 - 104, fy0 = 34, fw = Math.round(184 * Math.max(0, bb.hp) / bb.max);
          ctx.drawImage(img.bar_frame, fx0, fy0);
          for (let x = 0; x < fw; x += 8) ctx.drawImage(img.bar_fill, 0, 0, Math.min(8, fw - x), 8, fx0 + 20 + x, fy0 + 4, Math.min(8, fw - x), 8);
          if (bb.hurt > 0) { ctx.fillStyle = 'rgba(232,224,208,0.6)'; ctx.fillRect(fx0 + 20, fy0 + 4, fw, 8); }
          ctx.font = '8px Silkscreen, "Pixelify Sans", monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#0d0b14'; ctx.fillText(window.T(bb.name), 321, fy0 - 3); ctx.fillStyle = '#e8e0d0'; ctx.fillText(window.T(bb.name), 320, fy0 - 4);
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

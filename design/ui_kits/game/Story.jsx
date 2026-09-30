// Story layer for "The Rescue of Baba Vera": intro cutscene, dialogue boxes and Baba's notes.
// Stand-in art (portraits, figures, scenes) is drawn in code from the 16-colour palette until the
// Claude Design story art arrives. Real files replace their stand-ins automatically when present:
//   assets/ui/portraits/portrait_<who>_<mood>.png          (64x64)
//   assets/cutscenes/intro/intro_0N_bg.png (+ _chars, _fx)  (640x360 layers)
// Script text comes from design/story/rescue-of-baba-vera.md.
const EHS_A = '../../../assets/';
const PAL = { ink: '#0d0b14', plum: '#2a2233', slate: '#4a3f55', stone: '#8a7f8e', bone: '#e8e0d0', pine: '#1d3b2e', moss: '#2f6b3a', leaf: '#6fae3e',
  bark: '#5a3a24', amber: '#a8703c', ember: '#8e1f1f', flame: '#e0521f', gold: '#ffc23d', tide: '#2e5fa8', frost: '#7fd4e8', void: '#6b3fa0' };

// ---------------------------------------------------------------- cast
const CAST = {
  kosta:     { name: 'Kosta',     hair: PAL.bark,  hairLo: PAL.plum,  shirt: PAL.stone, shirtLo: PAL.slate, legs: PAL.slate, gem: PAL.gold,  h: 22, style: 'short', sleeves: 'long',  pants: 'long' },
  katarina:  { name: 'Katarina',  hair: PAL.gold,  hairLo: PAL.amber, shirt: PAL.frost, shirtLo: PAL.tide,  legs: PAL.slate, gem: PAL.frost, h: 20, style: 'long',  sleeves: 'short', pants: 'long' },
  vasilije:  { name: 'Vasilije',  hair: PAL.amber, hairLo: PAL.bark,  shirt: PAL.flame, shirtLo: PAL.ember, legs: PAL.plum,  gem: PAL.flame, h: 18, style: 'messy', sleeves: 'short', pants: 'long' },
  dimitrije: { name: 'Dimitrije', hair: PAL.bone,  hairLo: PAL.gold,  shirt: PAL.leaf,  shirtLo: PAL.moss,  legs: PAL.slate, gem: PAL.leaf,  h: 16, style: 'short', sleeves: 'short', pants: 'shorts' },
};
const KIDS = ['kosta', 'katarina', 'vasilije', 'dimitrije'];
const SPEAKER = { ...Object.fromEntries(KIDS.map(k => [k, CAST[k].name])), baba: 'Baba Vera', mrak: 'Mrak', elder: 'Elder Rotroot', blightwarden: 'Blightwarden', ...{ cinder: 'Cinder', brine: 'Brine', basalt: 'Basalt', wisp: 'Wisp', rime: 'Rime', jolt: 'Jolt', umbra: 'Umbra', aurel: 'Aurel' }, all: 'Everyone', kosta_vasilije: 'Kosta & Vasilije' };
// sprite-based portraits for characters that already have art
// Claude Design portrait files: portrait_<file>_<mood>.png (64x64); moods fall back to neutral (or the speaker's default)
const PORTRAIT_FILE = { kosta: 'konstantin', katarina: 'katarina', vasilije: 'vasilije', dimitrije: 'dimitrije', baba: 'baba_vera', mrak: 'mrak',
  cinder: 'knight_fire', brine: 'knight_water', basalt: 'knight_earth', wisp: 'knight_air', rime: 'knight_ice', jolt: 'knight_lightning', umbra: 'knight_shadow', aurel: 'knight_light' };
const PORTRAIT_MOOD = { ali: 'ali_vera' }, PORTRAIT_DEFAULT = { baba: 'warm', mrak: 'menacing' };
const SPRITE_PORTRAIT = {
  elder:        { src: 'sprites/bosses/forest/elder_rotroot/boss_rotroot_idle.png', crop: [6, 2, 52, 52] },
  blightwarden: { src: 'sprites/bosses/forest/blightwarden/boss_blightwarden_idle.png', crop: [18, 4, 64, 64] },
};

// ---------------------------------------------------------------- script
const EH_DIALOGUE = {
  l1_start: [
    { who: 'kosta', text: 'Right. Everyone stay behind me.' },
    { who: 'vasilije', mood: 'ali', text: "Why you? I'm way faster." },
    { who: 'kosta', text: "Because I'm the oldest." },
    { who: 'vasilije', mood: 'ali', text: "That's not even a rule!" },
    { who: 'katarina', mood: 'ali', text: 'Baba said no arguing. It was literally the last thing she wrote.' },
    { who: 'dimitrije', text: "Then I'll lead." },
    { who: 'kosta_vasilije', mood: 'ali', text: 'YOU?' },
    { who: 'dimitrije', text: 'Baba said find her, not argue. You two are arguing. So I’ll take us through the forest.' },
    { who: 'dimitrije', mood: 'happy', text: 'You can keep arguing behind me.' },
    { who: 'katarina', mood: 'happy', text: "…Honestly? He's got a point." },
  ],
  l1_knight_air: [
    { who: 'wisp', text: 'The wind remembers you, little one. I am Wisp. Your stone woke me.' },
    { who: 'dimitrije', mood: 'happy', text: 'Cool! Want to help us find Baba?' },
    { who: 'wisp', text: 'Lead on. I will follow your wind.' },
  ],
  l1_knight_earth: [
    { who: 'basalt', text: "Hmph. Rocks don't hurry." },
    { who: 'basalt', text: "…But I'll come." },
    { who: 'katarina', mood: 'happy', text: 'Basalt is volcanic rock. It cools down really fast, you know.' },
    { who: 'basalt', text: '…She is correct.' },
  ],
  l1_finish: [
    { who: 'katarina', text: "It's almost down! Mita, this one's yours!" },
    { who: 'kosta', mood: 'happy', text: 'Go on, Mita. Finish it!' },
  ],
  l1_elder: [
    { who: 'elder', text: 'ROOTS CRUSH SMALL FEET!' },
    { who: 'dimitrije', text: 'My feet are small. They’re also fast.' },
    { who: 'vasilije', mood: 'happy', text: 'Get him, Mita!' },
  ],
  l1_blight: [
    { who: 'vasilije', mood: 'ali', text: 'My legs are dead. How are you not tired?' },
    { who: 'dimitrije', mood: 'happy', text: 'Football. Every day.' },
    { who: 'katarina', mood: 'ali', text: "I'm not tired. I'm just hungry." },
    { who: 'kosta', mood: 'happy', text: "You're always hungry." },
    { who: 'katarina', text: 'Exactly. So let’s find Baba. She has the cookies.' },
    { who: 'kosta', mood: 'happy', text: 'You were right back there, Mita. Lead the way.' },
    { who: 'dimitrije', mood: 'okej', text: 'Okej.' },
    { who: 'blightwarden', text: "The old woman is gone, little ones. Mrak's shadow-birds carried her over the mountains." },
    { who: 'katarina', text: 'Over the mountains… that’s where it snows.' },
  ],
};
const EH_NOTES = {
  l1: {
    item: 'knitting needles, stuck in a tree',
    lines: ['Dimitrije, well done, my fast boy.', 'Katarina, it is cold where they are taking me.', 'Put on your socks. The warm ones.'],
    replies: [
      { who: 'katarina', mood: 'ali', text: 'Ali Vera! The warm ones are so itchy…' },
      { who: 'dimitrije', mood: 'happy', text: 'I packed extra soft ones. Here.' },
      { who: 'vasilije', mood: 'happy', text: 'Mita, you were right. We were arguing and you just… went.' },
      { who: 'kosta', mood: 'happy', text: 'Yeah. Less arguing, more going. Good leading, Mita.' },
      { who: 'dimitrije', mood: 'happy', text: 'Thanks. Now let’s go get Baba.' },
    ],
  },
};
const INTRO_NOTE = ['Mrak has taken me. Don’t be scared.', 'Each of you has a stone, and everything you need.', 'Follow my red yarn and bring me home before midnight.',
  'Share the cookies. Put on your socks.', 'And no fighting over who is captain. Kosta, Vasilije, I mean you.'];
// scene: duration (s) and timed lines { at, who, mood, text } ; who null = narration caption
const INTRO = [
  { d: 6,  lines: [{ at: 1.0, who: null, text: "New Year's Eve, at Baba Vera's." }] },
  { d: 9,  lines: [{ at: 0.6, who: 'katarina', mood: 'happy', text: "Baba, can I have a cookie? I'm SO hungry." }, { at: 2.6, who: 'baba', mood: 'stern', text: 'Wash your hands before you eat!' },
                   { at: 4.8, who: 'all', text: 'Ali Veraaa!' }, { at: 6.8, who: 'dimitrije', mood: 'happy', text: 'Already did.' }] },
  { d: 8,  lines: [{ at: 0.8, who: 'baba', mood: 'stern', text: 'And pick up your toys. All of them.' }, { at: 3.2, who: 'vasilije', mood: 'ali', text: "They're Kosta's toys!" }, { at: 5.4, who: 'kosta', mood: 'ali', text: 'Half of them are YOURS.' }] },
  { d: 7,  lines: [] },
  { d: 5,  lines: [{ at: 2.2, who: 'baba', mood: 'worried', text: 'Children—!' }] },
  { d: 9,  lines: [{ at: 2.0, who: null, text: 'The chair was empty. Baba Vera was gone.' }] },
  { d: 13, lines: [], note: 1.5 },
  { d: 9,  lines: [{ at: 0.6, who: 'katarina', text: 'She says follow the red yarn.' }, { at: 2.4, who: 'kosta', text: "Okay. I'm the oldest, so I lead." },
                   { at: 4.2, who: 'vasilije', mood: 'ali', text: "No way. I'm faster, so I lead." }, { at: 6.0, who: 'katarina', mood: 'ali', text: 'She JUST said no fighting!' },
                   { at: 7.6, who: 'dimitrije', text: '…I’ll go first, then.' }] },
  { d: 7,  lines: [], title: 3.0 },
];

// ---------------------------------------------------------------- pixel helpers
function ehCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
// 1-art-pixel ink outline around everything opaque, per the pack's art rules
function ehOutline(c) {
  const g = c.getContext('2d'), w = c.width, h = c.height, d = g.getImageData(0, 0, w, h), s = d.data, o = new Uint8ClampedArray(s), op = i => s[i * 4 + 3] > 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (op(i)) continue;
    if ((x > 0 && op(i - 1)) || (x < w - 1 && op(i + 1)) || (y > 0 && op(i - w)) || (y < h - 1 && op(i + w))) { o[i * 4] = 13; o[i * 4 + 1] = 11; o[i * 4 + 2] = 20; o[i * 4 + 3] = 255; } }
  d.data.set(o); g.putImageData(d, 0, 0); return c;
}
const ehCache = {};
const SK = PAL.bone, SKD = PAL.amber;

// full-body stand-in figure (12 wide, height by age), frame 0 = stand, 1/2 = run
function ehKidFigure(who, frame = 0) {
  const key = `fig_${who}_${frame}`; if (ehCache[key]) return ehCache[key];
  const k = CAST[who], H = k.h, c = ehCanvas(14, H + 3), g = c.getContext('2d'), r = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(x + 1, y + 2, w, h); };
  if (k.style === 'long') r(k.hair, 2, 1, 8, 9);
  r(SK, 3, 2, 6, 5); r(SKD, 8, 3, 1, 3);
  r(k.hair, 2, 0, 8, 2); r(k.hairLo, 6, 1, 4, 1);
  if (k.style === 'messy') { r(k.hair, 3, -1); r(k.hair, 6, -1); r(k.hair, 9, -1); }
  if (k.style !== 'long') { r(k.hair, 2, 2, 1, 2); r(k.hair, 9, 2, 1, 1); }
  r(PAL.ink, 4, 4); r(PAL.ink, 7, 4);
  const sh = Math.round((H - 7) * 0.5), y0 = 7 + sh, lh = H - y0;
  r(k.shirt, 2, 7, 8, sh); r(k.shirtLo, 2, 7 + sh - 1, 8, 1);
  if (k.sleeves === 'long') { r(k.shirt, 1, 8, 1, sh - 1); r(k.shirt, 10, 8, 1, sh - 1); r(SK, 1, 7 + sh, 1, 1); r(SK, 10, 7 + sh, 1, 1); }
  else { r(k.shirt, 1, 8, 1, 2); r(k.shirt, 10, 8, 1, 2); r(SK, 1, 10, 1, sh - 2); r(SK, 10, 10, 1, sh - 2); }
  r(k.gem, 5, 8, 2, 1);
  const lx = frame === 1 ? [2, 7] : frame === 2 ? [4, 6] : [3, 7];
  for (const x of lx) {
    if (k.pants === 'shorts') { r(k.legs, x, y0, 2, 2); r(SK, x, y0 + 2, 2, lh - 3); } else r(k.legs, x, y0, 2, lh - 1);
    r(PAL.ink, x, H - 1, 2, 1);
  }
  return (ehCache[key] = ehOutline(c));
}
function ehBabaFigure(frame = 0) {
  const key = `fig_baba_${frame}`; if (ehCache[key]) return ehCache[key];
  const c = ehCanvas(16, 25), g = c.getContext('2d'), r = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(x + 1, y + 2, w, h); };
  r(PAL.stone, 5, 0, 4, 2); r(PAL.stone, 3, 2, 8, 2);
  r(SK, 4, 3, 6, 5); r(SKD, 9, 4, 1, 3); r(PAL.stone, 3, 3, 1, 2); r(PAL.stone, 10, 3, 1, 2);
  r(PAL.ink, 4, 5, 2, 1); r(PAL.ink, 8, 5, 2, 1); r(PAL.ink, 6, 5, 2, 1);
  r(PAL.ember, 3, 8, 8, 2); r(PAL.flame, 3, 8, 8, 1); r(PAL.ember, 9, 10, 2, 3);
  r(PAL.tide, 2, 10, 10, 10); r(PAL.bone, 4, 11, 6, 9);
  const arm = frame === 1 ? -3 : 0; r(PAL.tide, 1, 11 + (arm ? -2 : 0), 1, 4); r(SK, 1, 15 + arm, 1, 1); r(PAL.tide, 12, 11, 1, 4); r(SK, 12, 15, 1, 1);
  r(PAL.ink, 4, 20, 2, 1); r(PAL.ink, 8, 20, 2, 1);
  return (ehCache[key] = ehOutline(c));
}
// 32x32 stand-in portrait (+1px outline border)
function ehPortrait(who, mood = 'neutral') {
  const key = `por_${who}_${mood}`; if (ehCache[key]) return ehCache[key];
  const c = ehCanvas(34, 34), g = c.getContext('2d'), r = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(x + 1, y + 1, w, h); };
  const eyes = (m, browCol) => {
    if (m === 'happy') { for (const x of [12, 18]) { r(PAL.ink, x, 13, 2, 1); r(PAL.ink, x - 1, 14); r(PAL.ink, x + 2, 14); } }
    else if (m === 'ali') { r(PAL.ink, 12, 12, 2, 1); r(PAL.ink, 18, 12, 2, 1); r(browCol, 11, 10, 4, 1); r(browCol, 17, 10, 4, 1); }
    else if (m === 'okej') { r(PAL.ink, 12, 14, 2, 1); r(PAL.ink, 18, 14, 2, 1); }
    else if (m === 'stern') { r(PAL.ink, 12, 13, 2, 2); r(PAL.ink, 18, 13, 2, 2); r(browCol, 11, 11, 4, 1); r(browCol, 17, 11, 4, 1); r(browCol, 14, 12); r(browCol, 17, 12); }
    else { r(PAL.ink, 12, 13, 2, 3); r(PAL.ink, 18, 13, 2, 3); }
  };
  const mouth = m => {
    if (m === 'happy' || m === 'warm') { r(PAL.ink, 13, 18); r(PAL.ink, 14, 19, 4, 1); r(PAL.ink, 18, 18); }
    else if (m === 'ali' || m === 'worried') { r(PAL.ink, 14, 18, 4, 1); r(PAL.ember, 14, 19, 4, 2); r(PAL.ink, 14, 21, 4, 1); }
    else if (m === 'okej') { r(PAL.ink, 15, 19, 3, 1); r(PAL.ink, 18, 18); }
    else r(PAL.ink, 14, 19, 4, 1);
  };
  const face = () => { r(SK, 9, 7, 14, 15); r(SK, 10, 22, 12, 1); r(SKD, 21, 9, 2, 12); };
  if (CAST[who]) {
    const k = CAST[who];
    r(k.shirt, 5, 25, 22, 7); r(k.shirtLo, 5, 31, 22, 1); r(k.gem, 15, 27, 2, 2);
    r(SKD, 13, 21, 6, 4);
    if (k.style === 'long') r(k.hair, 7, 6, 18, 21);
    face();
    r(k.hair, 8, 3, 16, 5); r(k.hair, 7, 5, 2, k.style === 'long' ? 20 : 7); r(k.hair, 23, 5, 2, k.style === 'long' ? 20 : 7); r(k.hair, 9, 7, 9, 2); r(k.hairLo, 18, 7, 5, 1);
    if (k.style === 'messy') { r(k.hair, 10, 1, 2, 2); r(k.hair, 15, 0, 2, 3); r(k.hair, 20, 1, 2, 2); }
    eyes(mood, k.hairLo); mouth(mood);
  } else if (who === 'baba') {
    r(PAL.tide, 5, 25, 22, 7); r(PAL.bone, 11, 25, 2, 7); r(PAL.bone, 19, 25, 2, 7);
    r(SKD, 13, 20, 6, 3); face();
    r(PAL.ember, 8, 22, 16, 4); r(PAL.flame, 8, 22, 16, 1);
    r(PAL.stone, 8, 4, 16, 5); r(PAL.stone, 12, 0, 8, 4); r(PAL.stone, 7, 6, 2, 6); r(PAL.stone, 23, 6, 2, 6);
    eyes(mood === 'warm' ? 'happy' : mood, PAL.stone);
    r(PAL.ink, 10, 12, 6, 1); r(PAL.ink, 17, 12, 6, 1); r(PAL.ink, 16, 13); r(PAL.ink, 10, 16, 6, 1); r(PAL.ink, 17, 16, 6, 1); r(PAL.ink, 10, 12, 1, 5); r(PAL.ink, 22, 12, 1, 5);
    mouth(mood);
  } else if (who === 'mrak') {
    r(PAL.plum, 4, 19, 24, 13); r(PAL.void, 7, 21, 18, 11);
    r(PAL.slate, 10, 8, 12, 14); r(PAL.plum, 19, 9, 3, 12);
    r(PAL.frost, 12, 14, 3, 1); r(PAL.frost, 18, 14, 3, 1);
    r(PAL.void, 9, 5, 14, 3); for (const x of [10, 14, 18, 22]) r(PAL.void, x, 1, 1, 4);
  }
  return (ehCache[key] = ehOutline(c));
}

// ---------------------------------------------------------------- React pieces
function Portrait({ who, mood = 'neutral', size = 128 }) {
  const ref = React.useRef(null);
  const [real, setReal] = React.useState(null);
  React.useEffect(() => {
    let on = true; setReal(null); const f = PORTRAIT_FILE[who]; if (!f) return;
    const tries = [...new Set([PORTRAIT_MOOD[mood] || mood, PORTRAIT_DEFAULT[who] || 'neutral'])].map(m => EHS_A + `ui/portraits/portrait_${f}_${m}.png`);
    const next = i => { if (i >= tries.length || !on) return; const im = new Image(); im.onload = () => on && setReal(im.src); im.onerror = () => next(i + 1); im.src = tries[i]; };
    next(0); return () => { on = false; };
  }, [who, mood]);
  React.useEffect(() => {
    const c = ref.current; if (!c || real) return; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.clearRect(0, 0, c.width, c.height);
    const sp = SPRITE_PORTRAIT[who];
    if (sp) { const i = new Image(); i.onload = () => { g.clearRect(0, 0, 64, 64); g.drawImage(i, sp.crop[0], sp.crop[1], sp.crop[2], sp.crop[3], 0, 0, 64, 64); }; i.src = EHS_A + sp.src; }
    else if (CAST[who] || who === 'baba' || who === 'mrak') g.drawImage(ehPortrait(who, mood), 0, 0);
  }, [who, mood, real]);
  const st = { width: size, height: size, imageRendering: 'pixelated', display: 'block' };
  const n = SPRITE_PORTRAIT[who] ? 64 : 34;   // stand-in portraits are 32px + 1px outline border
  return real ? <img src={real} style={st} /> : <canvas key={n} ref={ref} width={n} height={n} style={st} />;
}
function PortraitSlot({ who, mood }) {
  const box = { width: 128, height: 128, display: 'grid', placeItems: 'center', flex: 'none' };
  if (who === 'all') return <div style={box}><div style={{ display: 'grid', gridTemplateColumns: '64px 64px' }}>{KIDS.map(k => <Portrait key={k} who={k} mood={mood || 'ali'} size={64} />)}</div></div>;
  if (who === 'kosta_vasilije') return <div style={box}><div style={{ display: 'flex' }}>{['kosta', 'vasilije'].map(k => <Portrait key={k} who={k} mood={mood} size={64} />)}</div></div>;
  return <div style={box}><Portrait who={who} mood={mood} size={128} /></div>;
}
// visual only; DialogueRunner / IntroCutscene drive it. Layout follows Claude Design's mock (640x360 art at 2x):
// box x 8, y 256, 624x96 · portrait (18, 272) · name tag at (92, 248) · text from (92, 272). pos 'top' mirrors it to the top edge.
function DialogueBox({ line, shown, done, interactive, pos = 'bottom' }) {
  if (!line) return null;
  const text = shown == null ? line.text : line.text.slice(0, shown);
  if (!line.who) return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 40, color: PAL.bone, textShadow: 'var(--text-outline)' }}>{text}</div>
  );
  const UI = EHS_A + 'ui/', px = { imageRendering: 'pixelated' };
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, height: 192, ...(pos === 'top' ? { top: 32 } : { bottom: 16 }) }}>
      <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderStyle: 'solid', borderWidth: 16, borderImage: `url(${UI}ui_dialogue_box.png) 8 fill / 16px stretch`, ...px }} />
      <div style={{ position: 'absolute', left: 20, top: 32 }}><PortraitSlot who={line.who} mood={line.mood} /></div>
      <div style={{ position: 'absolute', left: 168, top: -16, height: 32, boxSizing: 'border-box', borderStyle: 'solid', borderWidth: '0 12px', borderImage: `url(${UI}ui_name_tag.png) 0 6 fill / 0 12px stretch`, ...px,
        padding: '8px 4px 0', fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: '16px', color: PAL.bone, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{SPEAKER[line.who] || line.who}</div>
      <div style={{ position: 'absolute', left: 168, right: 32, top: 34, fontFamily: 'var(--font-body)', fontSize: 30, lineHeight: 1.35, color: PAL.bone, textShadow: 'var(--text-outline)' }}>{text}</div>
      {interactive && done && <div style={{ position: 'absolute', right: 28, bottom: 20, fontFamily: 'var(--font-ui)', fontSize: 16, color: PAL.gold, animation: 'ehBlink 1s steps(2) infinite' }}>SPACE ▶</div>}
    </div>
  );
}
// key handling that runs before the game's own listeners, so Space/Esc don't also jump or pause
function useStoryKeys(handler) {
  const ref = React.useRef(handler); ref.current = handler;
  React.useEffect(() => {
    const k = e => { if (['Space', 'Enter', 'NumpadEnter', 'Escape', 'KeyF', 'KeyJ', 'KeyX'].includes(e.code)) { e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) ref.current(e.code); } };
    window.addEventListener('keydown', k, true); return () => window.removeEventListener('keydown', k, true);
  }, []);
}
function DialogueRunner({ lines, onDone }) {
  const [i, setI] = React.useState(0), [shown, setShown] = React.useState(0);
  const line = lines[i], done = line && shown >= line.text.length;
  React.useEffect(() => { setShown(0); if (!line) return; const t = setInterval(() => setShown(s => Math.min(line.text.length, s + 1)), 28); return () => clearInterval(t); }, [i]);
  const next = () => { if (!line) return; if (!done) setShown(line.text.length); else if (i + 1 < lines.length) setI(i + 1); else onDone(); };
  useStoryKeys(code => (code === 'Escape' ? onDone() : next()));
  return <div style={{ position: 'absolute', inset: 0 }} onClick={next}><DialogueBox line={line} shown={shown} done={done} interactive /></div>;
}
// ui_note_paper.png is 320x200 (shown 2x): 36px red margin, ruled lines 16px apart from y 30
function BabaNote({ lines, style }) {
  return (
    <div style={{ width: 640, height: 400, boxSizing: 'border-box', padding: '34px 36px 0 80px', background: `url(${EHS_A}ui/ui_note_paper.png) 0 0 / 640px 400px no-repeat`, imageRendering: 'pixelated',
      fontFamily: 'var(--font-body)', fontSize: 23, lineHeight: '32px', color: PAL.ink, ...style }}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
      <div style={{ textAlign: 'right', color: PAL.ember }}>— Baba</div>
    </div>
  );
}
function NoteScreen({ level, onDone }) {
  const n = EH_NOTES[level]; const [phase, setPhase] = React.useState('note');
  React.useEffect(() => { if (!n) onDone(); }, []);
  if (!n) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,11,20,.7)' }}>
      <div style={{ position: 'absolute', top: phase === 'note' ? 90 : 40, left: 0, right: 0, display: 'grid', placeItems: 'center', gap: 16 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 18, color: PAL.gold, textShadow: 'var(--text-outline)', textTransform: 'uppercase' }}>Found: {n.item}</div>
        <BabaNote lines={n.lines} />
      </div>
      {phase === 'note' ? <NoteWait onNext={() => setPhase('reply')} /> : <DialogueRunner lines={n.replies} onDone={onDone} />}
    </div>
  );
}
function NoteWait({ onNext }) {
  useStoryKeys(() => onNext());
  return <div style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} onClick={onNext}>
    <div style={{ position: 'absolute', right: 40, bottom: 32, fontFamily: 'var(--font-ui)', fontSize: 18, color: PAL.gold, textShadow: 'var(--text-outline)', animation: 'ehBlink 1s steps(2) infinite' }}>SPACE ▶</div></div>;
}

// ---------------------------------------------------------------- intro cutscene (watch-only, skippable)
function IntroCutscene({ onDone }) {
  const cv = React.useRef(null);
  const [realTitle, setRealTitle] = React.useState(false), [hover, setHover] = React.useState(false);
  const [line, setLine] = React.useState(null), [note, setNote] = React.useState(false), [title, setTitle] = React.useState(false), [skip, setSkip] = React.useState(false);
  const doneRef = React.useRef(false);
  const finish = () => { if (!doneRef.current) { doneRef.current = true; onDone(); } };
  useStoryKeys(code => { if (code === 'Escape' || code === 'Enter' || code === 'NumpadEnter') finish(); });
  React.useEffect(() => {
    let alive = true, raf = 0; const img = {}, real = {};
    const ld = (k, p) => new Promise(r => { const i = new Image(); i.onload = () => { img[k] = i; r(true); }; i.onerror = () => r(false); i.src = EHS_A + p; });
    const t0 = performance.now(); let lastLine = null, lastNote = false, lastTitle = false;
    const starts = []; let acc = 0; for (const s of INTRO) { starts.push(acc); acc += s.d; } const total = acc;
    ['sky', 'far', 'mid', 'near'].forEach(k => ld(k, `backgrounds/forest/bg_forest_${k}.png`));
    fetch(EHS_A + 'cutscenes/intro/intro.json').then(r => r.ok ? r.json() : null).catch(() => null).then(j => {
      if (!j) return; j.scenes.slice(0, INTRO.length).forEach((sc, n) =>
        Promise.all(sc.layers.map(l => ld(`L${n}_${l.name}`, 'cutscenes/intro/' + l.file))).then(ok => { if (ok[0]) real[n] = true; if (n === INTRO.length - 1 && img[`L${n}_title`]) setRealTitle(true); }));
    });
    const setT = setTimeout(() => alive && setSkip(true), 1000);
    const g = cv.current.getContext('2d'); g.imageSmoothingEnabled = false;
    const R = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
    const fig = (c, x, y, s = 3, flip = false) => { g.save(); g.translate(Math.round(x) + (flip ? c.width * s : 0), Math.round(y - c.height * s)); g.scale(flip ? -s : s, s); g.drawImage(c, 0, 0); g.restore(); };
    const forest = (cam, dy = 0) => { for (const [k, p] of [['sky', 0], ['far', 0.1], ['mid', 0.25], ['near', 0.45]]) { if (!img[k]) continue; const o = Math.round(((cam * p) % 640 + 640) % 640); g.drawImage(img[k], -o, dy); g.drawImage(img[k], 640 - o, dy); } };
    const snow = (t, n = 90) => { for (let i = 0; i < n; i++) { const sp = 1 + (i % 3); R(PAL.bone, ((i * 97 + t * 12 * sp) % 660) - 10, (i * 53 + t * 30 * sp) % 370 - 10, sp > 2 ? 2 : 1, sp > 2 ? 2 : 1); } };
    const house = (x, y, t) => { const fl = 0.85 + 0.15 * Math.sin(t * 7);
      for (let i = 0; i < 40; i++) R(PAL.ink, x - 10 + i * 1.5, y - 40 + i, 150 - i * 3, 1);
      R(PAL.plum, x, y, 130, 70); R(PAL.slate, x, y, 130, 3); R(PAL.bark, x + 56, y + 36, 18, 34);
      g.globalAlpha = fl; for (const wx of [x + 14, x + 92]) { R(PAL.gold, wx, y + 18, 22, 18); R(PAL.flame, wx, y + 30, 22, 6); } g.globalAlpha = 0.25 * fl; R(PAL.gold, x - 20, y - 10, 170, 100); g.globalAlpha = 1;
      R(PAL.slate, x + 100, y - 46, 12, 22); for (let i = 0; i < 5; i++) R(PAL.stone, x + 104 + Math.sin(t * 2 + i) * 4, y - 56 - i * 10 - (t * 8 % 10), 5, 4); };
    const kitchen = (dark = 0) => {
      R(PAL.plum, 0, 0, 640, 360); for (let x = 0; x < 640; x += 32) R(PAL.slate, x, 0, 1, 230);
      R(PAL.bark, 0, 230, 640, 8); R(PAL.amber, 0, 300, 640, 140); for (let x = 0; x < 640; x += 40) R(PAL.bark, x, 300, 2, 140); R(PAL.bark, 0, 300, 640, 3);
      R(PAL.ink, 250, 60, 110, 90); R(PAL.pine, 256, 66, 98, 78); R(PAL.ink, 303, 60, 4, 90); R(PAL.ink, 250, 103, 110, 4); for (let i = 0; i < 6; i++) R(PAL.bone, 262 + i * 15, 76 + (i * 7) % 50, 2, 2);
      R(PAL.slate, 480, 200, 90, 100); R(PAL.stone, 480, 200, 90, 6); R(PAL.ink, 492, 222, 66, 50); R(PAL.ember, 496, 226, 58, 42); R(PAL.flame, 500, 250, 50, 14);
      R(PAL.stone, 40, 230, 70, 70); R(PAL.tide, 48, 238, 54, 16); R(PAL.stone, 70, 214, 6, 18);
      if (dark) { g.globalAlpha = dark; R(PAL.ink, 0, 0, 640, 360); g.globalAlpha = 1; } };
    const table = (x, y) => { R(PAL.bark, x, y, 150, 10); R(PAL.amber, x, y, 150, 3); R(PAL.bark, x + 10, y + 10, 8, 300 - y - 10); R(PAL.bark, x + 132, y + 10, 8, 300 - y - 10); };
    const cookies = (x, y) => { R(PAL.stone, x, y, 44, 4); for (let i = 0; i < 4; i++) { R(PAL.amber, x + 3 + i * 10, y - 6, 8, 6); R(PAL.bark, x + 5 + i * 10, y - 4, 2, 2); } };
    const kidsAt = (xs, t, run = false, s = 3, y = 300) => KIDS.forEach((k, i) => fig(ehKidFigure(k, run ? 1 + Math.floor(t * 8 + i) % 2 : 0), xs[i], y, s));
    const scenes = [
      t => { forest(t * 20); house(470 - t * 5, 230, t); snow(t); },
      t => { kitchen(); table(150, 250); cookies(200, 250);
        const e = Math.min(1, Math.max(0, (t - 0.4) / 1.6)), hop = t > 4.8 && t < 5.6 ? -Math.abs(Math.sin((t - 4.8) * 8)) * 10 : 0;
        const tx = [150, 205, 255, 300], xs = tx.map((x, i) => -60 + (x + 60) * e);
        if (t > 6.8) xs[3] = Math.max(60, 300 - (t - 6.8) * 160);
        KIDS.forEach((k, i) => fig(ehKidFigure(k, e < 1 || (i === 3 && t > 6.8 && xs[3] > 60) ? 1 + Math.floor(t * 8) % 2 : 0), xs[i], 300 + hop, 3, i === 3 && t > 6.8));
        fig(ehBabaFigure(t > 2.6 && t < 4.6 && Math.floor(t * 4) % 2 ? 1 : 0), 420, 300, 3, true); cookies(404, 236 - (t < 1 ? t * 10 : 10)); },
      t => { R(PAL.plum, 0, 0, 640, 360); R(PAL.slate, 0, 0, 640, 12); R(PAL.moss, 0, 300, 640, 140); R(PAL.pine, 120, 300, 400, 40);
        R(PAL.ink, 80, 70, 64, 92); R(PAL.ember, 84, 74, 56, 84); g.fillStyle = PAL.gold; g.font = '8px Silkscreen, monospace'; g.textAlign = 'center';
        ['THE RISE', 'OF THE', 'KARATE', 'BADASS'].forEach((w, i) => g.fillText(w, 112, 96 + i * 14)); R(PAL.bone, 100, 144, 24, 2);
        R(PAL.ink, 540, 200, 4, 100); R(PAL.ink, 528, 298, 28, 3); R(PAL.slate, 530, 186, 24, 16); R(PAL.frost, 534, 190, 16, 8);
        for (const [x, c] of [[190, PAL.tide], [230, PAL.gold], [330, PAL.flame], [380, PAL.leaf], [440, PAL.frost]]) R(c, x, 290, 12, 10);
        const bx = 280 + Math.sin(t * 2) * 40; R(PAL.bone, bx, 288, 12, 12); R(PAL.ink, bx + 4, 292, 4, 4);
        const slump = t > 3.8 ? 4 : 0; fig(ehKidFigure('kosta'), 150, 300 + slump, 3); fig(ehKidFigure('vasilije'), 200, 300 + slump, 3); fig(ehKidFigure('katarina'), 330, 300, 3, true); fig(ehKidFigure('dimitrije'), 380, 300, 3, true);
        fig(ehBabaFigure(Math.floor(t * 4) % 2), 460, 300, 3, true); },
      t => { R(PAL.ink, 0, 0, 640, 360); g.save(); g.beginPath(); g.rect(110, 40, 420, 260); g.clip(); forest(0);
        g.globalAlpha = 0.75; R(PAL.plum, 110, 40, 420, 260); g.globalAlpha = 1;
        for (let i = 0; i < 6; i++) { const cx = ((i * 140 + t * 30) % 700) - 60; R(PAL.slate, cx, 40 + (i % 3) * 18, 140, 22); R(PAL.stone, cx + 20, 44 + (i % 3) * 18, 90, 3); }
        const rise = Math.min(1, Math.max(0, (t - 1) / 4)), sy = 320 - rise * 220;
        R(PAL.void, 230, sy + 40, 180, 300); R(PAL.plum, 250, sy + 60, 140, 300); R(PAL.slate, 285, sy, 70, 80);
        for (let i = 0; i < 7; i++) R(PAL.ink, 280 + i * 12, sy - 26 + (i % 2) * 8, 5, 30);
        const eo = Math.min(1, Math.max(0, (t - 5.2) / 0.5)); R(PAL.frost, 298, sy + 38, 16, Math.max(0, Math.round(5 * eo))); R(PAL.frost, 326, sy + 38, 16, Math.max(0, Math.round(5 * eo)));
        if ((t > 2.2 && t < 2.35) || (t > 4.1 && t < 4.2)) { g.globalAlpha = 0.8; R(PAL.bone, 110, 40, 420, 260); g.globalAlpha = 1; }
        g.restore(); R(PAL.bark, 104, 34, 432, 6); R(PAL.bark, 104, 300, 432, 10); R(PAL.bark, 104, 34, 6, 276); R(PAL.bark, 530, 34, 6, 276); R(PAL.bark, 317, 34, 6, 276); R(PAL.bark, 104, 168, 432, 6); },
      t => { if (t < 1.2) kitchen(Math.floor(t * 12) % 3 === 0 ? 0.85 : 0.2); else R(PAL.ink, 0, 0, 640, 360);
        if (t > 2 && t < 2.12) { kitchen(0.5); fig(ehBabaFigure(1), 420, 300, 3, true); } },
      t => { g.save(); g.translate(-Math.min(120, t * 16), 0); kitchen(0.15); table(150, 250); cookies(200, 250);
        R(PAL.bark, 380, 220, 40, 6); R(PAL.bark, 380, 226, 6, 74); R(PAL.bark, 414, 226, 6, 74); R(PAL.bark, 380, 180, 6, 40); R(PAL.bone, 388, 196, 22, 30); R(PAL.ember, 388, 196, 22, 3);
        R(PAL.ink, 640, 110, 110, 190); R(PAL.pine, 646, 116, 98, 184); snow(t, 30); R(PAL.bark, 740, 110, 14, 190);
        g.fillStyle = PAL.flame; for (let x = 220; x < 760; x += 2) g.fillRect(x, 296 + Math.round(Math.sin(x / 18) * 2), 2, 2);
        g.restore(); snow(t, 20); },
      t => { R(PAL.bark, 0, 0, 640, 360); for (let y = 12; y < 360; y += 22) R(PAL.plum, 0, y, 640, 2);
        R(PAL.ink, 190, 150, 260, 130); R(PAL.bark, 194, 154, 252, 122); R(PAL.amber, 194, 154, 252, 6); R(PAL.ink, 190, 80, 260, 70); R(PAL.amber, 194, 84, 252, 62);
        [PAL.gold, PAL.frost, PAL.flame, PAL.leaf].forEach((c, i) => { const p = 0.6 + 0.4 * Math.sin(t * 3 + i); g.globalAlpha = 0.35 * p; R(c, 206 + i * 60, 172, 48, 48); g.globalAlpha = 1; R(PAL.ink, 216 + i * 60, 182, 28, 28); R(c, 218 + i * 60, 184, 24, 24); R(PAL.bone, 222 + i * 60, 188, 6, 6); }); },
      t => { kitchen(0.35); const who = INTRO[7].lines.filter(l => l.at <= t).pop(); const talk = k => who && (who.who === k || who.who === 'all') && t - who.at < 0.5 ? -6 : 0;
        fig(ehKidFigure('kosta'), 150, 310 + talk('kosta'), 4); fig(ehKidFigure('vasilije'), 230, 310 + talk('vasilije'), 4);
        fig(ehKidFigure('katarina'), 360, 310 + talk('katarina'), 4, true); fig(ehKidFigure('dimitrije'), 440, 310 + talk('dimitrije'), 4, true); },
      t => { forest(t * 90); snow(t, 60); g.fillStyle = PAL.flame; for (let x = 0; x < 640; x += 2) g.fillRect(x, 300 + Math.round(Math.sin((x + t * 90) / 18) * 2), 2, 2);
        kidsAt([140, 190, 235, 275].map((x, i) => x + Math.sin(t * 3 + i) * 6), t, true, 3, 300);
        R(PAL.bone, 600 - (t * 10) % 20, 290, 10, 7); R(PAL.bone, 606 - (t * 10) % 20, 286, 5, 5); },
    ];
    // Claude Design layers (bg, chars, fg, fx, title; 640x360 each) animated per cutscenes/intro/README.md, moved in whole 2px steps
    const real2 = (n, t) => {
      const L = k => img[`L${n}_${k}`], d = (im, x = 0, y = 0) => im && g.drawImage(im, Math.round(x / 2) * 2, Math.round(y / 2) * 2);
      const slide = (from, dur) => from * Math.max(0, 1 - t / dur);
      if (n === 0) { d(L('bg')); const y = (t * 24) % 360; d(L('fx'), 0, y); d(L('fx'), 0, y - 360); }
      else if (n === 1) { d(L('bg')); d(L('chars'), slide(-320, 1.2)); d(L('fx'), 0, -2 * (Math.floor(t * 3) % 3)); }
      else if (n === 2) { d(L('bg')); if (Math.floor(t * 8) % 11) d(L('fx')); }
      else if (n === 3) { d(L('bg')); d(L('chars'), 0, 40 - Math.min(40, t * 10)); d(L('fg')); if ((t > 2.2 && t < 2.35) || (t > 4.1 && t < 4.2) || (t > 5.9 && t < 6.0)) d(L('fx')); }
      else if (n === 4) { d(L('bg')); if ((t > 1.2 && t < 1.24) || t > 1.34) d(L('fx')); }
      else if (n === 5) { d(L('bg')); const x = (t * 40) % 640; d(L('fx'), x); d(L('fx'), x - 640); }
      else if (n === 6) { d(L('bg')); d(L('chars')); if (Math.floor(t / 0.4) % 2 === 0) d(L('fx')); }
      else if (n === 7) { d(L('bg')); const ch = L('chars'); if (ch) { const k = Math.min(1, t / 0.8), xl = Math.round(-320 * (1 - k) / 2) * 2, xr = Math.round(320 * (1 - k) / 2) * 2;
          g.drawImage(ch, 0, 0, 320, 360, xl, 0, 320, 360); g.drawImage(ch, 320, 0, 320, 360, 320 + xr, 0, 320, 360); } d(L('fx')); }
      else if (n === 8) { d(L('bg')); d(L('chars'), 0, -Math.min(16, t * 4) - 2 * (Math.floor(t * 8) % 2)); d(L('fx')); if (t > 1.5) d(L('title'), 0, -Math.max(0, 80 - (t - 1.5) * 200)); }
    };
    const loop = () => {
      if (!alive) return; const T = (performance.now() - t0) / 1000;
      if (T >= total) { finish(); return; }
      let n = starts.findIndex((s, i) => T >= s && (i === starts.length - 1 || T < starts[i + 1])); const t = T - starts[n], S = INTRO[n];
      g.globalAlpha = 1; R(PAL.ink, 0, 0, 640, 360);
      if (real[n]) real2(n, t);
      else { const lift = [1, 2, 4, 5, 7].includes(n) ? 72 : 0; g.save(); g.translate(0, -lift); scenes[n](t); g.restore(); }
      const fade = Math.min(1, t / 0.4, (S.d - t) / 0.3); if (fade < 1 && n !== 4) { g.globalAlpha = 1 - Math.max(0, fade); R(PAL.ink, 0, 0, 640, 360); g.globalAlpha = 1; }
      const ln = S.lines.filter(l => l.at <= t).pop() || null; if (ln !== lastLine) { lastLine = ln; setLine(ln); }
      const nt = S.note != null && t >= S.note; if (nt !== lastNote) { lastNote = nt; setNote(nt); }
      const tt = S.title != null && t >= S.title && !real[n]; if (tt !== lastTitle) { lastTitle = tt; setTitle(tt); }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { alive = false; cancelAnimationFrame(raf); clearTimeout(setT); };
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, background: PAL.ink }}>
      <canvas ref={cv} width={640} height={360} style={{ width: 1280, height: 720, imageRendering: 'pixelated', display: 'block' }} />
      {note && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', animation: 'ehFadeIn .6s' }}><BabaNote lines={INTRO_NOTE} /></div>}
      {title && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', animation: 'ehFadeIn 1s' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 110, lineHeight: 1, color: PAL.gold, textShadow: `-6px 0 0 ${PAL.ink},6px 0 0 ${PAL.ink},0 -6px 0 ${PAL.ink},0 6px 0 ${PAL.ink},6px 12px 0 ${PAL.ember}` }}>Elemental Heroes</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 30, color: PAL.bone, textShadow: 'var(--text-outline)', textTransform: 'uppercase', marginTop: 18 }}>The Rescue of Baba Vera</div>
        </div></div>}
      <DialogueBox line={line} pos={line && [1, 7].includes(INTRO.findIndex(sc => sc.lines.includes(line))) ? 'top' : 'bottom'} />
      {skip && <button onClick={finish} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-label="Skip intro"
        style={{ position: 'absolute', right: 28, top: 24, width: 160, height: 40, padding: 0, border: 'none', cursor: 'pointer', animation: 'ehFadeIn .4s', imageRendering: 'pixelated',
          background: `url(${EHS_A}ui/ui_skip_button.png) ${hover ? '-160px' : '0'} 0 / 320px 40px no-repeat` }} />}
    </div>
  );
}

(function () { if (document.getElementById('eh-story-css')) return; const s = document.createElement('style'); s.id = 'eh-story-css';
  s.textContent = '@keyframes ehBlink{0%{opacity:1}100%{opacity:0}}@keyframes ehFadeIn{from{opacity:0}to{opacity:1}}'; document.head.appendChild(s); })();
Object.assign(window, { IntroCutscene, DialogueRunner, NoteScreen, EH_DIALOGUE, EH_NOTES });

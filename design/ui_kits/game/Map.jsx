// World map and saved progress. The map is Claude Design's ui_world_map (+ labels + Baba marker);
// ui_world_map.json gives the level nodes and the red-yarn path in 640x360 coordinates (drawn at 2x here).
const EHM_A = '../../../assets/';
const EH_LEVELS = [
  { id: 'l1', node: 'forest', name: 'The Whispering Forest', star: 'Dimitrije', ready: true },
  { id: 'l2', node: 'peaks',  name: 'The Frostfang Peaks',   star: 'Katarina',  ready: true },
  { id: 'l3', node: 'caves',  name: 'Cinderdeep Caves',      star: 'Vasilije',  ready: true },
  { id: 'l4', node: 'keep',   name: 'The Hollow Keep',       star: 'Kosta',     ready: true },
  { id: 'l5', node: 'village', name: 'The Big Tidy-Up',      star: 'Everyone',  ready: true, at: [130, 40] },   // at: card position (640x360 map) in the empty top-left corner
  { id: 'l6', node: 'village', name: 'Mishika in the Attic', star: 'Dimitrije', ready: true, at: [130, 112] },
  { id: 'l7', node: 'village', name: 'The Lawn', star: 'Everyone', ready: true, at: [130, 184] },
  { id: 'l8', node: 'village', name: 'Night Patrol', star: 'Everyone', ready: true, at: [450, 110] },
];
const EH_TRAVEL = {
  l2: ['Over the mountains…', 'Mrak’s shadow-birds carried Baba to The Frostfang Peaks.'],
  l3: ['Down into the fire…', 'Mrak’s wardens dragged Baba deep into Cinderdeep Caves.'],
  l4: ['To the Hollow Keep…', 'Mrak took Baba to his own grey castle.'],
  l5: ['Spring in Ivanovo…', 'Baba Vera is home. Now the house needs tidying!'],
};
// progress lives in this browser: { levels: { l1: { done, coins, gems, gemTotal } } }
function ehProgress() { try { return JSON.parse(localStorage.getItem('eh_progress')) || { levels: {} }; } catch (e) { return { levels: {} }; } }
function ehSaveLevel(id, r) {
  const p = ehProgress(), o = p.levels[id] || {};
  p.levels[id] = { done: true, coins: Math.max(o.coins || 0, r.coins || 0), gems: Math.max(o.gems || 0, r.gems || 0), gemTotal: r.gemTotal || o.gemTotal || 3 };
  try { localStorage.setItem('eh_progress', JSON.stringify(p)); } catch (e) {}
  return p;
}
// Baba is held at the first level nobody has cleared yet
const ehBabaLevel = p => EH_LEVELS.findIndex(l => !(p.levels[l.id] || {}).done);

function WorldMap({ mode, onPlay, onBack }) {
  const { PixelButton, PixelPanel } = EHK;
  const [map, setMap] = React.useState(null);
  const [pos, setPos] = React.useState(null);
  const [arrived, setArrived] = React.useState(mode !== 'travel');
  const [ver, setVer] = React.useState(0), [sure, setSure] = React.useState(false);
  const prog = React.useMemo(ehProgress, [ver]);
  const at = ehBabaLevel(prog), cur = EH_LEVELS[Math.max(0, Math.min(EH_LEVELS.length - 1, at < 0 ? EH_LEVELS.length - 1 : at))];
  React.useEffect(() => { fetch(EHM_A + 'ui/ui_world_map.json').then(r => r.json()).then(setMap).catch(() => setMap({ nodes: {}, path: [] })); }, []);
  React.useEffect(() => {
    if (!map || !map.path.length) return;
    const P = map.path, idx = n => { const q = map.nodes[n]; return P.findIndex(p => p.x === q.x && p.y === q.y); };
    const end = idx(cur.node);
    if (mode !== 'travel' || at <= 0) { setPos(P[end]); return; }
    // travel: Baba's marker follows the red yarn from the level just cleared to where she is held now
    const start = idx(EH_LEVELS[at - 1].node), pts = P.slice(start, end + 1);
    const lens = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y)), total = lens.reduce((a, b) => a + b, 0);
    let raf, t0 = null; setPos(pts[0]);
    const step = now => { if (t0 == null) t0 = now; const k = Math.min(1, Math.max(0, (now - t0 - 900) / 3200)); let d = k * total, i = 0;
      while (i < lens.length - 1 && d > lens[i]) { d -= lens[i]; i++; }
      const a = pts[i], b = pts[i + 1], f = lens[i] ? d / lens[i] : 1; setPos({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f });
      if (k < 1) raf = requestAnimationFrame(step); else setArrived(true); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [map, ver]);
  const px = { imageRendering: 'pixelated', position: 'absolute', left: 0, top: 0, width: 1280, height: 720 };
  const chip = (lv, i) => {
    const n = map && map.nodes[lv.node]; if (!n) return null;
    const r = prog.levels[lv.id] || {}, open = lv.ready && (i === 0 || (prog.levels[EH_LEVELS[i - 1].id] || {}).done);
    return (
      <div key={lv.id} style={{ position: 'absolute', left: lv.at ? lv.at[0] * 2 : n.x * 2, top: lv.at ? lv.at[1] * 2 : n.y * 2 + (lv.node === 'caves' ? -110 : 18), transform: 'translateX(-50%)', textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)', whiteSpace: 'nowrap', background: 'rgba(20,16,28,.82)', padding: '6px 10px', border: '2px solid var(--eh-ink)' }}>
        <div style={{ fontSize: 12, color: 'var(--eh-gold)' }}>{T('LEVEL')} {i + 1} · {T(lv.star).toUpperCase()}</div>{(window.EH_LANG === 'sr' || lv.at) && <div style={{ fontSize: 14, marginTop: 2 }}>{T(lv.name).toUpperCase()}</div>}
        {mode === 'select' && open ? <div style={{ marginTop: 6 }}><PixelButton size="sm" onClick={() => onPlay(lv.id)}>{T(r.done ? 'Play again' : 'Play')}</PixelButton></div>
          : <div style={{ marginTop: 4, color: 'var(--eh-stone)' }}>{!lv.ready ? T('COMING SOON') : mode === 'select' ? (window.EH_LANG === 'sr' ? `PRVO PREĐI NIVO ${i}` : `FINISH LEVEL ${i} FIRST`) : ''}</div>}
        {r.done && lv.at && <div style={{ marginTop: 6, fontSize: 12 }}>{T('CLEARED')}</div>}
        {r.done && !lv.at && <div style={{ marginTop: 6, fontSize: 12 }}>{T('CLEARED')} · {T('COINS')} ×{String(r.coins).padStart(3, '0')} · {T('GEMS')} {r.gems}/{r.gemTotal}</div>}
      </div>
    );
  };
  const fr = Math.floor(Date.now() / 333) % 2;   // marker: 2 frames at 3fps
  const [, tick] = React.useState(0); React.useEffect(() => { const t = setInterval(() => tick(x => x + 1), 333); return () => clearInterval(t); }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--eh-ink)' }}>
      <img src={EHM_A + 'ui/ui_world_map.png'} style={px} />
      {window.EH_LANG !== 'sr' && <img src={EHM_A + 'ui/ui_world_map_labels.png'} style={px} />}   {/* the labels art is English; in Serbian the chips carry the names */}
      {pos && <div style={{ position: 'absolute', left: pos.x * 2 - 32, top: pos.y * 2 - 60, width: 64, height: 64, backgroundImage: `url(${EHM_A}ui/ui_map_marker_baba.png)`,
        backgroundSize: '128px 64px', backgroundPosition: `${-fr * 64}px 0`, imageRendering: 'pixelated' }} />}
      {map && EH_LEVELS.map(chip)}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 56, color: 'var(--eh-gold)', textShadow: '-4px 0 0 var(--eh-ink),4px 0 0 var(--eh-ink),0 -4px 0 var(--eh-ink),0 4px 0 var(--eh-ink)' }}>
        {T(mode === 'travel' ? (EH_TRAVEL[cur.id] || EH_TRAVEL.l2)[0] : 'Baba Vera’s trail')}</div>
      {mode === 'travel' && <div style={{ position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 26, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)' }}>
        {T((EH_TRAVEL[cur.id] || EH_TRAVEL.l2)[1])} {arrived && !cur.ready ? T('That level is coming soon!') : ''}</div>}
      <div style={{ position: 'absolute', right: 32, bottom: 28, display: 'flex', gap: 16, opacity: arrived ? 1 : 0, transition: 'opacity .3s' }}>
        {mode === 'travel' && cur.ready && <PixelButton onClick={() => onPlay(cur.id)}>{T('Continue ▶')}</PixelButton>}
        {mode === 'travel' && <PixelButton variant="secondary" onClick={() => onBack('select')}>{T('Level select')}</PixelButton>}
        <PixelButton variant="secondary" onClick={() => onBack('title')}>{T('Title')}</PixelButton>
      </div>
      {mode === 'select' && <div style={{ position: 'absolute', left: 32, bottom: 28, display: 'flex', gap: 12, alignItems: 'center' }}>   {/* start over in this browser (asks first) */}
        {!sure ? <PixelButton variant="secondary" size="sm" onClick={() => setSure(true)}>{T('Reset progress')}</PixelButton>
          : <><span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)', background: 'rgba(20,16,28,.82)', padding: '6px 10px' }}>{T('Erase all progress?')}</span>
            <PixelButton size="sm" onClick={() => { try { ['eh_progress', 'eh_level', 'eh_screen'].forEach(k => localStorage.removeItem(k)); } catch (e) {} setSure(false); setVer(v => v + 1); }}>{T('Yes, start over')}</PixelButton>
            <PixelButton variant="secondary" size="sm" onClick={() => setSure(false)}>{T('No')}</PixelButton></>}
      </div>}
    </div>
  );
}
Object.assign(window, { WorldMap, ehSaveLevel, ehProgress, EH_LEVELS });

// World map and saved progress. The map is Claude Design's ui_world_map (+ labels + Baba marker);
// ui_world_map.json gives the level nodes and the red-yarn path in 640x360 coordinates (drawn at 2x here).
const EHM_A = '../../../assets/';
const EH_LEVELS = [
  { id: 'l1', node: 'forest', name: 'The Whispering Forest', star: 'Dimitrije', ready: true },
  { id: 'l2', node: 'peaks',  name: 'The Frostfang Peaks',   star: 'Katarina',  ready: false },
  { id: 'l3', node: 'caves',  name: 'Cinderdeep Caves',      star: 'Vasilije',  ready: false },
  { id: 'l4', node: 'keep',   name: 'The Hollow Keep',       star: 'Kosta',     ready: false },
];
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
  const prog = React.useMemo(ehProgress, []);
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
  }, [map]);
  const px = { imageRendering: 'pixelated', position: 'absolute', left: 0, top: 0, width: 1280, height: 720 };
  const chip = (lv, i) => {
    const n = map && map.nodes[lv.node]; if (!n) return null;
    const r = prog.levels[lv.id] || {}, open = lv.ready && (i === 0 || (prog.levels[EH_LEVELS[i - 1].id] || {}).done || lv.ready);
    return (
      <div key={lv.id} style={{ position: 'absolute', left: n.x * 2, top: n.y * 2 + (lv.node === 'caves' ? -110 : 18), transform: 'translateX(-50%)', textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)', whiteSpace: 'nowrap', background: 'rgba(20,16,28,.82)', padding: '6px 10px', border: '2px solid var(--eh-ink)' }}>
        <div style={{ fontSize: 12, color: 'var(--eh-gold)' }}>LEVEL {i + 1} · {lv.star.toUpperCase()}</div>
        {mode === 'select' && open ? <div style={{ marginTop: 6 }}><PixelButton size="sm" onClick={() => onPlay(lv.id)}>{r.done ? 'Play again' : 'Play'}</PixelButton></div>
          : <div style={{ marginTop: 4, color: 'var(--eh-stone)' }}>{lv.ready ? '' : 'COMING SOON'}</div>}
        {r.done && <div style={{ marginTop: 6, fontSize: 12 }}>CLEARED · COINS ×{String(r.coins).padStart(3, '0')} · GEMS {r.gems}/{r.gemTotal}</div>}
      </div>
    );
  };
  const fr = Math.floor(Date.now() / 333) % 2;   // marker: 2 frames at 3fps
  const [, tick] = React.useState(0); React.useEffect(() => { const t = setInterval(() => tick(x => x + 1), 333); return () => clearInterval(t); }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--eh-ink)' }}>
      <img src={EHM_A + 'ui/ui_world_map.png'} style={px} />
      <img src={EHM_A + 'ui/ui_world_map_labels.png'} style={px} />
      {pos && <div style={{ position: 'absolute', left: pos.x * 2 - 32, top: pos.y * 2 - 60, width: 64, height: 64, backgroundImage: `url(${EHM_A}ui/ui_map_marker_baba.png)`,
        backgroundSize: '128px 64px', backgroundPosition: `${-fr * 64}px 0`, imageRendering: 'pixelated' }} />}
      {map && EH_LEVELS.map(chip)}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 56, color: 'var(--eh-gold)', textShadow: '-4px 0 0 var(--eh-ink),4px 0 0 var(--eh-ink),0 -4px 0 var(--eh-ink),0 4px 0 var(--eh-ink)' }}>
        {mode === 'travel' ? 'Over the mountains…' : 'Baba Vera’s trail'}</div>
      {mode === 'travel' && <div style={{ position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 26, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)' }}>
        Mrak’s shadow-birds carried Baba to {cur.name}. {arrived && !cur.ready ? 'That level is coming soon!' : ''}</div>}
      <div style={{ position: 'absolute', right: 32, bottom: 28, display: 'flex', gap: 16, opacity: arrived ? 1 : 0, transition: 'opacity .3s' }}>
        {mode === 'travel' && cur.ready && <PixelButton onClick={() => onPlay(cur.id)}>Continue ▶</PixelButton>}
        {mode === 'travel' && <PixelButton variant="secondary" onClick={() => onBack('select')}>Level select</PixelButton>}
        <PixelButton variant="secondary" onClick={() => onBack('title')}>Title</PixelButton>
      </div>
    </div>
  );
}
Object.assign(window, { WorldMap, ehSaveLevel, ehProgress, EH_LEVELS });

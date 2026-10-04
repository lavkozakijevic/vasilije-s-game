// Per-cousin scores: who is playing, best coins/gems and fastest time per level, and the secret Vera unlock.
// Everything goes through EH_STORE, so the scores can later move to an online database by swapping
// load/save (keep the same shape) without touching the game.
const EH_PLAYERS = [
  { id: 'kosta', name: 'Kosta', sprite: 'konstantin', key: 1 },
  { id: 'katarina', name: 'Katarina', sprite: 'katarina', key: 2 },
  { id: 'vasilije', name: 'Vasilije', sprite: 'vasilije', key: 3 },
  { id: 'dimitrije', name: 'Dimitrije', sprite: 'dimitrije', key: 4 },
];
const EH_STAT_LEVELS = ['l1', 'l2', 'l3', 'l4'];   // the levels that count for Vera (all coins + all gems in one play each)

// ---- storage (this browser for now): { players: { kosta: { l1: { coins, coinTotal, gems, gemTotal, time, full } } } }
const EH_STORE = {
  load() { try { return JSON.parse(localStorage.getItem('eh_stats')) || { players: {} }; } catch (e) { return { players: {} }; } },
  save(s) { try { localStorage.setItem('eh_stats', JSON.stringify(s)); } catch (e) {} },
  reset() { try { localStorage.removeItem('eh_stats'); } catch (e) {} },
};
function ehCurrentPlayer() { try { return localStorage.getItem('eh_player'); } catch (e) { return null; } }
function ehSetPlayer(id) { try { localStorage.setItem('eh_player', id); } catch (e) {} }

// one finished play of a level -> keep the bests; a "full" run collected every coin and every gem
function ehRecordRun(player, level, r) {
  if (!player) return { newBest: false };
  const s = EH_STORE.load(), P = s.players[player] = s.players[player] || {}, o = P[level] || {};
  const full = r.coinTotal > 0 && r.coinsGot >= r.coinTotal && r.gems >= r.gemTotal;
  const newBest = r.time != null && (o.time == null || r.time < o.time);
  P[level] = { coins: Math.max(o.coins || 0, r.coinsGot || 0), coinTotal: r.coinTotal || o.coinTotal || 0, gems: Math.max(o.gems || 0, r.gems || 0), gemTotal: r.gemTotal || o.gemTotal || 0,
    time: newBest ? r.time : o.time, full: !!(o.full || full), runs: (o.runs || 0) + 1 };
  const veraBefore = !!P.vera; P.vera = EH_STAT_LEVELS.every(l => P[l] && P[l].full);
  EH_STORE.save(s);
  return { newBest, full, veraNew: P.vera && !veraBefore };
}
const ehVeraUnlocked = player => { const P = EH_STORE.load().players[player]; return !!(P && P.vera); };
const ehFmtTime = t => t == null ? '—' : `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

// ---- "Who's playing?" (before every level; keys 1-4 or click)
function WhoScreen({ onPick, onBack }) {
  const { PixelButton, Sprite } = EHK;
  React.useEffect(() => { const k = e => { const d = /^Digit([1-4])$/.exec(e.code); if (d) { e.preventDefault(); e.stopImmediatePropagation(); onPick(EH_PLAYERS[+d[1] - 1].id); } if (e.code === 'Escape') onBack(); };
    window.addEventListener('keydown', k, true); return () => window.removeEventListener('keydown', k, true); }, []);
  const last = ehCurrentPlayer();
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--eh-ink)' }}>
      <ParallaxBackdrop dim />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 72, color: 'var(--eh-gold)', textShadow: '-4px 0 0 var(--eh-ink),4px 0 0 var(--eh-ink),0 -4px 0 var(--eh-ink),0 4px 0 var(--eh-ink)' }}>{T("Who's playing?")}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', gap: 36 }}>
        {EH_PLAYERS.map(p => (
          <button key={p.id} onClick={() => onPick(p.id)} style={{ width: 210, padding: '18px 0 14px', background: p.id === last ? 'rgba(255,194,61,.18)' : 'rgba(20,16,28,.82)', border: `4px solid ${p.id === last ? 'var(--eh-gold)' : 'var(--eh-ink)'}`, cursor: 'pointer', display: 'grid', justifyItems: 'center', gap: 10 }}>
            <Sprite src={EHK_A + `sprites/heroes/kids/${p.sprite}/hero_${p.sprite}_idle.png`} frames={4} frame={0} scale={5} />
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 22, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)' }}>{p.name.toUpperCase()}</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--eh-gold)' }}>{T('PRESS')} {p.key}{ehVeraUnlocked(p.id) ? ' · ★ VERA' : ''}</div>
          </button>))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 22, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)' }}>{T('Your coins, gems and best times are saved under your name.')}</div>
      <div style={{ position: 'absolute', right: 32, top: 28 }}><PixelButton variant="secondary" size="sm" onClick={onBack}>{T('Title')}</PixelButton></div>
    </div>
  );
}

// ---- leaderboard: one row per cousin, best coins/gems and fastest time per level, trophy for the fastest, Vera star
function Leaderboard({ onBack }) {
  const { PixelButton, Sprite } = EHK;
  const [ver, setVer] = React.useState(0), [sure, setSure] = React.useState(false);
  const s = React.useMemo(() => EH_STORE.load(), [ver]);
  const fastest = Object.fromEntries(EH_STAT_LEVELS.map(l => { let best = null; EH_PLAYERS.forEach(p => { const r = (s.players[p.id] || {})[l]; if (r && r.time != null && (best == null || r.time < best.t)) best = { t: r.time, p: p.id }; }); return [l, best && best.p]; }));
  const cell = { fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--eh-bone)', textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid var(--eh-plum)' };
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--eh-ink)' }}>
      <ParallaxBackdrop dim />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 26, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 64, color: 'var(--eh-gold)', textShadow: '-4px 0 0 var(--eh-ink),4px 0 0 var(--eh-ink),0 -4px 0 var(--eh-ink),0 4px 0 var(--eh-ink)' }}>{T('Leaderboard')}</div>
      <table style={{ position: 'absolute', left: 40, right: 40, top: 120, width: 1200, borderCollapse: 'collapse', background: 'rgba(20,16,28,.88)', border: '4px solid var(--eh-ink)' }}>
        <thead><tr>
          <th style={{ ...cell, width: 200 }}></th>
          {EH_STAT_LEVELS.map((l, i) => <th key={l} style={{ ...cell, color: 'var(--eh-gold)' }}>{T('LEVEL')} {i + 1}<div style={{ fontSize: 11, color: 'var(--eh-stone)', marginTop: 4 }}>{T('COINS')} · {T('GEMS')} · {T('TIME')}</div></th>)}
          <th style={{ ...cell, color: 'var(--eh-gold)', width: 150 }}>BABA VERA</th>
        </tr></thead>
        <tbody>{EH_PLAYERS.map(p => { const P = s.players[p.id] || {}, perfect = EH_STAT_LEVELS.filter(l => P[l] && P[l].full).length;
          return (<tr key={p.id}>
            <td style={{ ...cell, textAlign: 'left' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Sprite src={EHK_A + `sprites/heroes/kids/${p.sprite}/hero_${p.sprite}_idle.png`} frames={4} frame={0} scale={2} /><span style={{ fontSize: 18 }}>{p.name.toUpperCase()}</span></div></td>
            {EH_STAT_LEVELS.map(l => { const r = P[l]; return <td key={l} style={cell}>{!r ? <span style={{ color: 'var(--eh-stone)' }}>—</span> : <>
              <div>{r.coins}/{r.coinTotal} · {r.gems}/{r.gemTotal}{r.full ? ' ✓' : ''}</div>
              <div style={{ marginTop: 4, color: fastest[l] === p.id ? 'var(--eh-gold)' : 'var(--eh-bone)' }}>{fastest[l] === p.id ? '🏆 ' : ''}{ehFmtTime(r.time)}</div></>}</td>; })}
            <td style={{ ...cell, color: P.vera ? 'var(--eh-gold)' : 'var(--eh-stone)' }}>{P.vera ? '★ ' + T('UNLOCKED') : `${perfect}/4`}</td>
          </tr>); })}</tbody>
      </table>
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 92, fontFamily: 'var(--font-body)', fontSize: 20, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)', textAlign: 'center' }}>
        {T('✓ = every coin and gem in one play. Do that in all four levels to unlock Baba Vera as a hero.')}</div>
      <div style={{ position: 'absolute', right: 32, bottom: 28 }}><PixelButton variant="secondary" onClick={onBack}>{T('Title')}</PixelButton></div>
      <div style={{ position: 'absolute', left: 32, bottom: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
        {!sure ? <PixelButton variant="secondary" size="sm" onClick={() => setSure(true)}>{T('Reset scores')}</PixelButton>
          : <><span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--eh-bone)' }}>{T('Erase all scores?')}</span>
            <PixelButton size="sm" onClick={() => { EH_STORE.reset(); setSure(false); setVer(v => v + 1); }}>{T('Yes, erase')}</PixelButton>
            <PixelButton variant="secondary" size="sm" onClick={() => setSure(false)}>{T('No')}</PixelButton></>}
      </div>
    </div>
  );
}
Object.assign(window, { EH_PLAYERS, EH_STORE, ehRecordRun, ehVeraUnlocked, ehCurrentPlayer, ehSetPlayer, ehFmtTime, WhoScreen, Leaderboard });

// Menu screens composed from the DS components. Stage is 1280x720 (2x the 640x360 game view).
const EHK = new Proxy({}, { get: (_, k) => (window.ElementalHeroesDesignSystem_0f20c7 || {})[k] });
const EHK_A = '../../../assets/';

function ParallaxBackdrop({ dim }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {['sky','far','mid','near'].map(k => (
        <div key={k} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${EHK_A}backgrounds/forest/bg_forest_${k}.png)`, backgroundSize: '1280px 720px', imageRendering: 'pixelated' }} />
      ))}
      {dim && <div style={{ position: 'absolute', inset: 0, background: 'var(--eh-ink)', opacity: 0.55 }} />}
    </div>
  );
}

function TitleScreen({ onStart, onSelect, onBoard, lang, onLang }) {
  const { PixelButton, Sprite } = EHK;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <ParallaxBackdrop />
      {/* language: English / Srpski (latinica), remembered in this browser */}
      <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 12, zIndex: 1 }}>
        {[['en', 'English'], ['sr', 'Srpski']].map(([id, label]) => <PixelButton key={id} size="sm" variant={lang === id ? 'primary' : 'secondary'} onClick={() => onLang(id)}>{label}</PixelButton>)}
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 96, gap: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 128, lineHeight: 1, color: 'var(--eh-gold)', textShadow: '-6px 0 0 var(--eh-ink),6px 0 0 var(--eh-ink),0 -6px 0 var(--eh-ink),0 6px 0 var(--eh-ink),6px 12px 0 var(--eh-ember)' }}>{T('Elemental Heroes')}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 24, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)', textTransform: 'uppercase' }}>{T('The Rescue of Baba Vera')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 21, alignItems: 'center', marginTop: 48 }}>
          <PixelButton size="lg" onClick={onStart}>{T('Start')}</PixelButton>
          <PixelButton variant="secondary" onClick={onSelect}>{T('Level Select')}</PixelButton>
          <PixelButton variant="secondary" onClick={onBoard}>{T('Leaderboard')}</PixelButton>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 48, bottom: 72, display: 'flex', gap: 0 }}>{['konstantin', 'katarina', 'vasilije', 'dimitrije'].map(k => <Sprite key={k} src={EHK_A + `sprites/heroes/kids/${k}/hero_${k}_idle.png`} frames={4} frame={0} scale={4} />)}</div>
      <div style={{ position: 'absolute', right: 96, bottom: 72 }}><Sprite src={EHK_A + 'sprites/enemies/forest/enemy_rotroot_idle.png'} frames={4} fps={5} scale={6} flip /></div>
      <div style={{ position: 'absolute', bottom: 24, width: '100%', textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)' }}>{T('← → move · space jump · F fire · 1–4 cousins · Q/E switch hero · esc pause')}</div>
    </div>
  );
}

function Overlay({ children }) {
  return <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,11,20,.6)', display: 'grid', placeItems: 'center' }}>{children}</div>;
}

function PauseMenu({ onResume, onRestart, onQuit }) {
  const { PixelPanel, PixelButton } = EHK;
  return (
    <Overlay>
      <PixelPanel title={T('Paused')} style={{ width: 360 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <PixelButton variant="ghost" selected onClick={onResume}>{T('Resume')}</PixelButton>
          <PixelButton variant="ghost" onClick={onRestart}>{T('Restart')}</PixelButton>
          <PixelButton variant="ghost" onClick={onQuit}>{T('Quit to title')}</PixelButton>
        </div>
      </PixelPanel>
    </Overlay>
  );
}

function ResultPanel({ kind, coins, gems, gemTotal, coinsGot, coinTotal, time, newBest, full, veraNew, onRetry, onQuit, onContinue }) {
  const { PixelPanel, PixelButton, CoinCounter } = EHK;
  const win = kind === 'complete';
  return (
    <Overlay>
      <PixelPanel title={T(win ? 'Level Complete' : kind === 'timeup' ? "Time's up!" : 'Game Over')} tone={win ? 'stone' : 'dark'} style={{ width: 560 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          {win ? <CoinCounter count={coins} scale={3} src={EHK_A + 'sprites/items/item_coin_spin.png'} /> : <div style={{ fontSize: 24, textAlign: 'center' }}>{T(kind === 'timeup' ? 'Mishika is still waiting. Try again!' : 'The flame goes out. For now.')}</div>}
          {win && gemTotal > 0 && <div style={{ fontFamily: 'var(--font-ui)', fontSize: 18, textAlign: 'center', lineHeight: 1.6 }}>
            {coinTotal > 0 && <>{T('COINS')} {coinsGot}/{coinTotal} · </>}{T('GEMS')} {gems}/{gemTotal}{full ? ' ✓' : ''}
            {time != null && <div>{T('TIME')} {ehFmtTime(time)}{newBest ? <span style={{ color: 'var(--eh-gold)' }}> · {T('NEW BEST!')}</span> : ''}</div>}
            {veraNew && <div style={{ color: 'var(--eh-gold)' }}>★ {T('BABA VERA UNLOCKED!')}</div>}</div>}
          <div style={{ display: 'flex', gap: 21 }}>
            {win && onContinue && <PixelButton onClick={onContinue}>{T('Continue ▶')}</PixelButton>}
            <PixelButton variant={win ? 'secondary' : 'primary'} onClick={onRetry}>{T(win ? 'Play again' : kind === 'timeup' ? 'Restart' : 'Retry')}</PixelButton>
            <PixelButton variant="secondary" onClick={onQuit}>{T('Title')}</PixelButton>
          </div>
        </div>
      </PixelPanel>
    </Overlay>
  );
}

function Hud({ hp, coins, element = 'fire', name = 'Cinder' }) {
  const { HeartMeter, CoinCounter, ElementBadge } = EHK;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 16, top: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <HeartMeter value={hp} max={4} scale={2} src={EHK_A + 'ui/ui_heart_states.png'} />
        <CoinCounter count={coins} scale={2} src={EHK_A + 'sprites/items/item_coin_spin.png'} />
      </div>
      <div style={{ position: 'absolute', right: 22, top: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <ElementBadge element={element} scale={2} icon={EHK_A + `sprites/heroes/${element}/icon_element_${element}.png`} />
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)' }}>{name.toUpperCase()}</div>
      </div>
    </div>
  );
}

// "new hero unlocked" card (ui_unlock_card.png: title in the red banner, hero art in the gold frame, caption in the bottom bar)
function UnlockCard({ hero = 'ruby', name = 'Rubi', keyNum = 5, onDone }) {
  const { Sprite } = EHK;
  React.useEffect(() => { const k = e => { if (['Space', 'Enter', 'NumpadEnter', 'Escape'].includes(e.code)) { e.preventDefault(); e.stopImmediatePropagation(); onDone(); } };
    window.addEventListener('keydown', k, true); return () => window.removeEventListener('keydown', k, true); }, []);
  const S = 2.6, X = 640 - 160 * S, Y = 360 - 100 * S;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,11,20,.75)', cursor: 'pointer' }} onClick={onDone}>
      <img src={EHK_A + 'ui/ui_unlock_card.png'} style={{ position: 'absolute', left: X, top: Y, width: 320 * S, height: 200 * S, imageRendering: 'pixelated', animation: 'ehFadeIn .5s' }} />
      <div style={{ position: 'absolute', left: X + 47 * S, width: 225 * S, top: Y + 21 * S, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 26, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)' }}>{T('NEW HERO UNLOCKED')}</div>
      <div style={{ position: 'absolute', left: X + 111 * S, width: 98 * S, top: Y + 61 * S, height: 78 * S, display: 'grid', placeItems: 'center' }}>
        <Sprite src={EHK_A + `sprites/heroes/kids/${hero}/hero_${hero}_idle.png`} frames={4} fps={6} scale={6} /></div>
      <div style={{ position: 'absolute', left: X + 60 * S, width: 200 * S, top: Y + 145 * S, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 52, color: 'var(--eh-gold)', textShadow: '-3px 0 0 var(--eh-ink),3px 0 0 var(--eh-ink),0 -3px 0 var(--eh-ink),0 3px 0 var(--eh-ink)' }}>{name}</div>
      <div style={{ position: 'absolute', left: X + 81 * S, width: 157 * S, top: Y + 168 * S, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--eh-bone)' }}>{T('PRESS')} {keyNum} {T('IN ANY LEVEL')}</div>
    </div>
  );
}
Object.assign(window, { UnlockCard, TitleScreen, PauseMenu, ResultPanel, Hud });

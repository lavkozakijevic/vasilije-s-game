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

function TitleScreen({ onStart }) {
  const { PixelButton, Sprite } = EHK;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <ParallaxBackdrop />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 96, gap: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 128, lineHeight: 1, color: 'var(--eh-gold)', textShadow: '-6px 0 0 var(--eh-ink),6px 0 0 var(--eh-ink),0 -6px 0 var(--eh-ink),0 6px 0 var(--eh-ink),6px 12px 0 var(--eh-ember)' }}>Elemental Heroes</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 24, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)', textTransform: 'uppercase' }}>World 1 · The Forest</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 21, alignItems: 'center', marginTop: 48 }}>
          <PixelButton size="lg" onClick={onStart}>Start</PixelButton>
          <PixelButton variant="secondary" disabled>Level Select</PixelButton>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 96, bottom: 72 }}><Sprite src={EHK_A + 'sprites/heroes/fire/hero_fire_idle.png'} frames={4} fps={6} scale={6} /></div>
      <div style={{ position: 'absolute', right: 96, bottom: 72 }}><Sprite src={EHK_A + 'sprites/enemies/forest/enemy_rotroot_idle.png'} frames={4} fps={5} scale={6} flip /></div>
      <div style={{ position: 'absolute', bottom: 24, width: '100%', textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--eh-bone)', textShadow: 'var(--text-outline)' }}>← → move · space jump · F fire · esc pause</div>
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
      <PixelPanel title="Paused" style={{ width: 360 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <PixelButton variant="ghost" selected onClick={onResume}>Resume</PixelButton>
          <PixelButton variant="ghost" onClick={onRestart}>Restart</PixelButton>
          <PixelButton variant="ghost" onClick={onQuit}>Quit to title</PixelButton>
        </div>
      </PixelPanel>
    </Overlay>
  );
}

function ResultPanel({ kind, coins, onRetry, onQuit }) {
  const { PixelPanel, PixelButton, CoinCounter } = EHK;
  const win = kind === 'complete';
  return (
    <Overlay>
      <PixelPanel title={win ? 'Level Complete' : 'Game Over'} tone={win ? 'stone' : 'dark'} style={{ width: 440 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          {win ? <CoinCounter count={coins} scale={3} src={EHK_A + 'sprites/items/item_coin_spin.png'} /> : <div style={{ fontSize: 24, textAlign: 'center' }}>The flame goes out. For now.</div>}
          <div style={{ display: 'flex', gap: 21 }}>
            <PixelButton onClick={onRetry}>{win ? 'Play again' : 'Retry'}</PixelButton>
            <PixelButton variant="secondary" onClick={onQuit}>Title</PixelButton>
          </div>
        </div>
      </PixelPanel>
    </Overlay>
  );
}

function Hud({ hp, coins }) {
  const { HeartMeter, CoinCounter, ElementBadge } = EHK;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 16, top: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <HeartMeter value={hp} max={4} scale={2} src={EHK_A + 'ui/ui_heart_states.png'} />
        <CoinCounter count={coins} scale={2} src={EHK_A + 'sprites/items/item_coin_spin.png'} />
      </div>
      <div style={{ position: 'absolute', right: 22, top: 22 }}><ElementBadge element="fire" scale={2} icon={EHK_A + 'ui/icon_element_fire.png'} /></div>
    </div>
  );
}

Object.assign(window, { TitleScreen, PauseMenu, ResultPanel, Hud });

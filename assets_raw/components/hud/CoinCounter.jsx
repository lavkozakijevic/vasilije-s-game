import React from 'react';

export function CoinCounter({ count = 0, digits = 3, scale = 3, src = 'assets/sprites/items/item_coin_spin.png', spin = true }) {
  const [f, setF] = React.useState(0);
  React.useEffect(() => { if (!spin) return; const id = setInterval(() => setF(p => (p + 1) % 6), 110); return () => clearInterval(id); }, [spin]);
  const s = scale;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s * 2 }}>
      <div style={{ width: 16 * s, height: 16 * s, backgroundImage: `url(${src})`, backgroundSize: `${96 * s}px ${16 * s}px`, backgroundPosition: `${-f * 16 * s}px 0`, imageRendering: 'pixelated' }} />
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 8 * s, lineHeight: 1, color: 'var(--text-primary)', textShadow: `${-s}px 0 0 var(--eh-ink),${s}px 0 0 var(--eh-ink),0 ${-s}px 0 var(--eh-ink),0 ${s}px 0 var(--eh-ink)` }}>
        ×{String(count).padStart(digits, '0')}
      </span>
    </div>
  );
}

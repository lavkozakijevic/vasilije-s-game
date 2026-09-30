import React from 'react';

export function HeartMeter({ value = 3, max = 4, scale = 3, src = 'assets/ui/ui_heart_states.png' }) {
  const hearts = [];
  for (let i = 0; i < max; i++) {
    const s = value >= i + 1 ? 0 : value >= i + 0.5 ? 1 : 2;
    hearts.push(
      <div key={i} style={{ width: 16 * scale, height: 16 * scale, backgroundImage: `url(${src})`, backgroundSize: `${48 * scale}px ${16 * scale}px`, backgroundPosition: `${-s * 16 * scale}px 0`, imageRendering: 'pixelated' }} />
    );
  }
  return <div role="meter" aria-valuenow={value} aria-valuemax={max} style={{ display: 'flex', gap: 2 * scale }}>{hearts}</div>;
}

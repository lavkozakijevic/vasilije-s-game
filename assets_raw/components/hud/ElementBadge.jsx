import React from 'react';

const ACCENT = { fire: 'var(--element-fire)', water: 'var(--element-water)', earth: 'var(--element-earth)', air: 'var(--element-air)', ice: 'var(--element-ice)', lightning: 'var(--element-lightning)', shadow: 'var(--element-shadow)', light: 'var(--element-light)' };

export function ElementBadge({ element = 'fire', icon, scale = 3, active = true, label }) {
  const s = scale;
  const src = icon || `assets/ui/icon_element_${element}.png`;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: s * 2 }}>
      <div style={{
        width: 30 * s, height: 30 * s, background: 'var(--surface-panel)', display: 'grid', placeItems: 'center',
        boxShadow: `inset ${s}px ${s}px 0 0 var(--bevel-light), inset ${-s}px ${-s}px 0 0 var(--bevel-dark), 0 0 0 ${s}px var(--eh-ink)${active ? `, 0 0 0 ${2 * s}px ${ACCENT[element]}, 0 0 0 ${3 * s}px var(--eh-ink)` : ''}`,
      }}>
        <div style={{ width: 24 * s, height: 24 * s, background: 'var(--surface-panel-inset)', display: 'grid', placeItems: 'center' }}>
          <img src={src} alt={element} style={{ width: 16 * s, height: 16 * s, imageRendering: 'pixelated', opacity: active ? 1 : 0.35 }} />
        </div>
      </div>
      {label && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 8 * s / 1.5, color: ACCENT[element], textTransform: 'uppercase' }}>{label}</span>}
    </div>
  );
}

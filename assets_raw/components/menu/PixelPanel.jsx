import React from 'react';

export function PixelPanel({ children, title, tone = 'stone', padding = 18, style }) {
  const px = 3;
  const t = {
    stone: { bg: 'var(--eh-slate)', hi: 'var(--eh-stone)', lo: 'var(--eh-plum)', inset: 'var(--eh-plum)' },
    dark: { bg: 'var(--eh-plum)', hi: 'var(--eh-slate)', lo: 'var(--eh-ink)', inset: 'var(--eh-ink)' },
    parchment: { bg: 'var(--eh-bone)', hi: '#fff8', lo: 'var(--eh-stone)', inset: 'var(--eh-bone)' },
  }[tone];
  return (
    <div style={{
      background: t.bg, padding: px * 2,
      boxShadow: `inset ${px}px ${px}px 0 0 ${t.hi}, inset ${-px}px ${-px}px 0 0 ${t.lo}, 0 ${-px}px 0 0 var(--eh-ink), 0 ${px}px 0 0 var(--eh-ink), ${-px}px 0 0 0 var(--eh-ink), ${px}px 0 0 0 var(--eh-ink), ${px * 2}px ${px * 2}px 0 0 var(--eh-ink)`,
      ...style,
    }}>
      {title && (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1, color: tone === 'parchment' ? 'var(--eh-ember)' : 'var(--eh-gold)', textAlign: 'center', padding: '6px 0 12px' }}>{title}</div>
      )}
      <div style={{ background: t.inset, padding, color: tone === 'parchment' ? 'var(--eh-ink)' : 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--type-body-sm)' }}>
        {children}
      </div>
    </div>
  );
}

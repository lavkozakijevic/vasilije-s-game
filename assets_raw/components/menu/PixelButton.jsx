import React from 'react';

export function PixelButton({ children, variant = 'primary', size = 'md', disabled = false, selected = false, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const px = 3;
  const pal = {
    primary: { bg: 'var(--eh-flame)', hi: 'var(--eh-gold)', lo: 'var(--eh-ember)', fg: 'var(--eh-bone)' },
    secondary: { bg: 'var(--eh-slate)', hi: 'var(--eh-stone)', lo: 'var(--eh-plum)', fg: 'var(--eh-bone)' },
    ghost: { bg: 'transparent', hi: 'transparent', lo: 'transparent', fg: 'var(--eh-bone)' },
  }[variant];
  const fs = { sm: 16, md: 24, lg: 32 }[size];
  const pad = { sm: '6px 12px', md: '9px 21px', lg: '12px 30px' }[size];
  const pressed = down && !disabled;
  const lit = (hover || selected) && !disabled;
  const bg = disabled ? 'var(--eh-plum)' : lit && variant !== 'ghost' ? pal.hi : pal.bg;
  const bevel = variant === 'ghost' || disabled ? '' : pressed
    ? `inset ${px}px ${px}px 0 0 ${pal.lo}`
    : `inset ${px}px ${px}px 0 0 ${lit ? 'var(--eh-bone)' : pal.hi}, inset ${-px}px ${-px}px 0 0 ${pal.lo}`;
  const outline = variant === 'ghost' ? '' : `0 ${-px}px 0 0 var(--eh-ink), 0 ${px}px 0 0 var(--eh-ink), ${-px}px 0 0 0 var(--eh-ink), ${px}px 0 0 0 var(--eh-ink)`;
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      style={{
        fontFamily: 'var(--font-ui)', fontSize: fs, lineHeight: 1, textTransform: 'uppercase', letterSpacing: 'var(--tracking-ui)',
        color: disabled ? 'var(--eh-stone)' : lit && variant !== 'ghost' ? 'var(--eh-ink)' : pal.fg,
        background: bg, border: 0, borderRadius: 0, padding: pad, cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: [bevel, outline].filter(Boolean).join(', ') || 'none',
        transform: pressed ? `translateY(${px}px)` : 'none',
        display: 'inline-flex', alignItems: 'center', gap: 9,
        textShadow: variant === 'ghost' && lit ? 'none' : undefined,
        ...style,
      }}
    >
      {variant === 'ghost' && <span style={{ color: 'var(--eh-gold)', visibility: lit ? 'visible' : 'hidden' }}>▶</span>}
      {children}
    </button>
  );
}

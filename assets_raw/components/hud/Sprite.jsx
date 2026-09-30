import React from 'react';

export function Sprite({ src, frames = 1, frameWidth = 32, frameHeight = 32, scale = 3, fps = 10, loop = true, flip = false, playing = true, frame, style }) {
  const [f, setF] = React.useState(0);
  React.useEffect(() => {
    if (!playing || frames < 2 || frame != null) return;
    const id = setInterval(() => setF(p => (p + 1 >= frames ? (loop ? 0 : p) : p + 1)), 1000 / fps);
    return () => clearInterval(id);
  }, [playing, frames, fps, loop, frame]);
  const cur = frame != null ? frame : f;
  return (
    <div
      role="img"
      style={{
        width: frameWidth * scale, height: frameHeight * scale,
        backgroundImage: `url(${src})`, backgroundRepeat: 'no-repeat',
        backgroundSize: `${frameWidth * frames * scale}px ${frameHeight * scale}px`,
        backgroundPosition: `${-cur * frameWidth * scale}px 0`,
        imageRendering: 'pixelated', transform: flip ? 'scaleX(-1)' : undefined,
        flexShrink: 0, ...style,
      }}
    />
  );
}

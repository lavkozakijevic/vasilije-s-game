# Umbra: shadow hero (Elemental Heroes)

Plum hood with frost eyes, void-purple core, tattered cape.
Power: **Void orb** (`fx_shadow_projectile.png` + `fx_shadow_impact.png`).

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| hero_shadow_idle.png | 32×32 | 4 | 6 | loop |
| hero_shadow_run.png | 32×32 | 8 | 12 | loop |
| hero_shadow_jump.png | 32×32 | 2 | 8 | once |
| hero_shadow_fall.png | 32×32 | 2 | 8 | loop |
| hero_shadow_land.png | 32×32 | 2 | 12 | once |
| hero_shadow_attack.png | 32×32 | 6 | 14 | once (projectile spawns on frame 3) |
| hero_shadow_hurt.png | 32×32 | 2 | 8 | once (frame 0 = white flash) |
| hero_shadow_death.png | 32×32 | 6 | 8 | once |
| fx_shadow_projectile.png | 16×16 | 4 | 12 | loop |
| fx_shadow_impact.png | 32×32 | 4 | 12 | once, centered on hit |
| icon_element_shadow.png | 16×16 | 1 | – | HUD element slot |

`hero_shadow.json` is the machine-readable version: frame sizes, fps, loop flags, hitbox, origin, projectile spawn frame and offset. `elemental16.hex` is the shared 16-color palette.

## Implementation notes
- Horizontal strips, no padding or margins. All frames share one origin: feet at (16, 31). Sprites face **right**, so mirror them for left.
- Hitbox: x 10, y 8, w 12, h 23 (relative to the frame's top-left).
- Attack: the projectile spawns on attack frame 3 at offset (26, 10) and travels at about 250 px/s. Mirror x when facing left.
- Hurt: play frame 0 (white flash), then frame 1, then about 1s of invulnerability flicker (toggle visibility every 3 ticks).
- Render at integer scale with nearest-neighbour filtering (Phaser: `pixelArt: true`; CSS: `image-rendering: pixelated`).
- Phaser: `this.load.spritesheet('hero_shadow_run', 'hero_shadow_run.png', { frameWidth: 32, frameHeight: 32 })`, then `anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('hero_shadow_run'), frameRate: 12, repeat: -1 })`.

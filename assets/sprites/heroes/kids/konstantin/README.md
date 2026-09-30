# Konstantin (13): light cousin (Elemental Heroes · The Rescue of Baba Vera)

Messy brown hair, grey sweatshirt with gold ribbing, slate sweatpants. Hands on hips in idle: the captain.
About 26px tall (the knights are ~24px). Element shows as the glowing stone pendant, the gold trim and the attack effect.
Power: **Sun lance**, the same projectile and impact as Aurel (`sprites/heroes/light/`).

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| hero_konstantin_idle.png | 32×32 | 4 | 6 | loop |
| hero_konstantin_run.png | 32×32 | 8 | 12 | loop |
| hero_konstantin_jump.png | 32×32 | 2 | 8 | once |
| hero_konstantin_fall.png | 32×32 | 2 | 8 | loop |
| hero_konstantin_land.png | 32×32 | 2 | 12 | once |
| hero_konstantin_attack.png | 32×32 | 6 | 14 | once (projectile spawns on frame 3) |
| hero_konstantin_hurt.png | 32×32 | 2 | 8 | once (frame 0 = white flash) |
| hero_konstantin_death.png | 32×32 | 6 | 8 | once |
| hero_konstantin_respawn.png | 32×32 | 6 | 10 | once at a checkpoint, then idle |

`hero_konstantin.json` is the machine-readable version (paths to the shared light projectile/impact are relative to this folder). `elemental16.hex` is the shared palette.

## Implementation notes
- Horizontal strips, no padding. All frames share one origin: feet at (16, 31). Faces **right**, so mirror for left.
- Hitbox: x 11, y 6, w 10, h 25.
- Attack: spawn `fx_light_projectile` on attack frame 3 at offset (30, 16); the pendant glows on frames 1-4 and a dithered halo appears over the head on frames 2-4.
- Hurt: frame 0 (white flash), frame 1, then ~1s of invulnerability flicker.
- Respawn: embers of the light colours gather into the idle pose; play at the checkpoint, then switch to idle.
- Render at integer scale with nearest-neighbour filtering.

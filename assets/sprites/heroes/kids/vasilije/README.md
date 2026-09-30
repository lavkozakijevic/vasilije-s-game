# Vasilije (9): ice cousin (Elemental Heroes · The Rescue of Baba Vera)

Dark golden hair with straight bangs, orange hoodie, slate sweatpants. Head always a pixel ahead of his body: leaning forward.
About 22px tall (the knights are ~24px). Element shows as the glowing stone pendant, the frost trim and the attack effect.
Power: **Ice shard**, the same projectile and impact as Rime (`sprites/heroes/ice/`).

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| hero_vasilije_idle.png | 32×32 | 4 | 6 | loop |
| hero_vasilije_run.png | 32×32 | 8 | 12 | loop |
| hero_vasilije_jump.png | 32×32 | 2 | 8 | once |
| hero_vasilije_fall.png | 32×32 | 2 | 8 | loop |
| hero_vasilije_land.png | 32×32 | 2 | 12 | once |
| hero_vasilije_attack.png | 32×32 | 6 | 14 | once (projectile spawns on frame 3) |
| hero_vasilije_hurt.png | 32×32 | 2 | 8 | once (frame 0 = white flash) |
| hero_vasilije_death.png | 32×32 | 6 | 8 | once |
| hero_vasilije_respawn.png | 32×32 | 6 | 10 | once at a checkpoint, then idle |

`hero_vasilije.json` is the machine-readable version (paths to the shared ice projectile/impact are relative to this folder). `elemental16.hex` is the shared palette.

## Implementation notes
- Horizontal strips, no padding. All frames share one origin: feet at (16, 31). Faces **right**, so mirror for left.
- Hitbox: x 11, y 10, w 10, h 21.
- Attack: spawn `fx_ice_projectile` on attack frame 3 at offset (29, 19); the pendant glows on frames 1-4.
- Hurt: frame 0 (white flash), frame 1, then ~1s of invulnerability flicker.
- Respawn: embers of the ice colours gather into the idle pose; play at the checkpoint, then switch to idle.
- Render at integer scale with nearest-neighbour filtering.

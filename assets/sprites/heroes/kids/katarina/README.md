# Katarina (11): fire cousin (Elemental Heroes · The Rescue of Baba Vera)

Long golden hair that streams when running, tide-blue t-shirt with frost sleeve trim, slate sweatpants. Sketchbook tucked under her arm in idle.
About 24px tall (the knights are ~24px). Element shows as the glowing stone pendant, the gold/orange trim and the attack effect.
Power: **Fireball**, the same projectile and impact as Cinder (`sprites/heroes/fire/`).

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| hero_katarina_idle.png | 32×32 | 4 | 6 | loop |
| hero_katarina_run.png | 32×32 | 8 | 12 | loop |
| hero_katarina_jump.png | 32×32 | 2 | 8 | once |
| hero_katarina_fall.png | 32×32 | 2 | 8 | loop |
| hero_katarina_land.png | 32×32 | 2 | 12 | once |
| hero_katarina_attack.png | 32×32 | 6 | 14 | once (projectile spawns on frame 3) |
| hero_katarina_hurt.png | 32×32 | 2 | 8 | once (frame 0 = white flash) |
| hero_katarina_death.png | 32×32 | 6 | 8 | once |
| hero_katarina_respawn.png | 32×32 | 6 | 10 | once at a checkpoint, then idle |

`hero_katarina.json` is the machine-readable version (paths to the shared fire projectile/impact are relative to this folder). `elemental16.hex` is the shared palette.

## Implementation notes
- Horizontal strips, no padding. All frames share one origin: feet at (16, 31). Faces **right**, so mirror for left.
- Hitbox: x 11, y 8, w 10, h 23.
- Attack: spawn `fx_fire_projectile` on attack frame 3 at offset (30, 17); the pendant glows on frames 1-4.
- Hurt: frame 0 (white flash), frame 1, then ~1s of invulnerability flicker.
- Respawn: embers of the fire colours gather into the idle pose; play at the checkpoint, then switch to idle.
- The sketchbook only appears in idle; she tucks it away when she moves.
- Render at integer scale with nearest-neighbour filtering.

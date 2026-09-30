# Dimitrije (7): air cousin (Elemental Heroes · The Rescue of Baba Vera)

Blond hair with a cowlick, mustard t-shirt with leaf-green collar, slate shorts, leaf-green socks. Football at his feet in idle (toe-tap on frame 2).
About 20px tall (the knights are ~24px). Element shows as the glowing stone pendant, the leaf-green trim and the attack effect.
Power: **Gale crescent**, the same projectile and impact as Wisp (`sprites/heroes/air/`).

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| hero_dimitrije_idle.png | 32×32 | 4 | 6 | loop |
| hero_dimitrije_run.png | 32×32 | 8 | 12 | loop |
| hero_dimitrije_jump.png | 32×32 | 2 | 8 | once |
| hero_dimitrije_fall.png | 32×32 | 2 | 8 | loop |
| hero_dimitrije_land.png | 32×32 | 2 | 12 | once |
| hero_dimitrije_attack.png | 32×32 | 6 | 14 | once (projectile spawns on frame 3) |
| hero_dimitrije_hurt.png | 32×32 | 2 | 8 | once (frame 0 = white flash) |
| hero_dimitrije_death.png | 32×32 | 6 | 8 | once |
| hero_dimitrije_respawn.png | 32×32 | 6 | 10 | once at a checkpoint, then idle |

`hero_dimitrije.json` is the machine-readable version (paths to the shared air projectile/impact are relative to this folder). `elemental16.hex` is the shared palette.

## Implementation notes
- Horizontal strips, no padding. All frames share one origin: feet at (16, 31). Faces **right**, so mirror for left.
- Hitbox: x 11, y 12, w 10, h 19.
- Attack: spawn `fx_air_projectile` on attack frame 3 at offset (28, 22); the pendant glows on frames 1-4.
- Hurt: frame 0 (white flash), frame 1, then ~1s of invulnerability flicker.
- Respawn: embers of the air colours gather into the idle pose; play at the checkpoint, then switch to idle.
- The football in idle is baked into the sprite (decorative, no physics). For a kickable ball use `prop_football` (later batch).
- Render at integer scale with nearest-neighbour filtering.

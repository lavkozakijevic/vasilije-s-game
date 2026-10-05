# Misha (Miša): playable hero (unlocked by finishing Level 7)

The cousins' uncle, Rubi's husband. Short black hair, a white shirt with blue horizontal stripes, dark trousers, black shoes. A grown-up, about as tall as Rubi. No lawnmower here.
About 26px tall. Same 32×32 rig, origin and animation list as Rubi and Baba Vera.
Power: **Grass ball** (`sprites/heroes/grass/`).

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| hero_misha_idle.png | 32×32 | 4 | 6 | loop |
| hero_misha_run.png | 32×32 | 8 | 12 | loop |
| hero_misha_jump.png | 32×32 | 2 | 8 | once |
| hero_misha_fall.png | 32×32 | 2 | 8 | loop |
| hero_misha_land.png | 32×32 | 2 | 12 | once |
| hero_misha_attack.png | 32×32 | 6 | 14 | once (projectile spawns on frame 3) |
| hero_misha_hurt.png | 32×32 | 2 | 8 | once (frame 0 = white flash) |
| hero_misha_death.png | 32×32 | 6 | 8 | once |
| hero_misha_respawn.png | 32×32 | 6 | 10 | once at a checkpoint, then idle |

## Implementation notes
- Horizontal strips, no padding. Feet at (16, 31). Faces **right**; mirror for left.
- Attack: spawn the grass ball on attack frame 3 at (30, 14). It flies in a low arc and bursts into clippings on the ground or an enemy (values in `hero_misha.json`).
- Respawn: green and gold sparks gather into the idle pose.

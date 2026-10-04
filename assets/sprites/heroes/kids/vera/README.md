# Baba Vera: playable hero (secret unlock, the strongest hero)

Baba Vera exactly as in the intro and ending: auburn hair in a bun, rectangular glasses, red knitted scarf, tide-blue dress with a white apron.
About 26px tall. Same 32×32 rig, origin and animation list as the four cousins.
Power: **Golden ray** (`sprites/heroes/gold/`).

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| hero_vera_idle.png | 32×32 | 4 | 6 | loop |
| hero_vera_run.png | 32×32 | 8 | 12 | loop |
| hero_vera_jump.png | 32×32 | 2 | 8 | once |
| hero_vera_fall.png | 32×32 | 2 | 8 | loop |
| hero_vera_land.png | 32×32 | 2 | 12 | once |
| hero_vera_attack.png | 32×32 | 6 | 14 | once (projectile spawns on frame 3) |
| hero_vera_hurt.png | 32×32 | 2 | 8 | once (frame 0 = white flash) |
| hero_vera_death.png | 32×32 | 6 | 8 | once |
| hero_vera_respawn.png | 32×32 | 6 | 10 | once at a checkpoint, then idle |

## Implementation notes
- Horizontal strips, no padding. Feet at (16, 31). Faces **right**; mirror for left.
- Hitbox and projectile values are in `hero_vera.json`.
- Attack: spawn the projectile on attack frame 3 at (31, 15). The beam pierces one enemy.
- Respawn: golden sparks gather into the idle pose.

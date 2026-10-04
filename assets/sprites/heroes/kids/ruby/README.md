# Ruby: playable hero (unlocked by finishing Level 5)

The cousins' aunt from Chile. Brownish-red hair pinned up with a clip, rectangular glasses, red lipstick, red top, dark trousers, a silver necklace. Holds a small wrapped present in idle.
About 25px tall. Same 32×32 rig, origin and animation list as the four cousins.
Power: **Present lob** (`sprites/heroes/present/`).

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| hero_ruby_idle.png | 32×32 | 4 | 6 | loop |
| hero_ruby_run.png | 32×32 | 8 | 12 | loop |
| hero_ruby_jump.png | 32×32 | 2 | 8 | once |
| hero_ruby_fall.png | 32×32 | 2 | 8 | loop |
| hero_ruby_land.png | 32×32 | 2 | 12 | once |
| hero_ruby_attack.png | 32×32 | 6 | 14 | once (projectile spawns on frame 3) |
| hero_ruby_hurt.png | 32×32 | 2 | 8 | once (frame 0 = white flash) |
| hero_ruby_death.png | 32×32 | 6 | 8 | once |
| hero_ruby_respawn.png | 32×32 | 6 | 10 | once at a checkpoint, then idle |

## Implementation notes
- Horizontal strips, no padding. Feet at (16, 31). Faces **right**; mirror for left.
- Hitbox and projectile values are in `hero_ruby.json`.
- Attack: spawn the projectile on attack frame 3 at (30, 16). It flies in an arc and bursts into ribbons and confetti.
- Respawn: red and gold sparks gather into the idle pose.
- The small present in her hand only appears in idle.

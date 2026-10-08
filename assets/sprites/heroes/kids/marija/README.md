# Marija: playable hero (unlocked by winning Level 8)

Grandma Marija in her day clothes, as in Level 5: short wavy grey hair, glasses, light-blue t-shirt with small white embroidered flowers, slate skirt, light-blue slippers. Slightly stooped.
About 24px tall, a little shorter than Baba Vera. Same 32×32 rig, origin and animation list as Rubi, Baba Vera and Misha. She is 84: the run is a quick determined shuffle, the jump a small hop with her hand on her back.
Power: **Toy throw** (`sprites/heroes/toy/`). She holds a red brick on attack frames 0-2.

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| hero_marija_idle.png | 32×32 | 4 | 6 | loop |
| hero_marija_run.png | 32×32 | 8 | 12 | loop (a quick, determined shuffle) |
| hero_marija_jump.png | 32×32 | 2 | 8 | once (a small hop, hand on her back) |
| hero_marija_fall.png | 32×32 | 2 | 8 | loop |
| hero_marija_land.png | 32×32 | 2 | 12 | once |
| hero_marija_attack.png | 32×32 | 6 | 14 | once (the toy leaves her hand on frame 3) |
| hero_marija_hurt.png | 32×32 | 2 | 8 | once (frame 0 = white flash) |
| hero_marija_death.png | 32×32 | 6 | 8 | once |
| hero_marija_respawn.png | 32×32 | 6 | 10 | once at a checkpoint, then idle |

## Implementation notes
- Horizontal strips, no padding. Feet at (16, 31). Faces **right**; mirror for left.
- Attack: spawn a toy on attack frame 3 at (30, 15). Pick one of the 4 toys at random and loop its 2 frames while it flies in an arc; on contact play `fx_toy_impact` (values in `hero_marija.json`).
- Respawn: red, gold and blue sparks gather into the idle pose.

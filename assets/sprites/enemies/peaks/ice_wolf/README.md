# Ice Wolf (enemy_ice_wolf), HP 2

Pale grey wolf with frost crystals along its back and glowing frost eyes.

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| enemy_ice_wolf_idle.png | 32×32 | 4 | 6 | loop |
| enemy_ice_wolf_run.png | 32×32 | 6 | 12 | loop |
| enemy_ice_wolf_lunge.png | 32×32 | 4 | 12 | once (frame 0 = telegraph (crouch, glowing eyes), hold ~0.3s) |
| enemy_ice_wolf_hurt.png | 32×32 | 2 | 8 | once |
| enemy_ice_wolf_death.png | 32×32 | 5 | 8 | once |

- Origin: feet at (16, 31). Faces right; mirror for left.
- Lunge: frame 0 is the telegraph (crouch + eye glow). Move the entity on frames 1-2.
- death: frame 0 flash, then it dithers away into snow.

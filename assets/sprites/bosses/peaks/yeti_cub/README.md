# Snow Yeti Cub (boss_yeti_cub), optional mid-boss

A grumpy young yeti with white shaggy fur and a slate face, guarding a bridge.

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| boss_yeti_cub_idle.png | 64×64 | 4 | 5 | loop |
| boss_yeti_cub_walk.png | 64×64 | 6 | 8 | loop |
| boss_yeti_cub_stomp.png | 64×64 | 5 | 10 | once (frame 2 = impact: shake the camera ~0.3s and drop snow) |
| boss_yeti_cub_throw.png | 64×64 | 5 | 10 | once (release fx_big_snowball on frame 2) |
| boss_yeti_cub_hurt.png | 64×64 | 2 | 8 | once |
| boss_yeti_cub_defeat.png | 64×64 | 6 | 6 | once (0 wobble, 1 sits down, 2-3 sulks, 4-5 waves goodbye (loop 4-5 if you like)) |

- fx_big_snowball.png: 32×32, 4 frames, 10 fps loop.
- 64×64 frames, origin (32, 63). Faces right; mirror for left. HP 8 is a suggestion (the brief did not give one).

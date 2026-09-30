# Magma Colossus (boss_magma_colossus), HP 24

A towering giant of cracked black rock with lava in the cracks, molten gold eyes and a glowing magma core in its chest (the weak point).

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| boss_magma_colossus_idle.png | 96×96 | 4 | 5 | loop |
| boss_magma_colossus_telegraph.png | 96×96 | 4 | 4 | loop (magma core glows brighter; loop ~1s) |
| boss_magma_colossus_attack_slam.png | 96×96 | 6 | 10 | once (frame 2 = fists hit the ground: spawn fx_lava_wave) |
| boss_magma_colossus_attack_rain.png | 96×96 | 6 | 8 | once (roar on frames 1-3: molten rocks fall) |
| boss_magma_colossus_hurt.png | 96×96 | 2 | 8 | once |
| boss_magma_colossus_death.png | 96×96 | 8 | 8 | once (cools to grey; hold the last frame (rock pile)) |

- fx_lava_wave.png 64×32 (6f loop), fx_falling_magma.png 16×32 (4f loop), fx_warning_heat.png 32×32 (4f loop).
- 96×96 frames, origin (46, 95). Weak point x 41, y 45, 13×15. Pattern and offsets are in `boss_magma_colossus.json`.

# Frost Warden (boss_frost_warden), HP 24

A towering giant of glacier ice with frost cracks, glowing frost eyes and a crack in the middle of its chest (the weak point) that glows gold when exposed.

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| boss_frost_warden_idle.png | 96×96 | 4 | 5 | loop |
| boss_frost_warden_telegraph.png | 96×96 | 4 | 4 | loop (chest crack glows gold; loop ~1s) |
| boss_frost_warden_attack_spikes.png | 96×96 | 6 | 10 | once (frame 2 = fists hit the ground) |
| boss_frost_warden_attack_breath.png | 96×96 | 6 | 8 | once (spawn fx_frost_breath on frame 2, hold frames 2-4) |
| boss_frost_warden_hurt.png | 96×96 | 2 | 8 | once |
| boss_frost_warden_death.png | 96×96 | 8 | 8 | once (hold the last frame (ice pile)) |

- fx_ice_spike.png 32×64 (6f, frames 2-3 hurt), fx_frost_breath.png 96×32 (6f, frames 2-4 hurt), fx_warning_frost.png 32×32 (4f loop).
- 96×96 frames, origin (46, 95) like the Blightwarden. Weak point x 41, y 38, 12×28. Attack pattern and offsets are in `boss_frost_warden.json`.

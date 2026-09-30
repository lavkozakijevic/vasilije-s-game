# Frostling (enemy_frostling), HP 3

A squat walking chunk of ice with a snow cap and an angry face. It raises a slab of ice as a shield.

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| enemy_frostling_walk.png | 32×32 | 6 | 8 | loop |
| enemy_frostling_shield_up.png | 32×32 | 3 | 12 | once (play when shot from the front, then shield_hold) |
| enemy_frostling_shield_hold.png | 32×32 | 2 | 6 | loop |
| enemy_frostling_hurt.png | 32×32 | 2 | 8 | once |
| enemy_frostling_death.png | 32×32 | 6 | 10 | once (shatters) |

- Shield hitbox (facing right): x 26, y 11, w 5, h 20. Fire and light break it.
- death: flash, cracks, then the body shatters outward.

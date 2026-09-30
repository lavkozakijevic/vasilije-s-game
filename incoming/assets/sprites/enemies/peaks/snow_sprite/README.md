# Snow Sprite (enemy_snow_sprite), HP 1

A small flying ice spirit: a frosty orb with six crystal spikes that slowly turn.

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| enemy_snow_sprite_fly.png | 32×32 | 4 | 8 | loop |
| enemy_snow_sprite_attack.png | 32×32 | 5 | 10 | once (release the snowball on frame 3) |
| enemy_snow_sprite_hurt.png | 32×32 | 2 | 8 | once |
| enemy_snow_sprite_death.png | 32×32 | 5 | 10 | once |

- fx_snowball.png: 16×16, 4 frames, 12 fps loop. fx_snowball_burst.png: 16×16, 4 frames, 14 fps once.
- Origin: centre (16, 16). The snowball forms above its head on attack frames 0-2 and is released on frame 3 at offset (18, 4).

# Shadow Shade (enemy_shadow_shade), HP 2

A floating wisp of darkness with frost-white eyes and a trailing tail.

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| enemy_shadow_shade_fly.png | 32×32 | 4 | 8 | loop |
| enemy_shadow_shade_fade_out.png | 32×32 | 4 | 12 | once (play when hit by anything except light; it becomes intangible) |
| enemy_shadow_shade_fade_in.png | 32×32 | 4 | 12 | once |
| enemy_shadow_shade_attack.png | 32×32 | 5 | 10 | once (claw hurts on frames 2-3) |
| enemy_shadow_shade_hurt.png | 32×32 | 2 | 8 | once |
| enemy_shadow_shade_death.png | 32×32 | 6 | 10 | once (burns away into gold sparks (light only)) |

- Only light (Konstantin, Aurel) really hurts it. Other hits make it fade out and back in.
- fade_out/fade_in dither the sprite away with the Bayer pattern (no alpha).

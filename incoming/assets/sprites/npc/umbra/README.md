# Umbra, spellbound (npc_umbra)

The shadow Hearth Knight under Mrak's spell, with glowing void-purple eyes and a torn cloak.

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| npc_umbra_idle.png | 32×32 | 4 | 6 | loop |
| npc_umbra_dash.png | 32×32 | 4 | 14 | loop |
| npc_umbra_attack.png | 32×32 | 5 | 14 | once |
| npc_umbra_stunned.png | 32×32 | 4 | 8 | once (the spell breaks: purple sparks leave him; his eyes return to frost on frames 2-3) |
| npc_umbra_kneel.png | 32×32 | 4 | 6 | once (hold the last frame, then swap to the hero_shadow (Umbra) sprites) |

- attack spawns the existing `sprites/heroes/shadow/fx_shadow_projectile.png` on frame 3.
- After kneel, switch to the normal hero_shadow sprites and portrait_knight_shadow_neutral.

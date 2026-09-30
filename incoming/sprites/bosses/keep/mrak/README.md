# Mrak, the Hollow King (boss_mrak)

Tall shadow king in a ragged cloak, crown of black thorns, cold frost-white eyes and a void core on his chest. Only ink, plum, slate, stone, void, frost and bone (the summon glow uses the wardens' colours).

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| boss_mrak_idle.png | 128×128 | 4 | 5 | loop |
| boss_mrak_telegraph.png | 128×128 | 4 | 8 | once (hands gather void; play before shadow_attack) |
| boss_mrak_shadow_attack.png | 128×128 | 6 | 12 | once (spawn fx_mrak_shadow_wave on frame 3 at the front hand, ground level) |
| boss_mrak_summon.png | 128×128 | 6 | 8 | loop (phase 2; warden colours (leaf, frost, flame) orbit him) |
| boss_mrak_hurt.png | 128×128 | 2 | 8 | once (frame 0 white flash) |
| boss_mrak_phase_change.png | 128×128 | 6 | 8 | once (burst ring on frames 2-4; switch to phase 2 after) |
| boss_mrak_defeat.png | 128×128 | 8 | 8 | once (shrinks and dithers away; hold on an empty frame, then show mrak_small) |
| fx_mrak_shadow_wave.png | 64×32 | 6 | 12 | loop (move ~140px/s along the ground) |
| fx_mrak_orb.png | 16×16 | 4 | 10 | loop (homing projectile, ~90px/s) |
| npc_mrak_small_idle.png | 32×32 | 4 | 5 | loop (ending: tiny Mrak in Baba's red scarf) |
| npc_mrak_small_shiver.png | 32×32 | 4 | 12 | loop (ending: tiny Mrak in Baba's red scarf) |

## Notes
- Boss frames are 128×128, origin (64, 127). Faces right; mirror for left.
- Suggested loop: idle → telegraph → shadow_attack (wave on frame 3) or fire 3 orbs from the hands at the end of telegraph. Under 50% health play phase_change, then add summon.
- Weak point: the void core at (60, 55, 9×9).
- defeat ends on a near-empty frame; cut to the ending or swap in npc_mrak_small.

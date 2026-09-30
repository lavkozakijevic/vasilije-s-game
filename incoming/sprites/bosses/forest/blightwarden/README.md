# Blightwarden: forest boss (Elemental Heroes)

A giant corrupted stump-warden with antler branches, a moss-draped crown, gold eyes and an ember-lit maw. When it charges an attack, lava cracks split its bark.

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| boss_blightwarden_idle.png | 96×96 | 4 | 5 | loop |
| boss_blightwarden_telegraph.png | 96×96 | 4 | 8 | loop, at least 2 cycles (~1s) before attacking |
| boss_blightwarden_attack.png | 96×96 | 6 | 10 | once; frame 1 = slam impact |
| boss_blightwarden_hurt.png | 96×96 | 2 | 8 | once (frame 0 = flash) |
| boss_blightwarden_death.png | 96×96 | 8 | 8 | once; hold the last frame (stump pile) |
| fx_blightwarden_warning.png | 32×32 | 4 | 8 | loop, on the ground during telegraph; harmless |
| fx_blightwarden_roots.png | 32×64 | 6 | 12 | once; frames 2–3 deal damage |

`boss_blightwarden.json` has the hitbox, weak point, origin, HP and the full attack pattern.

## Attack: Root Slam (telegraphed)
1. **Telegraph (about 1s):** loop `telegraph` twice. The eyes flare, the cracks pulse ember→gold, and the arm is raised. At the same time, play `fx_blightwarden_warning` at 3 ground spots 40px apart, starting 24px in front of the boss.
2. **Slam:** play `attack`. On frame 1, spawn `fx_blightwarden_roots` (bottom-center anchored) at each warned spot.
3. **Hit window:** roots frames 2–3 hurt the player (hitbox x 6, y 14, w 20, h 50).
4. Cooldown of 2.5s, then return to idle.

## Notes
- Faces right; flip it in arenas where the player enters from the left.
- Origin at (46, 95), roots on the ground. Body hitbox x 26, y 22, w 42, h 72. Optional face weak point x 34, y 34, w 26, h 14.
- Same 16-color palette and outline rules as the rest of the pack.

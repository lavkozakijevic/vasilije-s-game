# Elder Rotroot: boss of Forest 1-1

A giant Rotroot: a moss-crowned stump with a sprouting twig, heavy brows, glowing gold eyes and an ember-lit maw. Lava cracks open across its bark when it telegraphs.

| file | frame | frames @ fps | playback |
|---|---|---|---|
| boss_rotroot_idle.png | 64×64 | 4 @ 5 | loop |
| boss_rotroot_move.png | 64×64 | 6 @ 8 | loop (root legs shuffle) |
| boss_rotroot_tell.png | 64×64 | 3 @ 6 | once; rears back, eyes flare, cracks glow; **hold the last frame 0.4s** |
| boss_rotroot_charge.png | 64×64 | 4 @ 12 | loop while charging (dust and speed lines) |
| boss_rotroot_throw.png | 64×64 | 5 @ 10 | once; seed in hand on frames 0–1, **release on frame 2** |
| boss_rotroot_hurt.png | 64×64 | 2 @ 8 | once |
| boss_rotroot_death.png | 64×64 | 8 @ 8 | once: flash, roar, slump, splinter into chips + embers, stump pile (hold) |
| fx_seed_projectile.png | 16×16 | 4 @ 12 | loop (spinning acorn with an ember seam) |
| fx_seed_impact.png | 16×16 | 4 @ 12 | once, on ground contact |
| prop_thorn_gate_closed.png | 32×96 | 1 | solid wall |
| prop_thorn_gate_opening.png | 32×96 | 6 @ 10 | once on boss death, then remove the collider |
| ui_bossbar_frame.png | 208×16 | – | fill area x 20, y 4, w 184, h 8 |
| ui_bossbar_fill.png | 8×8 | – | repeat-x inside the fill area; crop the width to HP% |

## Pattern (see `boss_rotroot.json`)
1. **Charge:** tell (hold 0.4s), then charge at 180px/s to the arena wall, then idle 0.6s. Contact deals 1 damage.
2. **Seed Throw:** tell, then throw. Spawn 3 seeds on throw frame 2 from about (52,18), arcing at the player with ±40px spread.
3. **Wander:** move toward the player for 1.5s between attacks.
Below 50% HP: the tell hold drops to 0.2s and it throws 5 seeds. 12 HP. Origin at the feet (32,63), hitbox x 15, y 18, w 32, h 45. Faces right; flip it to face the player.

Arena: use `bg_forest_arena_near.png` in place of the near layer, plus `fg_forest_branches.png` (parallax 1.2) in front. Put thorn gates at both arena edges.

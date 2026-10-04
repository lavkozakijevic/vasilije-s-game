# Attic Wasp (enemy_wasp), HP 1

A chubby yellow-and-black striped wasp with small pale-blue wings, a big friendly eye and a tiny stinger. 32×32, faces right, body centred at (16, 16).

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| enemy_wasp_fly.png | 32×32 | 4 | 16 | loop: wings buzzing fast; frames bob 1px |
| enemy_wasp_attack.png | 32×32 | 4 | 12 | once: frame 0 lean back (telegraph, hold ~0.25s), 1-2 dart stinger first, 3 recover |
| enemy_wasp_hurt.png | 32×32 | 2 | 8 | once: frame 0 = white flash |
| enemy_wasp_death.png | 32×32 | 5 | 12 | once: spins and drops; despawn after |

Wakes up when Mita picks up Mishika and flies out of `sprites/props/attic/prop_wasp_nest.png`. Behaviour and speeds in `enemy_wasp.json`.

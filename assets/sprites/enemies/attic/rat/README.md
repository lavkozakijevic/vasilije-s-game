# Attic Rat (enemy_rat), HP 1

A grey attic rat with a pink tail and pink ears: mischievous, not scary. 32×32, faces right, feet at (16, 31).

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| enemy_rat_idle.png | 32×32 | 4 | 6 | loop |
| enemy_rat_run.png | 32×32 | 6 | 14 | loop |
| enemy_rat_chase.png | 32×32 | 6 | 16 | loop: eyes fixed on Mita, whiskers back |
| enemy_rat_hurt.png | 32×32 | 2 | 8 | once: frame 0 = white flash |
| enemy_rat_death.png | 32×32 | 5 | 10 | once: tumbles, gets up dizzy, scampers off to the left; despawn after the last frame |
| enemy_rat_small_run.png | 24×16 | 6 | 16 | loop: baby rat for packs of 3-4 |

Nothing gory: on death it flips over, gets up dizzy and runs off. Speeds and behaviour in `enemy_rat.json`.

# Attic Spider (enemy_spider), HP 1

A round dark-purple attic spider with 8 thin legs and small red eyes, hanging on a silk thread. Creepy-cute: a little smile with two tiny white fangs. 32×32, body centred at (16, 16). The engine draws the thread from the ceiling to (16, 0).

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| enemy_spider_idle.png | 32×32 | 4 | 6 | loop: hanging, legs twitching |
| enemy_spider_drop.png | 32×32 | 2 | 10 | loop: legs pulled in; fall fast |
| enemy_spider_climb.png | 32×32 | 4 | 8 | loop: pulls itself back up |
| enemy_spider_hurt.png | 32×32 | 2 | 8 | once: frame 0 = white flash |
| enemy_spider_death.png | 32×32 | 5 | 10 | once: curls up and falls; no thread from frame 1; despawn after |

Wakes up when Mita picks up Mishika. Behaviour and speeds in `enemy_spider.json`.

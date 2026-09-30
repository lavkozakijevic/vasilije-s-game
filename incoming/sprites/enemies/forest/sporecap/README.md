# Sporecap: forest stationary shooter

A squat void-purple mushroom with bone spots and gold eyes. It fires arcing spores.

| file | frame | frames @ fps | playback |
|---|---|---|---|
| enemy_sporecap_idle.png | 32×32 | 4 @ 6 | loop (breathing cap, drifting motes) |
| enemy_sporecap_attack.png | 32×32 | 6 @ 10 | once; **spawn the spore on frame 2** at (16,6) |
| enemy_sporecap_hurt.png | 32×32 | 2 @ 8 | once |
| enemy_sporecap_death.png | 32×32 | 5 @ 8 | once; bursts into spores |
| fx_spore_projectile.png | 16×16 | 4 @ 10 | loop |
| fx_spore_burst.png | 16×16 | 4 @ 12 | once, on contact |

Origin at the feet (16,31). Hitbox x 6, y 9, w 20, h 22. HP 2. It fires every 2.2s while the player is within 200px. Suggested arc: vx about 90px/s toward the player, vy -220px/s, gravity 600px/s².

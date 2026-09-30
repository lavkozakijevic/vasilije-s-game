# Mothwing: forest flying enemy

A moth with bark-brown fuzz and stone wings marked with gold eyespots. It patrols in a sine wave and dives at the player.

| file | frames @ fps | playback |
|---|---|---|
| enemy_mothwing_fly.png | 4 @ 10 | loop (wing up / mid / down / mid) |
| enemy_mothwing_attack.png | 4 @ 10 | once: windup, fold, dive (with streaks), recover |
| enemy_mothwing_hurt.png | 2 @ 8 | once (frame 0 = flash) |
| enemy_mothwing_death.png | 5 @ 8 | once; torn wings flutter down |

Frames are 32×32 and face right. Origin is the center (16,16). Hitbox x 7, y 7, w 18, h 14. HP 1.
Behavior (see `enemy_mothwing.json`): sine patrol with 18px amplitude and a 2.4s period at 40px/s. When the player is below it within 64px, it dives along the attack animation's path, then climbs back.

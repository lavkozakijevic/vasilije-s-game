# Present (Ruby's power)

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| fx_present_projectile.png | 16×16 | 4 | 12 | loop: red-and-gold gift tumbling |
| fx_present_explosion.png | 48×48 | 6 | 12 | once: pops into ribbons and confetti; hurts on frames 1-2 |

Throw it in an arc (vx 170px/s, vy -260px/s, gravity 700px/s²). It bursts when it touches the ground or an enemy; centre the explosion on the gift. HUD badge: `ui/icon_element_present.png`.

# Mishika (Mišika), Marija's blue cat

A fluffy grey-blue cat with gold eyes and a pink nose, a little shy. 32×32, faces right, feet at (16, 31).

| file | frames | fps | playback |
|---|---|---|---|
| npc_mishika_idle.png | 4 | 6 | loop |
| npc_mishika_sit.png | 4 | 6 | loop: tail swish |
| npc_mishika_run.png | 6 | 12 | loop |
| npc_mishika_hide.png | 4 | 10 | once: frames 2-3 are clipped on the right: line frame x=22 (frame 2) and x=16 (frame 3) up with the left edge of the box she hides behind; then move her to the next hiding spot |
| npc_mishika_found.png | 4 | 8 | once: meows on frames 0-1, crouches, leaps toward Mita on frame 3; then switch Mita to carry |

Behaviour and hitbox in `npc_mishika.json`. Portraits: `ui/portraits/portrait_mishika_neutral.png`, `_happy.png`.

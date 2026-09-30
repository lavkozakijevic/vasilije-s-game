# Fire fox (companion_fire_fox), companion of Vasilije

Orange fox with a bone chest and snout, black socks and a big tail whose tip flickers with embers.

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| companion_fire_fox_idle.png | 32×32 | 4 | 5 | loop |
| companion_fire_fox_run.png | 32×32 | 6 | 12 | loop |
| companion_fire_fox_jump.png | 32×32 | 2 | 8 | once (frame 0 rising, frame 1 falling) |
| companion_fire_fox_special.png | 32×32 | 4 | 10 | once |

## Notes
- Origin: feet at (16, 31). Faces right; mirror for left.
- Special: dash and grab: 0 lean, 1 dash (speed streaks), 2 snap, 3 holding a gold item. Move the entity forward fast on frames 1-2; attach the grabbed item on frame 3.
- Suggested follow: stay ~18px behind the child, switch idle/run with the child's speed, and jump when the child jumps.

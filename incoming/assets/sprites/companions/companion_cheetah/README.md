# Cheetah (companion_cheetah), companion of Katarina

Katarina's cheetah: slim golden body with black spots, black tear lines from the eyes, long legs, a ringed tail with a white tip, and a frost-blue collar with a little ice charm that matches her pendant.

## Files
| file | frame | frames | fps | playback |
|---|---|---|---|---|
| companion_cheetah_idle.png | 32×32 | 4 | 5 | loop |
| companion_cheetah_run.png | 32×32 | 6 | 12 | loop |
| companion_cheetah_jump.png | 32×32 | 2 | 8 | once (frame 0 rising, frame 1 falling) |
| companion_cheetah_special.png | 32×32 | 4 | 10 | once |

## Notes
- Origin: feet at (16, 31). Faces right; mirror for left.
- Special: pounce: 0 crouch, 1 leap (sprite lifts 4px), 2 land forward, 3 settle. The sprite drifts 3px forward inside the frame; add ~24px of entity movement across frames 1-2.
- Suggested follow: stay ~18px behind the child, switch idle/run with the child's speed, and jump when the child jumps.

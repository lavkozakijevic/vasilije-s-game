# Marija at night (npc_marija_night)

Grandma Marija in a long grey-lilac nightgown with a lace collar, light-blue slippers, her grey hair in a hair net (a little purple bow at the back), glasses, a burlap sack on her back and a flashlight held forward in her right hand. Same 32×32 frame and feet as `npc_marija` (origin (16, 31)), faces right. About 24px tall. Only the lit lens is drawn: the engine draws the beam.

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| npc_marija_night_walk.png | 32×32 | 6 | 5 | loop: slow shuffle (about 16px/s); the flashlight sways a little |
| npc_marija_night_search.png | 32×32 | 4 | 6 | loop: stops and sweeps the flashlight up and down, squinting; play 1-2 loops, then walk |
| npc_marija_night_pickup.png | 32×32 | 4 | 6 | once: bends down, picks up a toy, drops it in the sack on her back: remove the toy on frame 1, +1 sack on frame 3 |
| npc_marija_night_spot.png | 32×32 | 4 | 8 | once: "Aha!": straightens up, eyebrows up; hold the last frame ~0.6s |
| npc_marija_night_yawn.png | 32×32 | 4 | 5 | once: ending: yawns behind her hand, flashlight dimmed |
| npc_marija_night_stunned.png | 32×32 | 4 | 8 | loop: a kid landed on her head: wobbles, stars, the flashlight flickers off/on. Loop for stunSec, then walk |

- Lens pixel and beam angle for every frame are in `npc_marija_night.json` (`flashlight.perFrame`), so the beam follows the sway, the sweep and the flicker (`light`: on, dim, off).
- Her head is a one-way platform (`headPlatform.perFrame`). Landing on it plays `stunned`.
- Level rules (50 s, 30 toys, Aha! = -5 s, head stomp = +5 s, kid must end with more toys than the sack) are in the `level` block.
- Portraits: `ui/portraits/portrait_marija_night_grumpy/_suspicious/_sleepy/_proud.png`.

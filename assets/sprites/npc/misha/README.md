# Misha (Miša), the cousins' uncle, with his lawnmower

A grown-up (about 40px tall, taller than the kids): short black hair, white shirt with blue horizontal stripes, dark trousers, black shoes. He pushes a red lawnmower, which is part of these sprites. Frames are 64×48: Misha on the left half (feet at (16, 47)), the mower on the right half. Faces right.

| file | frame | frames | fps | playback |
|---|---|---|---|---|
| npc_misha_mow.png | 64×48 | 6 | 10 | loop: walks behind the mower at about 45px/s; mower shakes, grass flies |
| npc_misha_turn.png | 64×48 | 4 | 8 | once: pulls the mower around; ends facing LEFT (frame 3 = mirrored mow frame 0): flip the sprite and carry on with mow |
| npc_misha_bonk.png | 64×48 | 4 | 8 | once: a kid landed on his head: squash, wobble, stars; hold the last frame ~0.4s, then mow |
| npc_misha_idle.png | 64×48 | 4 | 5 | loop: wipes his forehead; mower off |
| npc_misha_wave.png | 64×48 | 4 | 8 | loop: ending: stops and waves |

- Kids can stand on his head (x 11-22, y 8) and on the mower deck (x 38-61, y 34) as one-way platforms. Touching him or the mower any other way costs a life.
- Toys inside the blade box are mowed. Hurtboxes, platforms, speeds and the level rules (26 toys, one every 5 s, win at 16, lose at 11 mowed) are in `npc_misha.json`.
- Portraits: `ui/portraits/portrait_misha_neutral/_laughing/_surprised/_proud.png`.

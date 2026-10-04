Elemental Heroes · The Rescue of Baba Vera: Level 6 add-on "Spiders and Wasps" (phase 8b)

Story context: Level 6 "Mishika in the Attic". When Mita picks up Mishika, the attic wakes up:
spiders drop from the ceiling on their threads and wasps leave their nest. They should look
mischievous and a bit creepy-cute, not scary (the players are 5-9 years old).

Follow the existing pack rules: 16-color elemental16 palette, 1-art-pixel ink outline, light
from top-left, Bayer dither only, no alpha fades, horizontal strips with equal frames, no padding,
facing right, 32px tiles, 640x360 view. README.md + <id>.json per folder, as before.

SCALE: the kids are ~20-26px tall, so these bugs are small, about the size of the rats.

EXPORT RULES
- Export ONLY the new files listed here, in the same folder layout as before.
- Do NOT include maps (.tmj) or re-export earlier files.

1. SPIDER: sprites/enemies/attic/spider/ (32x32 frames, HP 1, the body centred in the frame)
A round dark-purple attic spider with 8 thin legs and small red eyes. It hangs on a silk thread
(the engine draws the thread from the ceiling to the top centre of the frame).
- enemy_spider_idle 4 (hanging, legs twitching)
- enemy_spider_drop 2 (legs pulled in, falling fast)
- enemy_spider_climb 4 (pulling itself back up the thread)
- enemy_spider_hurt 2
- enemy_spider_death 5 (curls up and falls, nothing gory)

2. WASP: sprites/enemies/attic/wasp/ (32x32 frames, HP 1, the body centred in the frame)
A chubby yellow-and-black striped wasp with small pale-blue wings and a tiny stinger.
- enemy_wasp_fly 4 (wings buzzing fast)
- enemy_wasp_attack 4 (it leans forward and darts, stinger first)
- enemy_wasp_hurt 2
- enemy_wasp_death 5 (spins and drops, nothing gory)

3. WASP NEST (decor): sprites/props/attic/prop_wasp_nest.png (32x32, 4f loop: a papery grey nest
hanging from a rafter with a wasp or two crawling in and out).

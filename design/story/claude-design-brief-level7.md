Elemental Heroes · The Rescue of Baba Vera: Level 7 "The Lawn" (phase 9)

Story context: right after Level 6 (Mita brought Mishika down from the attic), the cousins go
outside into the garden of the same house in Ivanovo, in spring. Uncle MISHA (Serbian: Miša), the
cousins' uncle and Rubi's husband, is mowing the lawn with a loud lawnmower. The cousins' toys from Level 5 are falling from the sky into the
garden, and the kids must pick them up before Misha's lawnmower runs them over. If Misha or his
lawnmower touches a kid, the kid loses a life. The kids can jump on top of Misha's head and the
mower like on a platform to get over him. Toys fall one every 5 seconds (26 in all). Picking up
16 wins the level, and Misha joins as a playable hero. If he mows 11, the kids lose and try again.
At the end Misha says "Good job! Don't leave those toys out again!" 

Follow the existing pack rules: 16-color elemental16 palette, 1-art-pixel ink outline, light
from top-left, Bayer dither only, no alpha fades, horizontal strips with equal frames, no padding,
facing right, 32px tiles, 640x360 view. README.md + <id>.json per folder, as before.

SCALE: the kids are ~20-26px tall. Draw everything at their scale. Keep the garden simple: flat
grass, two trees, a few low things to jump on. The toys reuse the Level 5 toy sprites (do NOT
redraw them).

EXPORT RULES
- Export ONLY the new files listed here, in the same folder layout as before.
- Do NOT include maps (.tmj) or re-export earlier files.

1. MISHA: sprites/npc/misha/ (a grown-up, taller than the kids: 32x48 frames, feet on the bottom
row, facing right). White skin, black hair, a WHITE shirt with BLUE horizontal stripes, dark
trousers, BLACK shoes. He pushes a red lawnmower (the mower is part of these sprites, in front of
him, so each frame is 64x48: Misha on the left half, the mower on the right half).
- npc_misha_mow 6 (walking behind the mower, the mower shaking a little, grass bits flying)
- npc_misha_turn 4 (he pulls the mower around to face the other way)
- npc_misha_bonk 4 (a kid jumped on his head: he wobbles, stars around his head)
- npc_misha_idle 4 (standing, wiping his forehead)
- npc_misha_wave 4 (for the ending: he stops and waves)
- Portraits (ui/portraits/, 64x64): portrait_misha_neutral, _laughing, _surprised, _proud.

1b. MISHA AS A PLAYABLE HERO (unlocked by winning Level 7): sprites/heroes/kids/misha/
hero_misha_<anim>.png (+ .json) on the SAME 32x32 hero rig and animation list as Rubi and Baba
Vera (idle 4, run 8, jump 2, fall 2, land 2, attack 6, hurt 2, death 6, respawn 6; facing right),
WITHOUT the lawnmower. Same look: white shirt with blue stripes, black hair, black shoes, a grown-up
so a little taller than the kids (like Rubi).
His attack: he throws a ball of freshly-cut grass. sprites/heroes/grass/: fx_grass_projectile
(16x16, 4f: a green clump tumbling), fx_grass_impact (32x32, 4f: it bursts into clippings),
icon_element_grass (the HUD badge icon, same size as the other icon_element_* files).

2. FX: sprites/fx/garden/
- fx_grass_clippings (32x32, 6f: a puff of cut grass behind the mower)
- fx_toy_shredded (32x32, 6f: a toy gets mowed: a soft "poof" of confetti and bits, nothing sad
  or violent)
- fx_toy_fall_shadow (16x8, 4f: the shadow on the grass where a toy is about to land, growing)
- fx_toy_land (32x16, 4f: a little bounce of dust when a toy lands)

3. GARDEN TILESET: tilesets/garden/tileset_garden.png + .tsj + .tsx (32x32, same property names:
solid, oneway, crumble, bounce, hazard, hidden_room, foreground, fade_when_behind)
- grass ground: 3x3 set style top + fill (freshly-cut stripes and long grass variants), dirt edge
- two kinds of TREE, each about 3 tiles wide and 5 tall: trunk (decor), branches you can stand on
  (one-way, l/m/r), leafy crown (foreground, fades when behind)
- low things to jump on (solid or one-way tops): a wooden garden bench, a garden table, a
  wheelbarrow, a stack of flower pots, a low brick wall, a garden-shed roof (one-way)
- a trampoline (bounce: idle + 4-frame squash)
- decor: flowers, tulips, a watering can, a garden hose, a gnome, a bird bath, a fence, a swing
- the back door of the house (decor, 2x3) where the level starts

4. BACKGROUNDS: backgrounds/garden/ (640x360, parallax like before, low detail) bg_garden_sky
(spring blue sky, soft clouds), bg_garden_far (the village of Ivanovo and hills), bg_garden_mid
(the house wall and the fence), bg_garden_near (bushes and blossoms), fg_garden_petals
(transparent foreground of falling blossom petals, parallax 1.2).

5. CUTSCENE (cutscenes/garden/, 640x360 layers bg/chars/fx, like the spring cutscene)
- garden_01_outside: the cousins and Mita (holding Mishika) come out of the back door into the
  garden; Misha is starting the lawnmower.
- garden_02_toys: a gust of wind (or the toy box tipping out of the upstairs window) sends the
  toys flying up into the sky above the garden.
- garden_03_done: after the level, Misha leans on the mower and laughs, the cousins hold the
  rescued toys in a big pile ("Good job! Don't leave those toys out again!").
+ garden.json and README with suggested motion.

6. UI: ui/ui_mower_icon (16x16, a little lawnmower, for "toys mowed" on the HUD).

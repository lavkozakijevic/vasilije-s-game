Elemental Heroes · The Rescue of Baba Vera: Level 8 "Night Patrol" (phase 10)

Story context: after Level 7 (the lawn), the cousins go back into the house and night falls. The
toys are all over the living room again. Grandma MARIJA (84, grey hair, glasses as before) wakes
up, grumbles that the four cousins didn't pick up their toys, and goes around the dark house with
a flashlight to find every toy and throw it out. One cousin (the player picks any of the four)
has 50 seconds to pick up 30 toys before Marija gets them. It is dark everywhere; Marija's
flashlight makes a cone of light. The kids can hide in shadows (under the table, behind the
curtains, under the bed, inside the cupboard) so she can't find them. When the level is won,
Marija joins as a playable hero: she throws toys at enemies.

Follow the existing pack rules: 16-color elemental16 palette, 1-art-pixel ink outline, light
from top-left (for this level: moonlight from the windows), Bayer dither only, no alpha fades,
horizontal strips with equal frames, no padding, facing right, 32px tiles, 640x360 view.
README.md + <id>.json per folder, as before.

SCALE: the kids are ~20-26px tall. The level reuses the Level 5 living room (tileset_house) and
the Level 5 toy sprites: do NOT redraw them. The engine darkens the room itself; draw only what
is listed here.

EXPORT RULES
- Export ONLY the new files listed here, in the same folder layout as before.
- Do NOT include maps (.tmj) or re-export earlier files.

1. MARIJA AT NIGHT: sprites/npc/marija_night/ (32x32, same size and feet as npc_marija, facing
right). Long nightgown, slippers, her grey hair loose or in a net, glasses, a flashlight held
forward in her right hand (the beam itself is drawn by the engine; draw only the lit lens).
- npc_marija_night_walk 6 (slow shuffle, the flashlight swaying a little)
- npc_marija_night_search 4 (stops, sweeps the flashlight up and down, squints)
- npc_marija_night_pickup 4 (bends down slowly, picks up a toy, drops it in a sack on her back)
- npc_marija_night_spot 4 ("Aha!": she straightens up, eyebrows up, points the flashlight)
- npc_marija_night_yawn 4 (yawns, for the ending)
- Portraits (ui/portraits/, 64x64): portrait_marija_night_grumpy, _suspicious, _sleepy, _proud
  (nightgown, hair net, flashlight under her chin for _suspicious).

2. MARIJA AS A PLAYABLE HERO (unlocked by winning Level 8): sprites/heroes/kids/marija/
hero_marija_<anim>.png (+ .json) on the SAME 32x32 hero rig and animation list as Rubi, Baba Vera
and Misha (idle 4, run 8, jump 2, fall 2, land 2, attack 6, hurt 2, death 6, respawn 6; facing
right), in her day clothes (as in Level 5), a little shorter than Baba Vera. She is 84: her run
is a quick determined shuffle, her jump a small hop with a hand on her back.
Her attack: she throws a toy. sprites/heroes/toy/: fx_toy_projectile (16x16, 8f: 2 frames each of
4 different tumbling toys, e.g. a teddy, a car, a Lego brick, a ball), fx_toy_impact (32x32, 4f:
a soft "bonk" with little stars), icon_element_toy (the HUD badge icon, same size as the other
icon_element_* files).

3. FX: sprites/fx/night/
- fx_toy_sack (32x32, 6f: a toy disappears into Marija's sack with a little puff)
- fx_hide_sparkle (32x32, 4f: tiny "shh" sparkle when a kid ducks into a hiding place)
- fx_spotted (32x32, 4f: a "!" popping above a kid's head when Marija's light finds them)

4. NIGHT BACKGROUNDS: backgrounds/house_night/ (640x360, parallax like Level 5, low detail)
bg_house_night_sky (night sky with stars and a big moon, seen through windows), bg_house_night_far,
bg_house_night_mid, bg_house_night_near (the Level 5 room layers at night: dark blues and
purples, moonlight squares on the walls), fg_house_night_moonbeams (transparent foreground of
moonbeams and slow dust, parallax 1.2).

5. HIDING SPOTS: tilesets/house_night/tileset_house_night.png + .tsj + .tsx (32x32, same property
names; add a property hide = true): extra tiles only, used on top of tileset_house:
- a long tablecloth hanging over the table (2x2, hide, foreground, fades when behind)
- a heavy curtain (1x3, hide, foreground, fades when behind)
- a big armchair with a blanket over it (2x2, hide; top one-way)
- a laundry basket (1x1, hide)
- a pile of cushions (2x1, hide)
- a coat rack with coats (1x3, hide, foreground)

6. CUTSCENE (cutscenes/night/, 640x360 layers bg/chars/fx, like the garden cutscene)
- night_01_inside: the cousins come in from the garden with the toys in their arms and drop them
  on the living-room floor; the evening light is orange through the window.
- night_02_moon: the house from outside at night: the moon rises, the lights go out one by one.
- night_03_marija: Marija in her nightgown with a flashlight at the top of the stairs, looking at
  the toys on the floor, grumbling ("They didn't pick up their toys AGAIN!").
- night_04_done: after the level: morning light; Marija asleep in her armchair with her sack,
  smiling; the cousins tiptoe past with all the toys in the toy box.
+ night.json and README with suggested motion.

7. UI: ui/ui_flashlight_icon (16x16, for "Marija's sack" on the HUD), ui/ui_hidden_icon (16x16,
a closed eye, shown while the kid is hidden).

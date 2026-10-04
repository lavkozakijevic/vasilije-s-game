Elemental Heroes · The Rescue of Baba Vera: Level 5 "The Big Tidy-Up" + two unlockable heroes (phase 7)

PHOTOS: the family will give you photos of the real living room and kitchen in this conversation.
Use them as reference for the house tileset, backgrounds and cutscene rooms (layout, furniture,
colours), translated into our pixel style and palette. Do NOT include the photos themselves or
any photo-like image in the export.

Story context: after the ending (Baba Vera is home, New Year's Eve), a new chapter: spring has
come to Ivanovo. Morning in Baba Vera's house. The cousins' toys are everywhere. Their aunt RUBY
calls them: grandma MARIJA is about to wake up, and if she finds the toys lying around she'll
"take a shovel and throw them all in the trash". The kids have 60 seconds (+3 per toy picked up)
to find and pick up ~25 toys hidden all over the living room and kitchen: on the chandelier, on
top of the TV, under the bed, inside the cupboard, on shelves. No enemies. If they make it,
Marija praises them and Ruby joins as a playable hero. If time runs out, Marija shuffles in,
grumbles and jokes, and they try again.

Two new playable heroes use the SAME 32x32 hero rig and animation list as the four kids
(idle 4, run 8, jump 2, fall 2, land 2, attack 6, hurt 2, death 6, respawn 6; facing right):
- RUBY (unlocked by finishing Level 5): the kids' aunt, originally from Chile. Rectangular
  glasses, brownish-red hair, red clothes; a little shorter than Baba Vera. Kind, loves cooking
  and preparing presents. Her attack: she lobs a wrapped present in an arc; it lands and bursts.
- BABA VERA (secret unlock, the most powerful hero): exactly as she looks in the intro/ending
  (grey bun, glasses, red scarf), now playable. Her attack: a golden ray.

Follow the existing pack rules: 16-color elemental16 palette, 1-art-pixel ink outline, light
from top-left, Bayer dither only, no alpha fades, horizontal strips with equal frames, no padding,
facing right, 32px tiles, 640x360 view. README.md + <id>.json per folder, as before.

EXPORT RULES
- Export ONLY the new files listed here, in the same folder layout as before.
- Do NOT include maps (.tmj) or re-export any earlier files.

1. HEROES: sprites/heroes/kids/ruby/ and sprites/heroes/kids/vera/
- hero_ruby_<anim>.png and hero_vera_<anim>.png for all the rig animations above (+ .json).
- Ruby fx (sprites/heroes/present/): fx_present_projectile (16x16, 4f: a red-and-gold wrapped
  gift tumbling), fx_present_explosion (48x48, 6f: the gift bursts into ribbons, confetti and a
  soft pop, no fire), icon_element_present (the HUD badge icon, same size as the other
  icon_element_* files).
- Vera fx (sprites/heroes/gold/): fx_gold_projectile (32x16, 4f: a short beam of warm golden
  light), fx_gold_impact (32x32, 4f), icon_element_gold (HUD badge icon).
- Portraits (ui/portraits/, 64x64): portrait_ruby_neutral, _happy, _worried, _ali_vera;
  portrait_baba_vera_* already exist.

2. MARIJA (grandma, 84): ui/portraits/portrait_marija_neutral, _grumpy, _laughing, _proud
(64x64). Grey hair, slow, grumbles but always ends with a smile and a joke. NPC sprite
sprites/npc/marija/ (32x32): idle 4, walk 6 (very slow shuffle, maybe with a slipper),
wag_finger 4, laugh 4. No shovel needed.

3. SPRING CUTSCENE: cutscenes/spring/ (640x360 layers bg/chars/fx, like the intro and ending)
- spring_01_sunrise: the sun rises over Ivanovo in spring: snow gone, blossoms on the trees,
  birds, the house from outside.
- spring_02_living_room: morning sun through the windows; the four cousins waking up on the
  sofa and floor; toys scattered everywhere.
- spring_03_ruby: Ruby in the doorway, hands on hips, calling the kids (an apron, maybe a
  wooden spoon).
+ spring.json and README with suggested motion, like ending.json.

4. HOUSE TILESET: tilesets/house/tileset_house.png + .tsj + .tsx (32x32, same property names:
solid, oneway, crumble, bounce, hazard, hidden_room, foreground, fade_when_behind)
Built from the photos:
- floors: wooden floor / carpet (3x3 set style top + fill), skirting boards, a staircase step
- walls and ceiling pieces (the level is indoors: a ceiling row across the top)
- one-way furniture tops to climb on: sofa back and cushions, armchair, coffee table, TV stand
  and the TV top, bookshelf shelves (l/m/r), kitchen counter, kitchen table, fridge top,
  window sill, the CHANDELIER (a one-way platform hanging from the ceiling)
- bounce: a sofa cushion and a bed mattress (idle + 4-frame squash)
- hidden rooms: UNDER THE BED (a low space with a bedspread facade that fades when the hero is
  under it) and INSIDE THE CUPBOARD (cupboard doors facade that fades, shelves inside)
- foreground: curtains and a hanging plant (fade when behind)
- decor (non-solid): pictures on the wall, a clock, plants, a rug, a lamp, cups, a fruit bowl,
  a cat bed, family photos, a calendar showing spring
- (no hazards needed)

5. BACKGROUNDS: backgrounds/house/ (640x360, parallax like before)
bg_house_sky (the spring garden seen through windows: blue sky, blossoms), bg_house_far (the
back wall with windows and door frames), bg_house_mid (shelves and furniture silhouettes),
bg_house_near (closer furniture shadows), fg_house_sunbeams (transparent foreground of sunbeams
and floating dust motes, parallax 1.2).

6. TOYS: sprites/items/toys/ (16x16 each, 4-frame gentle bob/shine loop, one file per toy)
toy_football, toy_lego, toy_teddy, toy_car, toy_stick, toy_crayons, toy_markers, toy_pencils,
toy_chessboard, toy_cards, toy_uno, toy_plush_bunny, toy_plush_dino, toy_plush_cat,
toy_sword (wooden toy sword). Plus fx_toy_pickup (32x32, 6f: a sparkle and a little "poof").

7. UI: ui/
- ui_timer (96x32 frame with a small alarm-clock icon; digits are drawn by the engine)
- ui_toy_counter_icon (16x16, a toy box)
- ui_unlock_card (320x200 panel frame for "NEW HERO UNLOCKED", text drawn by the engine)
- ui_trophy_gold, ui_trophy_silver, ui_trophy_bronze (16x16) and ui_star_vera (16x16, the mark
  next to a cousin who has unlocked Vera) for the leaderboard
- ui_hero_lock (16x16 padlock) for heroes not unlocked yet

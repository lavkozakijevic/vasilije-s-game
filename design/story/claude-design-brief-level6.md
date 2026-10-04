Elemental Heroes · The Rescue of Baba Vera: Level 6 "Mishika in the Attic" (phase 8)

Story context: right after the Big Tidy-Up (Level 5), in the same house in Ivanovo, in spring.
Grandma Marija's blue cat MISHIKA (Serbian: Mišika) is lost somewhere up in the attic. Rubi sends
Dimitrije (Mita, 7, the most agile cousin) up to find her. Only Mita plays this level. He has 90
seconds to find Mishika, doing parkour across the attic; then he picks her up and carries her in
his arms, and the clock restarts at 90 seconds to bring her back down to the attic hatch. Rats
scurry around the attic and chase him. If time runs out, Rubi says "Too bad, try again!" and the
player restarts. When he brings Mishika back, Marija thanks him.

Follow the existing pack rules: 16-color elemental16 palette, 1-art-pixel ink outline, light
from top-left, Bayer dither only, no alpha fades, horizontal strips with equal frames, no padding,
facing right, 32px tiles, 640x360 view. README.md + <id>.json per folder, as before.

SCALE (important, learned from Level 5): the kids are ~20-26px tall. Draw the attic at THEIR
scale: beams, boxes, suitcases, the wardrobe, the window, the chair must look right next to a
32px kid. The level is built from tiles, so the backgrounds should be a calm, low-detail attic
wall and roof (sloped rafters, dark wood, a few dusty sunbeams), not big furniture or windows
that would look out of scale behind the tiles.

EXPORT RULES
- Export ONLY the new files listed here, in the same folder layout as before.
- Do NOT include maps (.tmj) or re-export earlier files.

1. TILESET: tilesets/attic/tileset_attic.png + .tsj + .tsx (32x32, same property names:
solid, oneway, crumble, bounce, hazard, hidden_room, foreground, fade_when_behind)
- old floorboards: 3x3 set style top + fill, inner corners, a plank edge for gaps between beams
- the sloped roof: rafter pieces for the ceiling (solid), left and right slope edges
- WOODEN BEAMS to run and jump along: horizontal beam l/m/r (one-way), a short beam end, a
  vertical post (solid), a crossbeam joint
- CREAKY FLOORBOARDS that break: 4 frames (intact, cracked, breaking, gone) like crumble planks
- stacks of cardboard BOXES (solid, 1x1 and 2x1, a few looks) and old SUITCASES (solid, 2x1),
  a tall WARDROBE (2x3, solid, top one-way) with a wardrobe-door facade for a hidden space
  inside (foreground, fades when the hero is inside)
- a ROCKING CHAIR (2x2; seat and back tops one-way)
- an old MATTRESS standing as a trampoline (bounce: idle + 4-frame squash)
- a DUSTY WINDOW in the roof (2x2, decor) with a sunbeam
- decor (non-solid): cobwebs, a dusty trunk, old paintings, a dress form, a box of Christmas
  decorations, a broken lamp, a rolled-up rug, a birdcage, a pile of old books, a sled
- the ATTIC HATCH (the start and the finish: a trapdoor in the floor with a ladder top, 2x1)

2. ROPES: sprites/props/attic/prop_rope.png: a SWINGING ROPE hanging from a beam (16x96, 8-frame
swing loop, the hero grabs the bottom 32px). And prop_hatch_glow (64x32, 4f loop): the hatch
glowing when Mita carries Mishika ("bring her here").

3. BACKGROUNDS: backgrounds/attic/ (640x360, parallax like before, low detail, at the kids'
scale) bg_attic_sky (deep dark rafters), bg_attic_far, bg_attic_mid, bg_attic_near,
fg_attic_dust (transparent foreground of floating dust in sunbeams, parallax 1.2).

4. MISHIKA, the blue cat: sprites/npc/mishika/ (32x32, a fluffy grey-blue cat, a little shy)
idle 4, sit 4 (tail swish), run 6, hide 4 (she squeezes behind a box: for when Mita first gets
close she runs to a new spot), found 4 (she meows and jumps toward Mita). Portraits (64x64):
ui/portraits/portrait_mishika_neutral, _happy.

5. MITA CARRYING MISHIKA: sprites/heroes/kids/dimitrije/ (same 32x32 rig and feet as his other
files): hero_dimitrije_carry_idle 4, _carry_run 8, _carry_jump 2, _carry_fall 2, _carry_land 2,
_carry_hurt 2 (Mishika held in both arms against his chest, her head peeking over his arm).

6. ENEMY: sprites/enemies/attic/rat/ (32x32, HP 1): a grey attic rat with a pink tail, mischievous
not scary. idle 4, run 6 (fast scurry), chase 6 (eyes fixed on Mita, whiskers back), hurt 2,
death 5 (it tumbles and scampers off-screen, nothing gory). A small variant
enemy_rat_small (24x16 frames, run 6) for packs of baby rats.

7. PORTRAITS for the dialogue: Rubi and Marija already exist. Add portrait_ruby_sad
("Too bad, try again!") and portrait_marija_happy (thanking Mita, hugging Mishika).

8. UI: ui/ui_cat_icon (16x16, Mishika's face, for the "find Mishika" goal in the corner) and
ui/ui_hatch_icon (16x16, the hatch, for "bring her back").

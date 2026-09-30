Elemental Heroes · The Rescue of Baba Vera: story & characters asset request (phase 3)

Context: the game is being made for four real cousins, who are now its heroes. Story summary:
on New Year's Eve, Mrak the Hollow King kidnaps their grandmother, Baba Vera, and drags her
across four lands (forest, frozen peaks, lava caves, his keep). Each cousin stars in one level
and meets an animal companion there. The 8 existing elemental heroes become the "Hearth Knights":
stone statues the children wake up along the way.

Follow the existing pack rules: 16-color elemental16 palette, 1-art-pixel ink outline, light
from top-left, Bayer dither only, no alpha fades. Name files [category]_[name]_[animation].png
as horizontal strips with equal frames, no padding, facing right. Add a README.md and <id>.json
per character folder, as for the heroes. Please DO NOT include assets/maps/forest_mock.tmj in
this export (the game's level map lives there).

1. THE FOUR COUSINS (sprites/heroes/kids/<name>/)
Same frame size and animation set as the existing heroes, so they plug straight in:
32x32 frames, feet at (16,31): idle 4, run 8, jump 2, fall 2, land 2, attack 6 (projectile
on frame 3), hurt 2, death 6, respawn 6. They are CHILDREN in their everyday clothes, not
armored. Their element shows as a glowing stone pendant, element-coloured trim and the element
effect on the attack. Show age through height (knights are ~24px tall):
- Konstantin (13): ~26px. Brown hair, sweatshirt and sweatpants. Element LIGHT (bone/gold
  accents, a faint halo glow on the attack, like Aurel). The eldest, confident pose.
- Katarina (11): ~24px. Golden hair, t-shirt and sweatpants, a small sketchbook tucked under
  her arm in idle. Element ICE (frost accents, like Rime). Curious, clever.
- Vasilije (9): ~22px. Dark golden hair, ORANGE t-shirt or hoodie (his favourite colour).
  Element FIRE (flame accents, like Cinder). Bold, eager, always leaning forward.
- Dimitrije (7): ~20px. Blond hair, t-shirt and shorts. Element AIR (leaf-green accents, like
  Wisp). Quick and sporty; a football at his feet in one idle frame would be perfect.
Reuse the existing element projectiles and impacts (fx_light/ice/fire/air_*), so no new
projectiles are needed.

2. ANIMAL COMPANIONS (sprites/companions/)
Each follows its child around the level. 32x32 frames unless noted: idle 4, run 6, jump 2,
special 4.
- companion_puppy: small fluffy puppy. Special = bark/sniff (finds secrets). ~16px tall.
- companion_cheetah (delivered): golden with black spots, frost-blue collar with an ice charm. Special = pounce.
- companion_fire_fox: an ORANGE fox with an ember-tipped tail. Special = dash and grab.
- companion_golden_eagle: 32x32, fly 4 instead of run, glide 2, special = dive. Plus a
  64x32 "carry" strip (4 frames) of the eagle lifting the children upward.

3. BABA VERA (sprites/npc/baba_vera/)
A warm, sturdy grandmother: grey hair in a bun, glasses, apron over a dress, a red knitted scarf.
32x32 frames: idle 4, walk 6, wag-finger 4 ("wash your hands!"), captive 4 (bound in shadowy
chains, still defiant), hug 4, cheer 4.

4. MRAK, THE HOLLOW KING (sprites/bosses/keep/mrak/)
A tall shadow king with a crown of black thorns and cold pale eyes, wrapped in a ragged
dark cloak; grey and void-purple, never warm colours.
- 128x128 boss frames: idle 4, telegraph 4, shadow_attack 6, summon 6 (phase 2, glows with the
  wardens' colours), hurt 2, phase_change 6, defeat 8 (shrinks and fades).
- fx_mrak_shadow_wave (64x32, 6f), fx_mrak_orb (16x16, 4f).
- mrak_small: 32x32 idle 4 and shiver 4 (the lonely little shadow in the ending, wearing
  Baba's red scarf).

5. DIALOGUE PORTRAITS (ui/portraits/)
64x64, 1 frame each, with a slight head-and-shoulders view. Kids: neutral, happy, and "Ali Vera!"
(the complaining face: eyes rolled, arms up). Dimitrije also needs "okej" (small calm nod).
Baba Vera: warm, stern (finger up), worried. Mrak: menacing, surprised, sad.
Knights: one neutral portrait each (8).
Plus ui_dialogue_box (a nine-slice frame on the same slate/plum panel style) and a name tag.

6. INTRO CUTSCENE PANELS (cutscenes/intro/)
640x360 each, exported as SEPARATE LAYERS so they can be animated with pans and slides:
background, characters, and effects (snow, lightning, glow). Nine scenes:
 01 night village in snow, one warm glowing house at the forest edge
 02 kitchen: Baba pulling cookies from the oven, four kids crowding in
 03 living room: toys, football, phone on a tripod, poster "The Rise of the Karate Badass"
 04 window: storm clouds, huge thorn-crowned shadow with two cold eyes
 05 blackout (mostly black, lightning flash layer)
 06 empty chair, apron, plate of cookies, open door, snow, red yarn trail into the forest
 07 kitchen table: wooden box open, four glowing stones (gold, frost-blue, orange, green), note
 08 the four kids facing each other (arguing / determined)
 09 kids running into the snowy forest following the yarn + title card art
Plus ui_note_paper (a 320x200 handwritten-note background) and ui_skip_button (80x20,
normal and hover).

7. BETWEEN-LEVEL SCENES AND ITEMS
- ui_world_map: 640x360 with the four lands (forest, frozen peaks, lava caves, the Hollow Keep
  on a cliff) connected by a dotted red-yarn path; plus a 16x16 marker for Baba.
- item_yarn_ball (16x16, 6f) and a yarn trail decal set (16x16: straight, curve, knot).
- Baba's items found at each level's end (32x32 each): knitting needles, red scarf, family photo.
- statue_knight: stone versions of the 8 knights (32x32, 1f each) + fx_statue_awaken (32x32, 6f).

8. ENDING PANELS (cutscenes/ending/)
Same layer rules as the intro:
 01 Baba wrapping her scarf around tiny Mrak in the empty hall
 02 crowded warm kitchen: four kids, Baba, the four animals, Mrak with a cookie
 03 midnight fireworks over the snowy yard, the kids playing football, Mrak badly in goal
 04 credits card: "Directed by Konstantin, Katarina, Vasilije and Dimitrije"

9. EASTER EGGS
- prop_poster_karate_badass (32x48): the kids' film poster
- prop_football (16x16, 4-frame roll)
- ui_sketchbook: a 320x240 open-book background for Katarina's creature encyclopedia

Later phases (separate briefs): full biome packs for Frostfang Peaks, Cinderdeep Caves and
the Hollow Keep (tileset, backgrounds, 3 enemies, warden boss each).

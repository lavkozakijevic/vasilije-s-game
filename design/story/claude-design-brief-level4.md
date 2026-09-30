Elemental Heroes · The Rescue of Baba Vera: Level 4 "The Hollow Keep" asset request (phase 6, the final level)

Story context: Konstantin/Kosta (13, light: Aurel's powers, the halo) is the star of the final
level. Mrak, the Hollow King, holds Baba Vera in his grey castle on top of a sheer cliff. A golden
eagle lands in front of Kosta and carries the cousins up (the eagle is already delivered, with
its carry frames). Inside, the Hearth Knights Aurel (light) and Umbra (shadow) wake (statues
already delivered); Umbra served Mrak and switches sides. Kosta's LIGHT is the key power here: it
burns away shadow. The level ends with the three-phase Mrak fight (Mrak, his orb/wave fx, the
tiny scarf-wrapped Mrak and the whole ending cutscene are already delivered). Kosta learns to
share the lead: in phase 3 he and Vasilije lead together, all four cousins at once.

Follow the existing pack rules: 16-color elemental16 palette, 1-art-pixel ink outline, light
from top-left, Bayer dither only, no alpha fades, horizontal strips with equal frames, no padding,
facing right, 32px tiles, 640x360 view. README.md + <id>.json per character folder, as before.
Mrak's keep is grey and cold: mostly ink, plum, slate, stone, void and frost, with warm gold only
where Kosta's light, Baba's yarn and the hearth appear.

EXPORT RULES
- Export ONLY the new files listed here plus the fixes in section 8, in the same folder layout.
- Do NOT include any map (.tmj) and do not re-export earlier biomes, heroes, Mrak, UI or cutscene
  files unless a fix below asks for it.

1. TILESET: tilesets/keep/tileset_keep.png + .tsj + .tsx (32x32, no margin, no spacing)
Same structure and property names as the earlier tilesets (solid, oneway, crumble, bounce,
hazard, water, hidden_room, foreground, fade_when_behind):
- grey castle stone: 3x3 set, 4 inner corners, 45° up/down slopes, single block, pillar,
  2 fill variants (cracked, with a faded old banner of the Hearth)
- one-way stone ledges (l, m, r) and wooden scaffolding (l, m, r)
- crumbling stone (4 frames: intact, cracked, breaking, gone)
- SHADOW BRIDGE (new, important): a bridge of solid darkness that only exists while Kosta's light
  shines on it: 4 frames (faint outline, appearing, solid, fading). Property shadow_bridge: true.
- HIDDEN LEDGE (new): a ledge that is invisible until the golden eagle marks it: 2 states
  (hidden = transparent except a faint sparkle, revealed = a stone ledge with a gold rim).
  Property hidden_ledge: true.
- a void pit / abyss surface (4-frame animated, hazard, like the lava surface)
- hazards: floor spikes of black iron, a wall torch that burns cold blue (decor), a swinging
  pendulum blade is NOT needed; instead: shadow tendrils growing from the floor (hazard, 4-frame)
- a bounce tile: a spring-loaded stone plate (idle + 4-frame press)
- a hidden room: an old library (ends, interior, interior with a warm glowing fireplace, a stone
  facade that fades when the hero is behind it)
- foreground: hanging chains and torn grey banners (top, fringe, fill) for a hidden high route
- decor (non-solid): empty chairs, a long empty dining table, cold candles, suits of armour,
  cobwebs, a portrait of Mrak looking lonely, a red yarn strand caught on a door handle

2. BACKGROUNDS: backgrounds/keep/ (640x360 each, parallax like the forest set)
bg_keep_sky (night, a pale moon, clouds, snow far below), bg_keep_far (the keep's towers),
bg_keep_mid (inner walls, tall arched windows), bg_keep_near (pillars, stairs),
bg_keep_arena_near (Mrak's throne hall: an empty throne, cold braziers, a huge cold hearth),
fg_keep_dust (transparent foreground layer of drifting grey dust, parallax 1.2).
Plus one 640x360 image for the cliff: bg_keep_cliff (the sheer cliff face with the keep at the
top), used behind the eagle ride at the start.

3. ENEMIES: sprites/enemies/keep/<name>/ (32x32 frames unless noted, HP noted)
- Shadow Shade (HP 2): a floating wisp of darkness with frost-white eyes. It fades out when hit
  by anything except LIGHT (only light really hurts it). fly 4, fade_out 4, fade_in 4, attack 5
  (reaches with a claw), hurt 2, death 6 (burns away into gold sparks when light finishes it).
- Stone Gargoyle (HP 3): sits still as a statue until you come near, then swoops. perch 1,
  wake 4, fly 4, swoop 4, hurt 2, death 6 (crumbles).
- Hollow Knight (HP 4): an empty suit of armour walking on its own, with a shield. walk 6,
  shield_up 3, shield_hold 2, attack 5 (sword swing, hurts on frames 2-3), hurt 2, death 6 (the
  armour falls apart into a pile; a tiny puff of shadow escapes). Light breaks its shield.
- Falling chandelier (hazard): sprites/hazards/hazard_chandelier.png (32x32): hang 1,
  shake 3, fall 1, crash 4 (64x32).

4. UMBRA'S AMBUSH (the knight who switches sides): sprites/npc/umbra/
Umbra first appears under Mrak's spell: the shadow knight with dark purple glowing eyes and a
torn cloak, 32x32: idle 4, dash 4, attack 5, stunned 4 (the spell breaks: purple sparks leave
him), kneel 4 (he kneels and joins). Portrait: portrait_umbra_spellbound (64x64, the eyes
glowing purple), next to the existing portrait_knight_shadow_neutral.

5. MRAK EXTRAS: sprites/bosses/keep/mrak/ (additions only, same 128x128 rig)
- phase 2 "the wardens' power": boss_mrak_warden_roots (6f, he slams roots out of the floor like
  the Blightwarden), boss_mrak_warden_frost (6f, ice spikes like the Frost Warden),
  boss_mrak_warden_magma (6f, a lava wave like the Magma Colossus). The existing fx for those
  bosses will be reused.
- phase 3 "together": boss_mrak_laugh (4f, he laughs while the cousins argue), boss_mrak_stagger
  (4f, the four stones' light hits him), fx_four_stones_beam (64x32, 6f: gold, orange, frost-blue
  and green light braided together).
- portraits: portrait_mrak_laughing (64x64).

6. PROPS: sprites/props/keep/
Checkpoint shrine in a castle version (32x64: idle 1, activate 6, lit 4), the final exit door
(64x96, a heavy door that opens onto warm light; 4-frame loop when open; closed 1), a cage for
Baba Vera in the throne hall (64x96: locked 1, opening 6, open 1), and a gem for this biome:
sprites/items/item_gem_keep.png (16x16, 6-frame spin).

7. THE EAGLE RIDE: sprites/fx/fx_eagle_mark.png (16x16, 6f): the gold sparkle the eagle drops on
a hidden ledge. The carry frames already exist; nothing else is needed for the ride.

8. FIXES TO EARLIER ASSETS
8.1 Cave tileset, lava crust (tileset_caves.png ids 34-37): the frozen crust is only a thin dark
    strip across the top of the lava, so the kids can't tell it is safe to stand on. Please make
    the solid frames (35 solid, 36 cracking) cover the whole top half of the tile with a clear
    grey-blue crust of cooled rock and frost, so it reads as a floor. Re-export tileset_caves.png only.

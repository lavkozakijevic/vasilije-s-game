Elemental Heroes · The Rescue of Baba Vera: Level 3 "Cinderdeep Caves" asset request (phase 5)

IMPORTANT CHANGE FIRST: the cousins' stones are swapped. Katarina now has FIRE (Cinder's powers)
and Vasilije now has ICE (Rime's powers). Their clothes stay the same (Vasilije still wears orange,
he loves orange). See fixes 9.2 and 9.3.

Story context: Vasilije (9, ice) is the star of this level. Mrak's wardens dragged Baba Vera down
into hot caves full of lava. Vasilije charges ahead alone ("Captain Vasilije, going in!"); a gate
slams behind him and the lava starts rising. His fire fox runs back and fetches the others, and he
learns he needs the team. His ICE is the key power here: it cools lava into a crust you can stand
on and cracks the rock armour of cave monsters. The Hearth Knights Cinder (fire) and Jolt
(lightning) wake here (statues already delivered). The fire fox is already delivered. The level
ends at the Magma Colossus; Baba's family photo is found at the end (item already delivered).

Follow the existing pack rules: 16-color elemental16 palette, 1-art-pixel ink outline, light
from top-left, Bayer dither only, no alpha fades, horizontal strips with equal frames, no padding,
facing right, 32px tiles, 640x360 view. README.md + <id>.json per character folder, as before.

EXPORT RULES
- Export ONLY the new files listed here plus the fixes in section 9, in the same folder layout.
- Do NOT include any map (.tmj) and do not re-export forest/peaks, other hero, UI or cutscene
  files unless a fix below asks for it.

1. TILESET: tilesets/caves/tileset_caves.png + .tsj + .tsx (32x32, no margin, no spacing)
Same structure and property names as tileset_forest / tileset_peaks (solid, oneway, crumble,
bounce, hazard, water, hidden_room, foreground, fade_when_behind):
- dark basalt ground: 3x3 set, 4 inner corners, 45° up/down slopes, single block, pillar,
  2 fill variants (with glowing orange veins, with a fossil)
- one-way rock ledges (l, m, r) and an old wooden mine walkway (l, m, r)
- crumbling rock (4 frames: intact, cracked, breaking, gone)
- LAVA: lava body (hazard) + 4-frame animated lava surface (hazard, like the forest water)
- LAVA CRUST (new, important): the lava surface frozen by Vasilije's ice into a dark crust you
  can stand on: 4 frames (freezing, solid, cracking, melting back). Property crust: true.
- a lava fall (2 tiles tall, 4-frame loop, hazard) for the background walls
- a steam vent bounce tile (idle + 4-frame puff, like the bounce mushroom / snow drift)
- hazards: floor spikes of obsidian, hanging stalactites (ceiling decor)
- a hidden room: a crystal grotto (ends, interior, interior with glowing crystals, a rock facade
  that fades when the hero is behind it)
- foreground: hanging roots and stalactite fringe (top, fringe, fill) for a hidden high route
- decor (non-solid): glowing mushrooms, crystal clusters, a mine cart, a pickaxe, bones, a lantern,
  a warning sign, a red yarn strand caught on a rock

2. BACKGROUNDS: backgrounds/caves/ (640x360 each, parallax like the forest set)
bg_caves_sky (deep cave darkness with a faint orange glow from below), bg_caves_far (huge
cavern walls with lava falls), bg_caves_mid (rock columns, crystals), bg_caves_near (rocks and
stalagmites), bg_caves_arena_near (the Magma Colossus's hall: a lava lake, broken pillars),
fg_caves_embers (transparent foreground layer of drifting embers, parallax 1.2).
Plus: rising_lava.png, a 640x32 animated lava top edge (4 frames) and a 640x32 lava body tile,
for the "lava rises" chase.

3. ENEMIES: sprites/enemies/caves/<name>/ (32x32 frames unless noted, HP noted)
- Magma Slime (HP 2): a hopping blob of lava. idle 4, hop 6, hurt 2, death 5 (splashes).
  When hit by ice it freezes for a moment: frozen 1 (a grey crust version).
- Ember Bat (HP 1): hangs from the ceiling, then swoops. hang 2, fly 4, swoop 4, hurt 2, death 5.
- Cinder Golem (HP 3): a squat walking rock with a lava core and a hard rock shell. Fire does
  not hurt it through the shell; ICE and water crack the shell. walk 6, shell_up 3 (it curls
  up when shot), shell_hold 2, shell_crack 4, hurt 2, death 6 (crumbles). This mirrors the
  Frostling: Vasilije's ice is the answer here, like Katarina's fire was in the Peaks.
- Lava Bubble (hazard): sprites/hazards/hazard_lava_bubble.png (16x16): a blob that jumps out
  of the lava and falls back in. rise 2, fall 2, splash 4 (32x16).
- Falling rock (hazard): sprites/hazards/hazard_falling_rock.png (16x16): shake 3, fall 1,
  shatter 4 (32x16).

4. MID-BOSS (64x64): the Lava Salamander
A big, lazy salamander that lives in the lava and is grumpy about visitors (not truly evil).
idle 4, walk 6, dive 5 (sinks into lava), surface 5 (rises out), spit 5 (a fireball, release on
frame 3), hurt 2, defeat 6 (it cools off, yawns and curls up to sleep). fx_salamander_fireball
(16x16, 4f). Portraits: portrait_salamander_neutral, portrait_salamander_sleepy.

5. BOSS: sprites/bosses/caves/magma_colossus/ (96x96 frames, 24 HP)
A towering giant of cracked black rock with glowing lava in the cracks and molten eyes. In its
chest is a glowing magma core: the weak point, which glows brighter when exposed.
idle 4, telegraph 4 (~1s, the core glows), attack_slam 6 (fists hit the ground: a lava wave
runs along the floor), attack_rain 6 (it roars; molten rocks fall from the ceiling), hurt 2,
death 8 (it cools down to a grey, harmless pile of rock; hold the last frame).
fx_lava_wave (64x32, 6f, travels along the ground), fx_falling_magma (16x32, 4f),
fx_warning_heat (32x32, 4f, glow on the ground before something lands).
JSON with hitbox, the core weak point, origin and the attack pattern, like the Frost Warden.
Portrait: portrait_magma_colossus_neutral.

6. THE TRAP: sprites/props/caves/
- prop_cave_gate (32x96): a heavy iron-and-rock gate that slams shut: open 1, closing 4,
  closed 1, opening 6.
- the rising lava from section 2.

7. PROPS: sprites/props/caves/
Checkpoint shrine in a cave version (32x64: idle 1, activate 6, lit 4), the level exit (an arch
of cooled obsidian with a cool blue glow inside, 64x96, 4-frame loop; the inner opening is the
trigger), and a gem for this biome: sprites/items/item_gem_caves.png (16x16, 6-frame spin).

8. PORTRAITS: ui/portraits/ (64x64, as before)
portrait_magma_colossus_neutral, portrait_salamander_neutral, portrait_salamander_sleepy.

9. FIXES TO EARLIER ASSETS
9.1 Portraits: in portrait_vasilije_ali_vera.png Vasilije raises both fists next to his head.
    The kids don't like it. Please redraw it without the fists: arms down, an exasperated face
    and eyes rolled up is enough ("Ali Veraaa!"). Do the same for portrait_katarina_ali_vera.png
    and portrait_konstantin_ali_vera.png / portrait_dimitrije_ali_vera.png if they have raised fists.
9.2 Katarina's hair: in her portraits AND her game sprites (idle, run, jump, etc.) her long
    golden hair behind her head is drawn as a flat yellow block, so it reads as a yellow square.
    Please give it a shape: strands, shading, a softer silhouette that falls to her shoulders.
9.3 Element swap (see the top): re-export these with the new element colours, keeping clothes:
    - hero_katarina_attack / _respawn / _death: FIRE effects (orange/flame) instead of ice.
    - hero_vasilije_attack / _respawn / _death: ICE effects (frost/blue) instead of fire.
    - the stone pendants in all Katarina portraits: orange/flame; in all Vasilije portraits:
      frost-blue.
    - the intro cutscene, scene 7/8, if it shows which stone goes to which child: Katarina gets
      the orange one, Vasilije the frost-blue one (re-export only the changed layers).

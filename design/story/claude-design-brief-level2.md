Elemental Heroes · The Rescue of Baba Vera: Level 2 "The Frostfang Peaks" asset request (phase 4)

Story context: Katarina (11, ice) is the star of this level. Mrak's shadow-birds carried Baba Vera
over the mountains; the cousins climb snowy peaks after her red yarn. Katarina meets her cheetah
(already delivered: lost and shivering, she puts her warm socks on its paws). The Hearth Knights
Rime (ice) and Brine (water) wake here from their statues (statues already delivered). The level
ends at the Frost Warden, a giant of glacier ice; Katarina spots the crack in its chest from her
sketchbook drawings. Baba's red scarf is found at the end (item already delivered).

Follow the existing pack rules: 16-color elemental16 palette, 1-art-pixel ink outline, light
from top-left, Bayer dither only, no alpha fades, horizontal strips with equal frames, no padding,
facing right, 32px tiles, 640x360 view. README.md + <id>.json per character folder, as before.

EXPORT RULES (important: the game repo has moved on from the samples)
- Export ONLY the new files listed here, in the same folder layout as before.
- Do NOT include assets/maps/forest_mock.tmj or any other map, and do not re-export forest,
  hero, kid, UI, portrait or cutscene files unless a fix below asks for it.

1. TILESET: tilesets/peaks/tileset_peaks.png + .tsj + .tsx (32x32, no margin, no spacing)
Same structure and property names as tileset_forest so the engine can reuse its rules
(solid, oneway, crumble, bounce, hazard, water, hidden_room, foreground, fade_when_behind):
- snowy rock ground: 3x3 set, 4 inner corners, 45° up/down slopes, single block, pillar,
  2 fill variants (with ice crystals, with a buried bone)
- packed-ice ground (property slippery: true; the hero slides a little)
- snow-covered one-way ledges (l, m, r) and a wooden rope bridge with snow on it
- crumbling ice planks (4 frames: intact, cracked, breaking, gone), like the forest crumble planks
- frozen pond: ice surface that is solid, plus open icy water (hazard, like forest water)
- hazards: ice spikes (floor), hanging icicles (ceiling, decor version)
- a snow-drift bounce tile (like the bounce mushroom: idle + 4-frame puff)
- an ice-cave hidden room: cave mouth ends, interior (background, one with glowing crystals),
  a snow facade tile (foreground, fades when the hero is behind it)
- foreground: snow-laden pine branches (top, fringe, fill) for a hidden high route
- decor (non-solid): small pines, rocks, snowman, frozen signpost, lantern, crystals, wolf
  tracks, a half-buried sled, a red yarn strand caught on a branch

2. BACKGROUNDS: backgrounds/peaks/ (640x360 each, parallax like the forest set)
bg_peaks_sky (night, aurora in frost/void/leaf bands, the bone moon), bg_peaks_far (jagged
white peaks), bg_peaks_mid (snowy pine slopes), bg_peaks_near (rocks and drifts),
bg_peaks_arena_near (the Frost Warden's glacier hall: ice pillars, frozen waterfall),
fg_peaks_snowfall (transparent foreground layer of falling snow, parallax 1.2).

3. ENEMIES: sprites/enemies/peaks/<name>/ (32x32 frames, HP noted)
- Ice Wolf (HP 2): patrols, then lunges when the hero is within ~96px.
  idle 4, run 6, lunge 4 (telegraph on frame 0: crouch and glowing eyes), hurt 2, death 5.
- Snow Sprite (HP 1): a small flying ice spirit that hovers and throws snowballs in an arc.
  fly 4, attack 5 (release on frame 3), hurt 2, death 5, plus fx_snowball (16x16, 4f) and
  fx_snowball_burst (16x16, 4f).
- Frostling (HP 3): a squat walking chunk of ice that raises a shield of ice when shot from
  the front; fire and light break the shield. walk 6, shield_up 3, shield_hold 2, hurt 2,
  death 6 (shatters).
- Falling icicle (hazard): sprites/hazards/hazard_icicle.png (16x32): hang 1, wobble 3
  (warning), fall 1, shatter 4 (32x16 on the ground).

4. MID-BOSS (optional, 64x64): Snow Yeti Cub
A grumpy young yeti guarding a bridge, not truly evil: idle 4, walk 6, stomp 5 (the ground
shakes, snow falls), throw 5 (a big snowball), hurt 2, defeat 6 (sits down and sulks, then
waves goodbye). fx_big_snowball (32x32, 4f).

5. BOSS: sprites/bosses/peaks/frost_warden/ (96x96 frames, 24 HP)
A towering giant made of glacier ice, blue-white with frost cracks, glowing frost eyes, and a
visible crack in the middle of its chest: the weak point, which glows gold when exposed.
idle 4, telegraph 4 (the chest crack glows; ~1s), attack_spikes 6 (slams: ice spikes erupt
in a line), attack_breath 6 (a freezing breath cone), hurt 2, death 8 (shatters into a pile
of ice and snow; hold the last frame).
fx_ice_spike (32x64, 6f, rises from the ground, frames 2-3 hurt), fx_frost_breath (96x32, 6f),
fx_warning_frost (32x32, 4f, on the ground before spikes).
JSON with hitbox, the chest weak point, origin and the attack pattern, like the Blightwarden.

6. PROPS: sprites/props/peaks/
Checkpoint shrine in a snowy version (same 32x64 frames: idle 1, activate 6, lit 4) and the
level exit: an arch of blue ice (64x96, 4-frame loop; the inner opening is the trigger).
A snowy prop version of the Karate Badass poster (32x48, pinned to a pine) and a snowball
the kids can kick around like the football (16x16, 4-frame roll).

7. ENEMY + BOSS PORTRAITS: ui/portraits/ (64x64, as before)
portrait_frost_warden_neutral, portrait_yeti_cub_neutral, portrait_yeti_cub_sad.

8. FIXES TO EARLIER ASSETS
- Vasilije's idle (sprites/heroes/kids/vasilije/hero_vasilije_idle.png): his arm is raised
  across his chest in every frame. Please redraw it with both arms down, like the other kids.
- Companion pairings in the companion READMEs/JSON: puppy → Dimitrije (not Konstantin),
  golden eagle → Konstantin, fire fox → Vasilije, cheetah → Katarina. Re-export only those
  README.md and .json files.

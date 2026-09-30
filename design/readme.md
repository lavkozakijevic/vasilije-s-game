# Elemental Heroes: design system & pixel asset pack

Elemental Heroes is a browser-based 2D side-scrolling platformer in pixel art. Heroes wield one element each (fire, water, earth, air, ice, lightning, shadow, light). Levels are built in the **Tiled** map editor. This project holds the art direction, the 16-color palette, the sprite and tile assets, UI tokens and components, and a playable forest level for style approval.

**Status: phase 1 (style approval).** Covered so far: the fire hero, one forest enemy, the forest tileset, forest parallax backgrounds, HUD icons and a mock gameplay screenshot. The other 7 heroes, the other forest enemies, the boss, the remaining items and the rest of the menus come after sign-off.

## Sources
- Written brief from the client (in chat), plus these form answers: 8 elements, "heroic adventure, slightly moody", Forest as the first biome, 32×32 tiles and character frames, a 16-color palette, a 640×360 view, 3 enemies per biome, extra hazards (fire jets, thorn vines).
- Style references: `assets/reference/ref_fire_dragon.png` and `ref_ice_knight.png`. Both are high-detail illustrations of armored, spiky creatures with dark outlines and glowing seams. Take mood, silhouette and material cues from them, not their resolution.
- No logo, codebase or Figma file was provided. Wherever a brand mark would go, the name is set in the display font. No logo has been drawn.

## How the art is made
Every PNG comes from `tools/*.gen.txt`, a palette-locked pixel generator. It draws parts in code, runs a 1px ink outline pass, and uses Bayer dithering for all gradients. To regenerate, concatenate `px_core`, `px_sprites`, `px_world` and `px_run` in that order and run the result with a canvas. Each pixel is authored in code; no AI image generation is involved. Hand-polish in Aseprite is expected before shipping. Use `assets/palette/elemental16.gpl` or `.hex`.

---

## CONTENT FUNDAMENTALS
- **Voice:** terse, heroic, a little ominous. It sounds like a sign on a forest road, not a mascot. Address the player as "you" only in instructions. Lore and signs use the third person or the imperative.
- **Casing:** UI labels and buttons are UPPERCASE in Silkscreen (`START`, `LEVEL SELECT`, `RESUME`). Titles are Title Case in the blackletter display face (`Level Complete`, `Paused`). Body text is sentence case.
- **Numbers:** counters are zero-padded with a multiplication sign (`×027`). World labels use a middle dot (`World 1 · The Forest`).
- **Examples:** "The flame goes out. For now." (game over) · "West: Old Pine Road. Beware roots." (sign) · "← → move · space jump · F fire · esc pause" (controls).
- **No emoji.** Arrows (← → ▶) are the only unicode glyphs used, as cursors and in control hints.

## VISUAL FOUNDATIONS
- **Palette:** 16 colors across the whole pack (`tokens/colors.css`). Neutrals: ink, plum, slate, stone, bone. Nature: pine, moss, leaf, bark, amber. Heat/cool: ember, flame, gold, tide, frost, void. Each element has a signature color: fire = flame, water = tide, earth = amber, air = leaf, ice = frost, lightning = gold, shadow = void, light = bone.
- **Mood:** dusk. The sky runs from plum through void purple to an ember horizon, under a bone moon. Backgrounds get darker toward the camera (slate mountains → pine treeline → plum trunks and an ink canopy). Gameplay tiles use the brightest greens and browns, so the play layer always reads first.
- **Light:** always top-left. Top and left edges take the lighter shade; bottom and right edges take plum. This applies to sprites, tiles and UI bevels alike.
- **Outlines:** every character, tile edge, prop and UI frame has a 1-art-pixel ink (#0d0b14) outline. Fire FX and water surfaces have none.
- **Gradients:** never smooth. Use ordered 4×4 Bayer dither between two palette colors, or hard bands.
- **Glow:** shown with color alone (gold core, flame ring, ember edge). There is no blur, no alpha fade and no bloom.
- **Grid:** 32px tiles, 32×32 character frames (heroes stand about 24px tall), 16×16 items and projectiles, and a 640×360 view scaled by an integer (2× = 1280×720, 3× = 1920×1080). In HTML, `--px` is one art pixel (3px at 3×), and all spacing is a multiple of it.
- **Type:** Jacquard 24 (blackletter pixel) for titles, Silkscreen for UI caps and numbers, Pixelify Sans for body text. All three are Google Fonts, self-hosted in `fonts/`.
- **Corners:** radius 0 everywhere. Frames get "rounded" corners by stepping the outline (box-shadow on 4 sides leaves the corner pixel empty).
- **Cards/panels:** slate fill, 1px stone bevel on the top-left, plum bevel on the bottom-right, ink outline, a solid 2-art-pixel ink drop shadow to the bottom-right, and a recessed plum well for content.
- **Buttons:** flame fill with a gold bevel. Hover swaps to gold with ink text. Press inverts the bevel and shifts the button down 1 art pixel. Disabled is plum with stone text. In lists, the ghost variant shows a ▶ gold cursor on hover or selection.
- **Transparency:** only for the full-screen ink dim behind pause and result panels. Sprites are fully opaque or fully transparent.
- **Animation:** frame-stepped at 8–12 fps for characters and 6 fps for idle loops. There is no easing and no tweening in the UI; states swap instantly or in 2 steps. Hurt = one bone-white flash frame, then invulnerability flicker. The hero's death dissolves into embers; Rotroot's death splinters into chips.
- **Imagery:** there are no photos. Everything is palette pixel art rendered with nearest-neighbour scaling (`image-rendering: pixelated`).

## ICONOGRAPHY
- Icons are PNG pixel art from the same 16 colors, drawn on a 16×16 grid with an ink outline: `assets/ui/icon_element_fire.png`, `ui_heart_states.png` (full/half/empty), `assets/sprites/items/item_coin_spin.png`.
- There is no icon font and no SVG icon set, and emoji are never used. The only unicode used as icons are ▶ (menu cursor) and ← → (control hints).
- Planned for later phases: element icons for water, earth, air, ice, lightning, shadow and light, plus pause, settings, lock, key and star icons.

## Tiled usage
- `assets/tilesets/forest/tileset_forest.png` is 256×224 with 8 columns and 56 tiles. It has no margin and no spacing.
- `tileset_forest.tsj` is the Tiled JSON tileset. Each tile carries custom properties (`name`, `solid`, `oneway`, `moving`, `breakable`, `hazard`, `water`, `slope`, `slope_dir`, `decor`), and the water surface (ids 32–35) and fire jet (36–39) are set up as tile animations.
- `assets/maps/forest_mock.tmj` is a sample 20×12 map. It has 4 parallax image layers (sky 0, far .2, mid .45, near .7), the tile layers `decor_back`, `ground` and `decor`, and an `entities` object layer.
- Tile IDs 0–18 are ground: a 3×3 set, 4 inner corners, a 45° up slope and down slope, a single block, a pillar, and 2 fill variants. 19–21 are one-way planks, 22–23 the moving platform, 24–25 breakable blocks (intact and cracked), 26 spikes, 27–29 thorn vines, 30 the fire jet vent, 31–35 water, 36–39 fire jet flames, and 40–55 decor.
- The ground set is a 3×3 plus inner corners, not a full 47-tile blob. That is enough for rectangular landmasses and single-tile steps. A full Wang/blob set is a phase-2 item.

## Naming
`[category]_[name]_[animation].png`, e.g. `hero_fire_run.png`, `enemy_rotroot_attack.png`, `fx_fire_impact.png`, `item_coin_spin.png`, `bg_forest_near.png`, `tileset_forest.png`. All strips are horizontal with equal frame sizes and no padding. Sprites face right.

## Index
- `styles.css` imports everything under `tokens/` (`fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`).
- `fonts/`: self-hosted woff2 files (Jacquard 24, Silkscreen, Pixelify Sans).
- `assets/sprites/heroes/fire/`: Cinder, the fire hero. Idle 4, run 8, jump 2, fall 2, land 2, attack 6, hurt 2, death 6.
- `assets/sprites/fx/`: `fx_fire_projectile` (16×16, 4-frame loop) and `fx_fire_impact` (32×32, 4 frames).
- `assets/sprites/enemies/forest/`: Rotroot. Idle 4, move 6, attack 4, hurt 2, death 5.
- `assets/sprites/items/`, `assets/ui/`: coin, hearts, fire icon.
- `assets/tilesets/forest/`, `assets/backgrounds/forest/`, `assets/maps/`, `assets/mockups/mock_forest.png`, `assets/palette/`, `assets/reference/`.
- `guidelines/`: foundation cards and labeled contact sheets for each asset category.
- `components/hud/`, `components/menu/`: React components.
- `ui_kits/game/`: a playable forest level with title, pause and result screens.
- `tools/`: the pixel generator source. `SKILL.md`: agent skill entry.

## Components
- **Sprite**: plays a horizontal strip at an integer scale.
- **HeartMeter**: health hearts (full/half/empty).
- **CoinCounter**: spinning coin plus a zero-padded count.
- **ElementBadge**: current-element slot ringed in that element's color.
- **PixelButton**: primary, secondary and ghost variants; sm/md/lg sizes; hover, pressed, disabled and selected states.
- **PixelPanel**: beveled frame in stone, dark or parchment tones, with an optional title.

Intentional additions: these components come from the brief's UI list (HUD, buttons, panels). No existing component library was provided.

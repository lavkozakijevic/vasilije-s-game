# Attic tileset (Level 6, Mishika in the Attic)

Drawn at the kids' scale (Mita is about 20px tall): a box is one tile, a suitcase two, the wardrobe 2×3.

`tileset_attic.png` (256×352, 8 columns, 32×32, no margin/spacing), `tileset_attic.tsj`, `tileset_attic_tsx.zip` (the Tiled XML `tileset_attic.tsx`, zipped as with the other tilesets; unzip next to the png). Same property names as before: solid, oneway, crumble, bounce, hazard, hidden_room, foreground, fade_when_behind, plus decor, slope and hatch.

| ids | tiles |
|---|---|
| 0-15 | old floorboards: 3×3 set, inner corners, single, plank_edge_l/r (ragged board ends for gaps between joists) |
| 16-19 | ceiling (solid): rafter, plain roof boards, roof_slope_l/r (upper triangle is solid; `slope` = ceiling_left/right) |
| 20-25 | wooden beams: beam_l/m/r and beam_end (one-way), post (solid), beam_joint (one-way top, braces underneath) |
| 26-29 | CREAKY FLOORBOARDS: intact, cracked, breaking, gone (crumble; `crumble_frame` 0-3) |
| 30-40 | cardboard boxes 1×1 (a taped, b open flaps, c "this way up") and 2×1 (wide_a, wide_b), suitcases 2×1 (red with straps, blue with stickers); all solid |
| 41-53 | WARDROBE 2×3: top_l/r (one-way), mid and base (solid). HIDDEN SPACE: wardrobe_door_mid/base_l/r (the same wardrobe, door ajar; foreground, fades) over wardrobe_inside_rail/coats/floor (hidden_room) |
| 54-57 | rocking chair 2×2: tl = back top (one-way), tr decor, bl/br = seat (one-way) |
| 58-62 | old mattress trampoline: idle + 4-frame squash (bounce ×2.4) |
| 63-68 | dusty roof window 2×2 (decor) and a 2×1 sunbeam (foreground, no fade) to place below it |
| 69-82 | decor (no collision): cobweb corners l/r, hanging cobweb with a spider, landscape and portrait paintings, dress form, Christmas box, broken lamp, rolled rug, birdcage, book pile, sled, trunk 2×1 |
| 83-84 | ATTIC HATCH 2×1 (one-way, `hatch`): start and finish. Overlay `sprites/props/attic/prop_hatch_glow.png` while Mita carries Mishika |

Building the level: floors on solid rows, beams as one-way runs between posts, ceiling rows of rafter with roof_slope at the sides. The background layers are deliberately plain so the tiles carry the detail.

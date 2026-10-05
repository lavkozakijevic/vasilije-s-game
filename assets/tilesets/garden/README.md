# Garden tileset (Level 7, The Lawn)

Drawn at the kids' scale (about 20-26px tall). `tileset_garden.png` (256×352, 8 columns, 32×32, no margin/spacing), `tileset_garden.tsj`, `tileset_garden_tsx.zip` (the Tiled XML `tileset_garden.tsx`, zipped as with the other tilesets; unzip next to the png). Same property names as before: solid, oneway, crumble, bounce, hazard, hidden_room, foreground, fade_when_behind (plus decor and level_start).

| ids | tiles |
|---|---|
| 0-7, 8-11 | grass tops (solid): freshly-cut stripes (`grass_t`, `grass_t_b` = other stripe phase, alternate them), long grass (`grass_long_*`), single, inner corners, dirt_edge_l/r (ragged dirt end of a lawn ledge) |
| 7-17 | dirt fill: l/c/r and bottom row |
| 18-28 | BLOSSOM TREE 3×5: crown_t*/m* (foreground, fades when behind), branch_l/m/r (one-way, stand on the branch top at y≈2), trunk_top, trunk_base (decor, centre column) |
| 29-39 | WALNUT TREE 3×5, same layout (green crown) |
| 40-45 | garden bench, garden table, wheelbarrow: 2×1 each, one-way tops |
| 46-47 | stack of flower pots 1×2 (solid) |
| 48-50 | low brick wall l/m/r (solid) |
| 51-56 | garden shed 3×2: roof_l/m/r (one-way), wall_l, door, wall_r (decor) |
| 57-61 | trampoline: idle + 4-frame squash (bounce ×2.4) |
| 62-75 | decor: flowers a/b, tulips, watering can, hose, gnome, bird bath (1×2), fence, fence end, swing (2×2) |
| 76-81 | the back door of the house 2×3 (decor). The two bottom tiles carry `level_start`: spawn the cousins in front of them |

Trampoline: on bounce play trampoline_0..3 at 12fps once, then back to idle (ids 57 and 58-61).

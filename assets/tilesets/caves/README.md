# Cinderdeep Caves tileset

`tileset_caves.png` (256×320, 8 columns, 32×32, no margin/spacing), `tileset_caves.tsj`, and `tileset_caves_tsx.zip` (Tiled XML; unzip next to the png).

Property names match forest/peaks. New: `lava` (bool) on lava tiles, and `crust` (bool) + `crust_frame` / `crust_state` on the frozen lava crust.

| ids | tiles |
|---|---|
| 0-18 | basalt ground: 3×3 set, 4 inner corners, slopes, single, pillar, fill variants (13 glowing veins, 14 fossil) |
| 19-21 | one-way rock ledges l/m/r |
| 22-24 | old mine walkway l/m/r (oneway) |
| 25-28 | crumbling rock: intact, cracked, breaking, gone |
| 29 | lava body (hazard, lava) |
| 30-33 | lava surface, animated (hazard, lava) |
| 34-37 | LAVA CRUST: 34 freezing, 35 solid, 36 cracking, 37 melting back. Solid on 35-36. |
| 38-45 | lava fall, 2 tiles tall: 38-41 top frames, 42-45 bottom frames (hazard, animated) |
| 46 | obsidian floor spikes (hazard) |
| 47 | hanging stalactites (ceiling decor) |
| 48-52 | steam vent bounce: idle + 4-frame puff |
| 53-60 | crystal grotto: 53 end top, 54 top, 55 interior, 56 bottom, 57 end mid (mouth), 58 end bottom, 59 interior with glowing crystals, 60 rock facade (foreground, fades) |
| 61-65 | hanging roots and stalactite fringe (foreground, fade when behind): l, m, r, fringe, fill |
| 66-73 | decor: glowing mushrooms, crystal cluster, mine cart, pickaxe, bones, lantern, warning sign, red yarn on a rock |

## Lava crust
When Vasilije's ice projectile hits a lava surface tile, swap that tile (and one either side) to 34, then 35 after 150ms. Hold 35 for ~3s, play 36 for 0.8s (still solid, cracks glow), then 37 for 150ms, then back to the lava surface. Frozen tiles are solid on 35-36 only.

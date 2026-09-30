# Frostfang Peaks tileset

`tileset_peaks.png` (256×288, 8 columns, 32×32, no margin/spacing), `tileset_peaks.tsj` (Tiled JSON) and `tileset_peaks_tsx.zip` (the same tileset as Tiled XML; unzip next to the png).

Property names match tileset_forest. New property: `slippery` (bool) with `friction` 0.15 on packed ice (22-26) and the frozen pond surface (34).

| ids | tiles |
|---|---|
| 0-18 | snowy rock ground: 3×3 set, 4 inner corners, slopes, single, pillar, fill variants (13 crystals, 14 buried bone) |
| 19-21 | snow-covered one-way ledges l/m/r |
| 22-26 | packed ice (slippery): tl, t, tr, fill, single |
| 27-29 | snowy rope bridge l/m/r (oneway) |
| 30-33 | crumbling ice planks: intact, cracked, breaking, gone |
| 34 | frozen pond ice (solid, slippery) |
| 35-39 | icy water body + 4 animated surface frames (water + hazard) |
| 40 | ice spikes (hazard) |
| 41 | hanging icicles, ceiling decor |
| 42-46 | snow-drift bounce: idle + 4-frame puff |
| 47-54 | ice-cave hidden room: 47 end top, 48 top, 49 interior, 50 bottom, 51 end mid (mouth), 52 end bottom, 53 interior with glowing crystals, 54 snow facade (foreground, fades) |
| 55-59 | snow-laden pine branches (foreground, fade when behind): l, m, r, fringe, fill |
| 60-70 | decor: pine, rock, snowman, frozen signpost, lantern, crystals, wolf tracks, half-buried sled, red yarn on a branch, snow tuft, small pines |

Mirror the cave end tiles (47, 51, 52) for the right-hand side, as with the forest hollow log.

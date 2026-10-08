# House at night: hiding spots (Level 8)

Extra tiles only, placed on top of the Level 5 `tileset_house` (which is reused, not redrawn). Drawn in day colours like `tileset_house`: the engine darkens the room. `tileset_house_night.png` (256×96, 8 columns, 32×32, no margin/spacing), `tileset_house_night.tsj`, `tileset_house_night_tsx.zip` (the Tiled XML `tileset_house_night.tsx`, zipped as with the other tilesets; unzip next to the png). Same property names as before, plus **hide = true** on every tile here: while a kid overlaps one, Marija's beam does not find them.

| ids | tiles | properties |
|---|---|---|
| 0-3 | long tablecloth hanging over the table, 2×2 (tl, tr, bl, br) | hide, foreground, fade_when_behind |
| 4-6 | heavy red curtain, 1×3 (top, mid, bottom) | hide, foreground, fade_when_behind |
| 7-10 | big armchair with a knitted blanket over it, 2×2 | hide; top row one-way |
| 11 | laundry basket, 1×1 | hide |
| 12-13 | pile of cushions, 2×1 (l, r) | hide |
| 14-16 | coat rack with coats, 1×3 (top, mid, bottom) | hide, foreground |

When a kid enters a hide tile, play `sprites/fx/night/fx_hide_sparkle` and show `ui/ui_hidden_icon` on the HUD.

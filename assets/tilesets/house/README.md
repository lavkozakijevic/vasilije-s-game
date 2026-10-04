# House tileset (living room)

Built from the family's living room photos: pine plank floor, cream plaster walls with wooden skirting, the grey woven throw on the daybed with teal, yellow, green and red cushions, the red and teal armchairs, the turned-leg coffee table with the cork jar, the dark-wood sideboard with the TV, the light-wood chest of drawers with vases, the brass lamp on its tall stand, the green roller shutter and lace curtains, rattan chairs, the photo wall and the pink egg garland.

`tileset_house.png` (256×384, 8 columns, 32×32, no margin/spacing), `tileset_house.tsj`, `tileset_house_tsx.zip` (Tiled XML; unzip next to the png). Same property names as the other tilesets, plus `wall` (background wall pieces, no collision) and `furniture` (one-way furniture tops).

| ids | tiles |
|---|---|
| 0-18 | plank floor 3×3 set, inner corners, stair step, single, pillar, carpet tops (rug edge) |
| 19-23 | wall, wall with skirting, wall corner shadow, ceiling, ceiling edge with cornice (solid) |
| 24-35 | one-way furniture: daybed seat l/m/r, red + teal armchair (back top, seat), coffee table l/r, sideboard top l/m/r |
| 36-40 | INSIDE THE CUPBOARD: sideboard door facade l/m/r (foreground, fades), interior, interior shelf (one-way) |
| 41-59 | TV top l/r, chest of drawers top/body, wall shelf l/m/r, window sill l/m/r, window 2×2, CHANDELIER l/r (one-way platform) + chain, brass lamp, lamp stand (one-way top) |
| 60-69 | bounce: red sofa cushion (idle + 4 squash), daybed mattress (idle + 4 squash) |
| 70-72 | UNDER THE BED: the space under the daybed + the hanging throw facade (foreground, fades) and its tasselled end |
| 73-76 | foreground: lace curtain top/mid/bottom (see-through), hanging plant |
| 77-93 | decor: egg_garland, family_photos, certificate, clock, plant, rug_l, rug_r, cups, fruit_bowl, cat_bed, calendar, rattan_chair, kids_chair, air_conditioner, basket, record_player, cork_jar |

No hazards. Kitchen pieces (counter, kitchen table, fridge) are not in this sheet yet; they will be appended after id 93 when the kitchen photos arrive, so existing ids will not change.
Hidden rooms: build them like the forest hollow log. Fill the space with the interior tiles on a back layer and the facade tiles on a foreground layer that fades while the hero overlaps it.

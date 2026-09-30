# Elemental Heroes: asset pack

`asset_index.json` lists **every sprite file** with its frame size, frame count, fps and loop flag. It's the quickest way for an engine or Claude Code to load everything.

Conventions: horizontal strips, equal frames, no padding, facing right. 32×32 characters, 16×16 items and projectiles, 32px tiles, 640×360 view at integer scale. Everything uses the 16-color palette in `palette/elemental16.hex`.

Each character folder is self-contained: PNG strips, `<id>.json`, `README.md` and the palette.
- `sprites/heroes/<element>/`: 8 heroes.
- `sprites/enemies/forest/{rotroot,mothwing,sporecap}/`
- `sprites/bosses/forest/{elder_rotroot,blightwarden}/`: Elder Rotroot is the Forest 1-1 boss. Blightwarden is kept as an alternative or later world boss.
- `sprites/items/`, `sprites/props/forest/`, `sprites/fx/`, `ui/`
- `tilesets/forest/`: `tileset_forest.png` (256×352, ids 0–81) plus `.tsj` for Tiled. The XML `.tsx` version is in `tileset_forest_tsx.zip`; unzip it next to the PNG. Tile properties cover solid, oneway, crumble, bounce, hazard, water, hidden_room, foreground and fade_when_behind.
- `backgrounds/forest/`: sky, far, mid, near and arena_near (parallax layers) plus fg_branches (foreground, 1.2).
- `maps/forest_mock.tmj`: a sample map. `mockups/` holds cohesion screenshots.

## New tiles (ids 56–81)
56–59 crumble plank (intact, cracked, breaking, gone). Crumbling is driven by code, so advance through the frames about 450ms after it's stepped on.
60–62 rope bridge (left post, middle, right post). One-way.
63 bounce mushroom idle, 64–67 bounce animation. Play it on contact and launch the hero at 2× jump velocity.
68/72/73 hollow-log open end (top, mouth, bottom). Flip them horizontally in Tiled for the right end.
69 log top (solid, walkable), 70/74 interior (background; 74 has glowing fungus), 71 log floor (solid), 75 log facade (foreground cover over the hidden room).
76–78 canopy top (left, middle, right), 79/81 canopy fringe, 80 canopy fill. These are foreground tiles. Put 75–81 on a layer above the hero and fade that layer to about 35% while the hero overlaps it.

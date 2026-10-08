# Phase 10: Level 8, Night Patrol

Only new files. Copy `assets/` over your repo's `assets/`. No maps, nothing re-exported: the level reuses the Level 5 living room (`tilesets/house`) and the Level 5 toys (`sprites/items/toys`); the engine darkens the room.

- sprites/npc/marija_night (walk, search, pickup, spot, yawn, stunned; lens + head platform per frame and the level rules in the json)
- sprites/heroes/kids/marija (playable, 32×32 hero rig)
- sprites/heroes/toy (toy projectile + impact)
- sprites/fx/night (toy into sack, hide sparkle, spotted "!")
- backgrounds/house_night (sky, far, mid, near, fg moonbeams)
- tilesets/house_night (17 hiding tiles, hide = true)
- cutscenes/night (01_inside, 02_moon, 03_marija, 04_done)
- ui: ui_flashlight_icon, ui_hidden_icon, icon_element_toy (+ README_night.md); ui/portraits: marija_night grumpy/suspicious/sleepy/proud (+ portraits_night.json)
- asset_index_night.json: merge into asset_index.json

Rules (also in npc_marija_night.json): 50 s, 30 toys; Marija's beam on a kid who is not hiding = "Aha!" and -5 s; jumping on her head stuns her for 2 s and gives +5 s; toys she picks up go in her sack; at 0 s or when no toys are left the kid needs more toys than the sack, or the level restarts.

69 files.

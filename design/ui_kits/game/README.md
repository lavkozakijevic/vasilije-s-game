# UI kit: Elemental Heroes (browser game)

A playable recreation of the forest level. It loads `assets/maps/forest_mock.tmj` (the Tiled export) and draws everything at 640×360, scaled 2× to 1280×720.

- `index.html`: screen flow (title → play → pause → result), with the stage scaled to fit the window.
- `GameView.jsx`: canvas runtime covering tile layers, animated water and fire-jet tiles, 4-layer parallax, hero physics (slopes and one-way platforms), Rotroot patrols, fireballs, coins and hazards.
- `Screens.jsx`: TitleScreen, PauseMenu, ResultPanel and Hud, built from the DS components PixelButton, PixelPanel, HeartMeter, CoinCounter, ElementBadge and Sprite.

Controls: ← → or A/D to move, Space/W to jump, F/J/X to throw fire, Esc/P to pause. Walk off the right edge to complete the level.

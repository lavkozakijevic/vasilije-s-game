# Intro cutscene (Elemental Heroes · The Rescue of Baba Vera)

Nine panels, 640×360 each, drawn at 320×180 and doubled. Every panel is split into layers so it can be animated with pans and slides:

- `bg`: the scene itself (opaque)
- `chars`: characters, or the key props when a scene has no characters (07: the four stones)
- `fg`: only in 04, the window frame that sits in front of the shadow
- `fx`: snow, lightning, glows (dithered, no alpha)
- `title`: only in 09, the title card art

- **intro_01_village**: bg, fx. Suggested motion: slow pan right toward the lit house; snow drifts down
- **intro_02_kitchen**: bg, chars, fx. Suggested motion: kids layer slides in from the left; steam rises
- **intro_03_living_room**: bg, fx. Suggested motion: slow pan left to right across the room
- **intro_04_window**: bg, chars, fg, fx. Suggested motion: shadow layer rises from below (y +40 to 0); lightning flashes on the fx layer
- **intro_05_blackout**: bg, fx. Suggested motion: hold black 0.6s, flash fx layer on for 2 frames, off, on
- **intro_06_empty_chair**: bg, fx. Suggested motion: slow push along the yarn trail toward the door; snow blows in
- **intro_07_stones_box**: bg, chars, fx. Suggested motion: stones pulse: toggle fx layer every 0.4s
- **intro_08_kids_face_off**: bg, chars, fx. Suggested motion: left pair slides in from the left, right pair from the right
- **intro_09_into_the_forest**: bg, chars, fx, title. Suggested motion: kids run up the path; title layer drops in after 1.5s

`intro.json` has the same list. Move layers in 2px steps so the pixels stay square.

## UI
- `ui/ui_note_paper.png` (320×200): handwritten-note background with a torn top edge and ruled lines. Leave a 36px left margin (red rule) and write on the lines, which are 16px apart starting at y 30.
- `ui/ui_skip_button.png` (160×20): 2 frames of 80×20, frame 0 normal, frame 1 hover.

# Dialogue portraits (Elemental Heroes · The Rescue of Baba Vera)

64×64, one frame each, head and shoulders, speaker facing right. Each file has its backing plate baked in (slate-plum gradient; Mrak sits on a void glow), so no extra background is needed.

- **Konstantin**: neutral, happy, ali_vera
- **Katarina**: neutral, happy, ali_vera
- **Vasilije**: neutral, happy, ali_vera
- **Dimitrije**: neutral, happy, ali_vera, okej
- **Baba Vera**: warm, stern, worried
- **Mrak**: menacing, surprised, sad
- **Cinder**: neutral
- **Brine**: neutral
- **Basalt**: neutral
- **Wisp**: neutral
- **Rime**: neutral
- **Jolt**: neutral
- **Umbra**: neutral
- **Aurel**: neutral

File pattern: `portrait_<speaker>_<expression>.png`; knights are `portrait_knight_<element>_neutral.png`. `portraits.json` lists every file with its speaker and expression.

## Dialogue box
- `../ui_dialogue_box.png` (24×24): nine-slice with 8px borders on all sides; tile or stretch the centre. Gold rivets sit in the corners.
- `../ui_name_tag.png` (32×16): horizontal three-slice, 6px caps; stretch the middle to the name width. Bone text, 5px from the top.
- Suggested layout at 640×360: box x 8, y 256, 624×96; portrait at (18, 272); name tag overlapping the top edge at (92, 248); text from x 92, y 272.
- Mirror a portrait horizontally when the speaker stands on the right of the screen.

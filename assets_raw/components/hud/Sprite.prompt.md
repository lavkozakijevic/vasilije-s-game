Plays a horizontal sprite strip (heroes, enemies, FX, items) at an integer scale with nearest-neighbour rendering.

```jsx
<Sprite src="assets/sprites/heroes/fire/hero_fire_run.png" frames={8} fps={12} scale={3} />
<Sprite src="assets/sprites/enemies/forest/enemy_rotroot_idle.png" frames={4} flip />
```

- `frame` freezes on one frame (contact sheets, mockups).
- Keep `scale` an integer (2, 3, 4); fractional scales blur pixels.
- Frame counts: idle 4, run 8, jump 2, fall 2, land 2, attack 6, hurt 2, death 6 (hero); rotroot idle 4, move 6, attack 4, hurt 2, death 5.

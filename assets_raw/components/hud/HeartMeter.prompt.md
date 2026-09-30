HUD health readout: a row of pixel hearts with full / half / empty states. Sits top-left of the game view.

```jsx
<HeartMeter value={2.5} max={4} scale={3} />
```

- Health is counted in half-hearts; `value` accepts .5 steps.
- Spacing between hearts is 2 art pixels.

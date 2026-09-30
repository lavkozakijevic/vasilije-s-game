HUD collectible counter: spinning coin icon plus a zero-padded, ink-outlined count. Sits under the HeartMeter.

```jsx
<CoinCounter count={27} scale={3} />
```

- Always zero-pad (`×027`) so the width never jumps.
- Numbers use Silkscreen at 8 art pixels × scale.

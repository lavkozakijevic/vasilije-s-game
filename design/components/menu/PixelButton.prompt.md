Menu button with a hard 1-art-pixel ink outline, notched corners and a top-left bevel; hover brightens, press sinks 1 px.

```jsx
<PixelButton variant="primary" size="lg">Start</PixelButton>
<PixelButton variant="secondary">Options</PixelButton>
<PixelButton variant="ghost" selected>Continue</PixelButton>
```

- States: normal, hover (lit), pressed (bevel inverts, shifts down 3px), disabled.
- `selected` mirrors hover for keyboard/gamepad navigation.
- Labels are Silkscreen, uppercase.

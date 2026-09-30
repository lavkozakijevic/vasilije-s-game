Current element / power indicator: a beveled slot holding the element icon, ringed in that element's signature color when active. HUD top-right.

```jsx
<ElementBadge element="fire" active />
<ElementBadge element="fire" active={false} label="Locked" />
```

- Ring color comes from `--element-<name>`.
- Only `icon_element_fire.png` exists in phase 1.

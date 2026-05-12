# HeroUI Dropdown placement transition repro

Minimal Vite/React reproduction for a HeroUI Dropdown placement issue. The
project intentionally uses the documented Tailwind v4 setup:

```css
@import "tailwindcss";
@import "@heroui/styles";
```

## Steps

1. Run `npm install`.
2. Run `npm run dev`.
3. Scroll until the two buttons sit near the bottom of the viewport.
4. Open **Default dropdown**.
5. Compare with **Patched dropdown**.

The default dropdown can initially render below the trigger with a tiny
`max-height`, then reposition/grow. The patched dropdown is the same HeroUI
structure, but its popover adds:

```css
.patched-dropdown-popover[data-entering='true'],
.patched-dropdown-popover[data-exiting='true'] {
  transition-property: transform, opacity;
}
```

This prevents placement-related inline styles such as `top`, `bottom`, and
`max-height` from being transitioned while React Aria is measuring and placing
the popover.

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
3. Scroll until the **Fruit** button sits near the bottom of the viewport.
4. Open the dropdown.

The dropdown can initially render below the trigger with a tiny `max-height`,
then reposition/grow instead of opening above the trigger immediately.

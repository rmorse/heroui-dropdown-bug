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
3. Scroll until the buttons sit near the bottom of the viewport.
4. Open **With Bug** and compare it with **With Fix**.

The **With Bug** dropdown can initially render below the trigger with a tiny
`max-height`, then reposition/grow instead of opening above the trigger
immediately. The **With Fix** dropdown applies the same scoped transition fix
used by our app.

If the buggy dropdown is opened, closed, and reopened quickly, it may sometimes
position correctly on the second open. That suggests the issue is timing-related:
the popover can be measured while transitionable placement styles are still in
flight, but a fast reopen can reuse DOM/state before the popover has fully torn
down.

## CSS Fix

```css
.repro-dropdown-popover--fixed[data-entering="true"],
.repro-dropdown-popover--fixed[data-exiting="true"] {
  transition-property: transform, opacity;
}
```

The current theory is that HeroUI/React Aria writes placement-related inline
styles such as `top`, `bottom`, and `max-height` while measuring and positioning
the popover. The default transition rules appear to allow at least one additional
placement/layout-related property to transition during that process, which can
leave the measurement logic observing an intermediate value. Restricting the
transition to visual-only properties keeps placement changes immediate while
preserving the intended visual animation.

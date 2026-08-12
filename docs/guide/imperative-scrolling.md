# Imperative Scrolling

For jumps that aren't driven by selection — "go to top", "jump to search result" — attach a ref and use the imperative API:

```tsx
import { useRef } from "react";
import type { VirtualListRef } from "ink-virtual-list";

function App() {
  const listRef = useRef<VirtualListRef>(null);

  useInput((input) => {
    if (input === "g") listRef.current?.scrollToIndex(0, "top");
    if (input === "G") listRef.current?.scrollToIndex(items.length - 1, "bottom");
  });

  return <VirtualList ref={listRef} items={items} renderItem={({ item }) => <Text>{item}</Text>} />;
}
```

## `scrollToIndex(index, alignment?)`

Scrolls the viewport so `index` is visible. Out-of-range indexes are clamped. The `alignment` controls where the item lands:

| Alignment          | Behavior                                                        |
| ------------------ | --------------------------------------------------------------- |
| `"auto"` (default) | Scroll only if the item is out of view, by the minimum amount   |
| `"top"`            | Place the item at the top of the viewport                       |
| `"center"`         | Center the item in the viewport                                 |
| `"bottom"`         | Place the item at the bottom of the viewport                    |

Note that `scrollToIndex` moves the *viewport*, not the *selection* — if your app tracks `selectedIndex`, update it alongside the scroll (as in the `g`/`G` example above), or the next selection change may scroll the viewport back.

## `getViewport()`

Returns the current [`ViewportState`](/api/types#viewportstate) — `{ offset, visibleCount, totalCount }` — for imperative reads. For reacting to changes, prefer the [`onViewportChange` callback](/guide/viewport-events).

## `remeasure()`

Re-clamps the scroll offset against the current list size. You rarely need this — the list already re-clamps when items or dimensions change through props — but it's available as an escape hatch after external mutations.

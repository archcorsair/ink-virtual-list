# Viewport Events & Scrollbars

## `onViewportChange`

Fires whenever the viewport changes — scrolling, resizing, or the list length changing — with the current [`ViewportState`](/api/types#viewportstate):

```tsx
const [viewport, setViewport] = useState<ViewportState | null>(null);

<VirtualList
  items={items}
  onViewportChange={setViewport}
  renderItem={({ item }) => <Text>{item}</Text>}
/>;

// elsewhere in your layout:
{viewport && (
  <Text dimColor>
    {viewport.offset + 1}–{viewport.offset + viewport.visibleCount} of {viewport.totalCount}
  </Text>
)}
```

Pass a stable function — a `useState` setter (as above) or a `useCallback`-wrapped handler. An inline arrow creates a new function identity every render, which re-fires the effect that delivers the callback.

## Custom Scrollbars

`renderScrollBar` receives the viewport state and renders below the list. A minimal position indicator:

```tsx
<VirtualList
  items={items}
  height={12}
  renderScrollBar={({ offset, visibleCount, totalCount }) => {
    if (totalCount <= visibleCount) return null;
    const width = 20;
    const thumbSize = Math.max(1, Math.round((visibleCount / totalCount) * width));
    const maxOffset = totalCount - visibleCount;
    const thumbStart = Math.round((offset / maxOffset) * (width - thumbSize));
    const track = "░".repeat(thumbStart) + "█".repeat(thumbSize) + "░".repeat(width - thumbStart - thumbSize);
    return <Text dimColor>{track}</Text>;
  }}
  renderItem={({ item }) => <Text>{item}</Text>}
/>
```

Note the scrollbar renders *outside* the [height budget](/guide/heights#the-height-budget) — account for its line in your layout (e.g. add 1 to `reservedLines` when using `height="auto"`).

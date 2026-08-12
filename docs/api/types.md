# Types

All types are exported from the package root:

```ts
import type { RenderItemProps, ViewportState, VirtualListProps, VirtualListRef, TerminalSize } from "ink-virtual-list";
```

## `RenderItemProps<T>`

Passed to `renderItem` for each visible item.

```ts
interface RenderItemProps<T> {
  /** The item data from the items array */
  item: T;
  /** The index of this item in the full items array */
  index: number;
  /** Whether this item is currently selected */
  isSelected: boolean;
}
```

## `ViewportState`

The list's current window into the items array. Received by `onViewportChange`, `renderScrollBar`, and returned from `getViewport()`.

```ts
interface ViewportState {
  /** Number of items scrolled past (hidden above the viewport) */
  offset: number;
  /** Number of items currently visible in the viewport */
  visibleCount: number;
  /** Total number of items in the list */
  totalCount: number;
}
```

## `VirtualListRef`

The imperative handle exposed via `ref` — see the [Imperative Scrolling guide](/guide/imperative-scrolling).

```ts
interface VirtualListRef {
  /** Scroll to bring a specific index into view */
  scrollToIndex: (index: number, alignment?: "auto" | "top" | "center" | "bottom") => void;
  /** Get the current viewport state */
  getViewport: () => ViewportState;
  /** Re-clamp the scroll offset against the current list size */
  remeasure: () => void;
}
```

## `VirtualListProps<T>`

The full props interface — documented field-by-field in the [Components reference](/api/components).

## `TerminalSize`

Returned by [`useTerminalSize`](/api/hooks).

```ts
interface TerminalSize {
  /** Number of rows (lines) in the terminal */
  rows: number;
  /** Number of columns (characters) in the terminal */
  columns: number;
}
```

# Components

## `VirtualList<T>`

The virtualized list. Renders only the items visible in the viewport and keeps `selectedIndex` in view.

```tsx
import { VirtualList } from "ink-virtual-list";

<VirtualList items={items} renderItem={({ item }) => <Text>{item}</Text>} />;
```

### Required Props

| Prop         | Type                                    | Description                                                        |
| ------------ | --------------------------------------- | ------------------------------------------------------------------ |
| `items`      | `T[]`                                   | Array of items to render                                           |
| `renderItem` | `(props: RenderItemProps<T>) => ReactNode` | Render function for each visible item ([props](/api/types#renderitemprops-t)) |

### Optional Props

| Prop                         | Type                                   | Default | Description                                                                 |
| ---------------------------- | -------------------------------------- | ------- | --------------------------------------------------------------------------- |
| `selectedIndex`              | `number`                               | `0`     | Index of the selected item; the viewport scrolls to keep it visible          |
| `keyExtractor`               | `(item: T, index: number) => string`   | —       | Custom React key per item; defaults to `item.id`/`item.key`, then the index |
| `height`                     | `number \| "auto"`                     | `10`    | Total rendered height in lines, or `"auto"` to fill the terminal            |
| `reservedLines`              | `number`                               | `0`     | Lines subtracted from the terminal height when `height="auto"`              |
| `itemHeight`                 | `number`                               | `1`     | Lines per item (positive integer; validated at render)                      |
| `showOverflowIndicators`     | `boolean`                              | `true`  | Show "N more" markers when items overflow the viewport                      |
| `overflowIndicatorThreshold` | `number`                               | `1`     | Minimum overflow count before an indicator is shown                         |
| `renderOverflowTop`          | `(count: number) => ReactNode`         | —       | Custom top overflow indicator (keep to one line)                            |
| `renderOverflowBottom`       | `(count: number) => ReactNode`         | —       | Custom bottom overflow indicator (keep to one line)                         |
| `renderScrollBar`            | `(viewport: ViewportState) => ReactNode` | —     | Custom scrollbar rendered below the list                                    |
| `onViewportChange`           | `(viewport: ViewportState) => void`    | —       | Called whenever the viewport changes (pass a stable function)               |

### Ref

`VirtualList` accepts a `ref` exposing the imperative API — see [`VirtualListRef`](/api/types#virtuallistref) and the [Imperative Scrolling guide](/guide/imperative-scrolling).

## Exported Utilities

### `validateItemHeight(itemHeight)`

Validates that a value is a positive integer, throwing a descriptive error otherwise. `VirtualList` calls this on every render for its `itemHeight` prop; it's exported for validating user-supplied configuration before it reaches the component.

```ts
import { validateItemHeight } from "ink-virtual-list";

validateItemHeight(2); // ok
validateItemHeight(1.5); // throws: itemHeight must be a positive integer
```

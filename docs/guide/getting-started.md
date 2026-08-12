# Getting Started

`ink-virtual-list` is a virtualized list component for [Ink](https://github.com/vadimdemedes/ink) terminal applications. It renders only the items currently visible in the viewport, so lists with thousands of entries stay fast — and it keeps the selected item in view as the user navigates.

## Installation

::: code-group

```bash [npm]
npm install ink-virtual-list
```

```bash [bun]
bun add ink-virtual-list
```

```bash [jsr]
npx jsr add @archcorsair/ink-virtual-list
```

:::

## Quick Example

```tsx
import { VirtualList } from "ink-virtual-list";
import { Text, useInput } from "ink";
import { useState } from "react";

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

  useInput((_, key) => {
    if (key.upArrow) setSelectedIndex((i) => Math.max(0, i - 1));
    if (key.downArrow) setSelectedIndex((i) => Math.min(items.length - 1, i + 1));
  });

  return (
    <VirtualList
      items={items}
      selectedIndex={selectedIndex}
      height={10}
      renderItem={({ item, isSelected }) => (
        <Text color={isSelected ? "cyan" : undefined}>
          {isSelected ? "❯ " : "  "}
          {item}
        </Text>
      )}
    />
  );
}
```

The component is presentational: it renders the window of items around `selectedIndex` and scrolls to keep it visible. Input handling stays in your app (as in the `useInput` calls above), so the list composes cleanly with whatever keybindings your CLI already has.

## Run the Examples

The repository ships five runnable example apps — a log explorer, a commit browser, a pod dashboard, a two-line inbox, and a feature playground. See the [Examples gallery](/examples) for recordings of each, or run them directly:

```bash
git clone https://github.com/archcorsair/ink-virtual-list
cd ink-virtual-list
bun install
bun examples/logs.tsx      # or commits / pods / inbox / demo
```

## Next Steps

- [Basic Usage](/guide/basic-usage) — items, rendering, selection, and keys
- [Heights & Auto-fill](/guide/heights) — fixed heights, `height="auto"`, and the height budget
- [API Reference](/api/components) — every prop, with defaults

## Related Projects

- [ink-stepper](https://github.com/archcorsair/ink-stepper) — a step-by-step wizard/stepper component for Ink, from the same author ([docs](https://archcorsair.github.io/ink-stepper/))

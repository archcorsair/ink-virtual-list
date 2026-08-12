# Heights & Auto-fill

## Fixed Height

`height` sets the total rendered height of the list in terminal lines (default: `10`):

```tsx
<VirtualList items={items} height={15} renderItem={({ item }) => <Text>{item}</Text>} />
```

## Auto-fill

`height="auto"` sizes the list to the terminal, re-rendering on resize. Use `reservedLines` to leave room for your surrounding UI:

```tsx
<Box flexDirection="column">
  <Text bold>Header</Text> {/* 1 line */}
  <VirtualList
    items={items}
    height="auto"
    reservedLines={3} // header + footer + status line
    renderItem={({ item }) => <Text>{item}</Text>}
  />
  <Text dimColor>Footer</Text> {/* 1 line */}
  <Text dimColor>Status</Text> {/* 1 line */}
</Box>
```

The resolved height is `terminal rows − reservedLines`, clamped to at least 1. Resize handling comes from [`useTerminalSize`](/api/hooks), which is also exported for your own layouts.

## Multi-line Items

`itemHeight` (default: `1`) sets how many lines each item occupies. Every item gets exactly that many lines — taller content is clipped, shorter content is padded by the fixed-height slot:

```tsx
<VirtualList
  items={contacts}
  itemHeight={2}
  height={12}
  renderItem={({ item }) => (
    <Box flexDirection="column">
      <Text bold>{item.name}</Text>
      <Text dimColor>{item.email}</Text>
    </Box>
  )}
/>
```

`itemHeight` must be a positive integer — anything else throws immediately with a clear error rather than rendering garbage.

## The Height Budget

`height` is a *budget*, and everything the list renders lives inside it:

- When overflow indicators are enabled (the default), they consume **2 lines** of the budget — one slot at the top, one at the bottom — leaving `height − 2` lines for items.
- The number of visible items is `floor(available lines ÷ itemHeight)`.
- A hidden indicator (at the list edges, or below the [threshold](/guide/overflow-indicators#threshold)) still occupies its line as a blank placeholder.

The result: **the total rendered height always equals `height`**, no matter where the list is scrolled. Your footer never jumps when an indicator appears or disappears.

### Tiny Heights

If the budget is too small to fit both indicator lines plus a single item (`height − 2 < itemHeight`), indicators are automatically disabled for that render and the full height goes to items. So `height={2}` renders two single-line items, and even `height={1}` renders one — the list never silently renders nothing.

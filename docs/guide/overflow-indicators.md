# Overflow Indicators

When items exist beyond the viewport, the list shows dimmed markers by default:

```
  ▲ 12 more
  Item 13
❯ Item 14
  Item 15
  ▼ 985 more
```

Disable them entirely with `showOverflowIndicators={false}` — the reclaimed 2 lines go to items.

## Threshold

`overflowIndicatorThreshold` (default: `1`) sets the minimum overflow count before an indicator is shown. With a threshold of `5`, scrolling 3 items past the top shows no "▲ 3 more" — useful when a tiny overflow is more noise than signal:

```tsx
<VirtualList items={items} overflowIndicatorThreshold={5} renderItem={({ item }) => <Text>{item}</Text>} />
```

A hidden indicator's line is rendered as a blank placeholder, so toggling around the threshold never changes the list's total height. See [The Height Budget](/guide/heights#the-height-budget).

## Custom Indicators

Replace either indicator with your own renderer — each receives the overflow count:

```tsx
<VirtualList
  items={items}
  renderOverflowTop={(count) => <Text dimColor>↑ {count} hidden</Text>}
  renderOverflowBottom={(count) => <Text dimColor>↓ {count} hidden</Text>}
  renderItem={({ item }) => <Text>{item}</Text>}
/>
```

Keep custom indicators to a single line — the height budget reserves exactly one line per slot, and taller content will push the layout beyond `height`.

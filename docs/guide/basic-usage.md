# Basic Usage

## Items and Rendering

`VirtualList` takes an array of `items` and a `renderItem` function. The component is generic — `items` can be strings, objects, or anything else, and `renderItem` receives the item fully typed:

```tsx
interface Todo {
  id: string;
  title: string;
  done: boolean;
}

<VirtualList<Todo>
  items={todos}
  renderItem={({ item, index, isSelected }) => (
    <Text color={isSelected ? "cyan" : undefined}>
      {item.done ? "✓" : "○"} {item.title}
    </Text>
  )}
/>;
```

`renderItem` is called only for items inside the viewport. It receives [`RenderItemProps<T>`](/api/types#renderitemprops-t):

| Prop         | Type      | Description                                 |
| ------------ | --------- | ------------------------------------------- |
| `item`       | `T`       | The item from the `items` array             |
| `index`      | `number`  | Its index in the **full** array             |
| `isSelected` | `boolean` | Whether it is the currently selected item   |

Each rendered item is wrapped in a fixed-height, overflow-hidden `Box`, so a `renderItem` that produces content taller or wider than its slot is clipped rather than breaking the layout. See [Heights & Auto-fill](/guide/heights) for multi-line items.

## Selection

Selection is controlled by the parent through `selectedIndex`. The list never handles input itself — wire your own keybindings and pass the index down:

```tsx
const [selectedIndex, setSelectedIndex] = useState(0);

useInput((input, key) => {
  if (key.upArrow || input === "k") setSelectedIndex((i) => Math.max(0, i - 1));
  if (key.downArrow || input === "j") setSelectedIndex((i) => Math.min(items.length - 1, i + 1));
});
```

When `selectedIndex` moves outside the visible window, the viewport scrolls just enough to bring it back into view — up if the selection went above, down if it went below. Out-of-range values are clamped, so a stale index after the list shrinks won't crash.

## Keys

React needs a stable key per item. By default the list looks for an `id` or `key` property on each item (string or number) and falls back to the array index. For anything else, provide `keyExtractor`:

```tsx
<VirtualList
  items={users}
  keyExtractor={(user) => user.email}
  renderItem={({ item }) => <Text>{item.name}</Text>}
/>
```

Index-based keys are fine for static lists, but supply a real key when items are inserted or removed so React can track them across renders.

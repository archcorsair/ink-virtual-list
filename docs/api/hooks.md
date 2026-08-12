# Hooks

## `useTerminalSize()`

Returns the current terminal dimensions and re-renders on resize. This is the hook behind `height="auto"`, exported for building your own terminal-aware layouts:

```tsx
import { useTerminalSize } from "ink-virtual-list";

function StatusBar() {
  const { rows, columns } = useTerminalSize();
  return (
    <Text dimColor>
      {columns}×{rows}
    </Text>
  );
}
```

Returns [`TerminalSize`](/api/types#terminalsize):

| Field     | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `rows`    | `number` | Terminal height in lines (default `24` when unknown)   |
| `columns` | `number` | Terminal width in characters (default `80` when unknown) |

In non-TTY environments (CI, piped output) the resize listener is skipped and the defaults or last-known values are returned.

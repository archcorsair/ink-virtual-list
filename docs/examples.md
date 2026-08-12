# Examples

Every example is a small, self-contained app in the repo's [`examples/`](https://github.com/archcorsair/ink-virtual-list/tree/main/examples) directory — clone the repo, `bun install`, and run any of them directly. They double as copy-paste starting points; each one uses seeded fake data so it runs identically everywhere. The recordings below are generated from the committed [tape files](https://github.com/archcorsair/ink-virtual-list/tree/main/docs/tapes) with [VHS](https://github.com/charmbracelet/vhs).

Common keys in all examples: `↑`/`↓` or `j`/`k` to move, `g`/`G` to jump top/bottom, `q` to quit.

## logship — log explorer

A tail-style log viewer over 12,847 lines: colored levels, service names, and a live position footer via `onViewportChange`.

```bash
bun examples/logs.tsx
```

![logship demo](/logs.gif)

## gitscope — commit browser

A `tig`-style history browser: SHAs, conventional-commit subjects, authors, and relative dates, with `keyExtractor` keyed on the SHA.

```bash
bun examples/commits.tsx
```

![gitscope demo](/commits.gif)

## podwatch — pod dashboard

A Kubernetes-flavored status board: colored health states, restart counts, and a summary header derived from the same data.

```bash
bun examples/pods.tsx
```

![podwatch demo](/pods.gif)

## termmail — two-line inbox

An inbox with `itemHeight={2}` — sender/subject/time on the first line, a dimmed preview on the second. Shows multi-line items staying perfectly aligned while scrolling.

```bash
bun examples/inbox.tsx
```

![termmail demo](/inbox.gif)

## Feature playground

The original interactive demo exercises the component's mechanics directly — cycle `t` through fixed, tiny (`height={2}`), and `height="auto"` modes to see the [height budget](/guide/heights#the-height-budget) behavior live.

```bash
bun examples/demo.tsx
```

![feature playground demo](/demo.gif)

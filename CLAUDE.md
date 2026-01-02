# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run build        # Build with bunup (ESM + types)
bun run typecheck    # TypeScript check (tsc --noEmit)
bun run lint         # Biome check
bun run lint:fix     # Biome auto-fix
```

### Publishing

```bash
bun run publish:npm  # Publish to npm
bun run publish:jsr  # Build + publish to JSR (@archcorsair/ink-virtual-list)
```

## Architecture

Single-component library exporting `VirtualList` for Ink CLI apps. Renders only visible items for large datasets.

### Source Files

- `src/VirtualList.tsx` - Main component using `forwardRef` with generic `<T>`
- `src/types.ts` - All TypeScript interfaces (`VirtualListProps`, `ViewportState`, `VirtualListRef`)
- `src/useTerminalSize.ts` - Hook wrapping Ink's `useStdout` for terminal resize handling
- `src/index.ts` - Public exports

### Key Patterns

- **Viewport calculation**: `calculateViewportOffset()` determines scroll position based on selection
- **Height modes**: Fixed number or `"auto"` (fills terminal minus `reservedLines`)
- **Imperative API**: `scrollToIndex(index, alignment)`, `getViewport()`, `remeasure()` via ref

## Tooling

- **Runtime**: Bun
- **Build**: bunup (Bun's bundler, config in `bunup.config.ts`)
- **Linting/Formatting**: Biome (double quotes, 2-space indent, 120 line width)
- **Peer deps**: ink ^6.6.0, react ^19.2.3

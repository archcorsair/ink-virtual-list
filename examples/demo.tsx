#!/usr/bin/env bun
/**
 * Interactive smoke-test demo for ink-virtual-list.
 *
 * Run with: bun examples/demo.tsx  (or `bun run demo`)
 *
 * Keys:
 *   ↑ / k    move selection up
 *   ↓ / j    move selection down
 *   g / G    jump to top / bottom (via the imperative ref)
 *   t        cycle height mode: fixed 10 -> tiny 2 -> auto + reservedLines
 *   q / Esc  quit
 */

import { Box, render, Text, useApp, useInput } from "ink";
import { useCallback, useRef, useState } from "react";
import type { ViewportState, VirtualListRef } from "../src";
import { VirtualList } from "../src";

interface Row {
  id: number;
  label: string;
}

const ITEMS: Row[] = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  label: `Row ${String(i).padStart(3, "0")} — the quick brown fox jumps over the lazy dog`,
}));

const HEIGHT_MODES = ["fixed", "tiny", "auto"] as const;
type HeightMode = (typeof HEIGHT_MODES)[number];

/** Lines the demo chrome (header + footer) occupies, reserved in "auto" mode. */
const RESERVED_LINES = 6;

function describeMode(mode: HeightMode): string {
  switch (mode) {
    case "fixed":
      return "height={10}";
    case "tiny":
      return "height={2} (indicators auto-disabled)";
    default:
      return `height="auto" reservedLines={${RESERVED_LINES}}`;
  }
}

function Demo(): React.JSX.Element {
  const { exit } = useApp();
  const listRef = useRef<VirtualListRef>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modeIndex, setModeIndex] = useState(0);
  const [viewport, setViewport] = useState<ViewportState>({ offset: 0, visibleCount: 0, totalCount: 0 });

  const mode: HeightMode = HEIGHT_MODES[modeIndex] ?? "fixed";

  const onViewportChange = useCallback((next: ViewportState) => {
    setViewport(next);
  }, []);

  useInput((input, key) => {
    if (input === "q" || key.escape) {
      exit();
      return;
    }
    if (key.upArrow || input === "k") {
      setSelectedIndex((i) => Math.max(0, i - 1));
      return;
    }
    if (key.downArrow || input === "j") {
      setSelectedIndex((i) => Math.min(ITEMS.length - 1, i + 1));
      return;
    }
    if (input === "g") {
      setSelectedIndex(0);
      listRef.current?.scrollToIndex(0, "top");
      return;
    }
    if (input === "G") {
      const last = ITEMS.length - 1;
      setSelectedIndex(last);
      listRef.current?.scrollToIndex(last, "bottom");
      return;
    }
    if (input === "t") {
      setModeIndex((i) => (i + 1) % HEIGHT_MODES.length);
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">
        ink-virtual-list demo
      </Text>
      <Text dimColor>↑/↓ or j/k move · g/G top/bottom · t cycle height · q quit</Text>

      <Box flexDirection="column" borderStyle="round" borderColor="gray">
        <VirtualList
          ref={listRef}
          items={ITEMS}
          selectedIndex={selectedIndex}
          height={mode === "fixed" ? 10 : mode === "tiny" ? 2 : "auto"}
          reservedLines={RESERVED_LINES}
          keyExtractor={(item) => String(item.id)}
          onViewportChange={onViewportChange}
          renderItem={({ item, isSelected }) => (
            <Text color={isSelected ? "cyan" : undefined} bold={isSelected}>
              {isSelected ? "❯ " : "  "}
              {item.label}
            </Text>
          )}
        />
      </Box>

      <Text>
        <Text dimColor>mode </Text>
        <Text color="yellow">{describeMode(mode)}</Text>
      </Text>
      <Text dimColor>
        selected {selectedIndex + 1}/{ITEMS.length} · offset {viewport.offset} · visibleCount {viewport.visibleCount} ·
        totalCount {viewport.totalCount}
      </Text>
    </Box>
  );
}

render(<Demo />);

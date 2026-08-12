#!/usr/bin/env bun
/**
 * "gitscope" — a commit history browser showcase for ink-virtual-list.
 * Chrome: bordered panel with a live position counter in the title bar.
 * Run with: bun examples/commits.tsx  ·  keys: ↑/↓ or j/k move, g/G top/bottom, q quit
 */

import { Box, render, Text, useApp, useInput } from "ink";
import { useRef, useState } from "react";
import type { VirtualListRef } from "../src";
import { VirtualList } from "../src";

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Commit {
  sha: string;
  subject: string;
  author: string;
  when: string;
}

const AUTHORS = ["Maya Chen", "Dana Torres", "Sam Okafor", "Riley Park", "Alex Fujii"];
const TYPES = ["feat", "fix", "refactor", "docs", "test", "chore", "perf"];
const SUBJECTS = [
  "debounce resize events",
  "add fuzzy matching to search",
  "extract viewport math into hook",
  "handle empty result sets",
  "cache parsed config between runs",
  "align overflow indicators",
  "drop node 18 from CI matrix",
  "batch writes in flush loop",
  "tighten types on public API",
  "keyboard-only navigation",
  "reduce bundle size by 12%",
  "document the height budget",
];
const WHEN = ["2h ago", "5h ago", "1d ago", "2d ago", "3d ago", "1w ago", "2w ago"];

function makeCommits(count: number): Commit[] {
  const rand = mulberry32(7);
  const hex = "0123456789abcdef";
  return Array.from({ length: count }, (_, i) => ({
    sha: Array.from({ length: 7 }, () => hex[Math.floor(rand() * 16)]).join(""),
    subject: `${TYPES[Math.floor(rand() * TYPES.length)]}: ${SUBJECTS[(i * 5 + Math.floor(rand() * 2)) % SUBJECTS.length]}`,
    author: AUTHORS[Math.floor(rand() * AUTHORS.length)] ?? "Maya Chen",
    when: WHEN[Math.min(Math.floor((i / count) * WHEN.length + rand()), WHEN.length - 1)] ?? "1w ago",
  }));
}

const COMMITS = makeCommits(38116);

function App(): React.JSX.Element {
  const { exit } = useApp();
  const listRef = useRef<VirtualListRef>(null);
  const [selected, setSelected] = useState(0);

  useInput((input, key) => {
    if (input === "q") exit();
    else if (key.upArrow || input === "k") setSelected((i) => Math.max(0, i - 1));
    else if (key.downArrow || input === "j") setSelected((i) => Math.min(COMMITS.length - 1, i + 1));
    else if (input === "g") {
      setSelected(0);
      listRef.current?.scrollToIndex(0, "top");
    } else if (input === "G") {
      setSelected(COMMITS.length - 1);
      listRef.current?.scrollToIndex(COMMITS.length - 1, "bottom");
    }
  });

  return (
    <Box flexDirection="column">
      <Box>
        <Text backgroundColor="yellow" color="black" bold>
          {" gitscope "}
        </Text>
        <Text dimColor> ⎇ main · commit </Text>
        <Text color="yellow" bold>
          {(selected + 1).toLocaleString("en-US")}
        </Text>
        <Text dimColor> of </Text>
        <Text color="yellow" bold>
          {COMMITS.length.toLocaleString("en-US")}
        </Text>
      </Box>

      <Box flexDirection="column" borderStyle="round" borderColor="gray">
        <VirtualList
          items={COMMITS}
          selectedIndex={selected}
          height={14}
          keyExtractor={(c, i) => `${c.sha}-${i}`}
          ref={listRef}
          renderItem={({ item, isSelected }) => (
            <Box>
              <Text inverse={isSelected}>
                <Text color="yellow">{item.sha}</Text>
                <Text bold={isSelected}> {item.subject.padEnd(32).slice(0, 32)}</Text>
                <Text color="green"> {item.author.padEnd(11)}</Text>
                <Text dimColor> {item.when}</Text>
              </Text>
            </Box>
          )}
        />
      </Box>

      <Text dimColor>{" hold j to fly through history · g/G jump · q quit"}</Text>
    </Box>
  );
}

render(<App />);

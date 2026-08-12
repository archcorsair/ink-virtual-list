#!/usr/bin/env bun
/**
 * "podwatch" — a Kubernetes pod dashboard showcase for ink-virtual-list.
 * Chrome: kubectl-style table with a column header row and a status bar footer.
 * Run with: bun examples/pods.tsx  ·  keys: ↑/↓ or j/k move, g/G top/bottom, q quit
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

type Status = "Running" | "Pending" | "CrashLoopBackOff" | "Completed";

interface Pod {
  name: string;
  status: Status;
  restarts: number;
  age: string;
  cpu: string;
}

const DEPLOYMENTS = ["api", "worker", "scheduler", "ingest", "frontend", "metrics", "billing", "search"];

function makePods(count: number): Pod[] {
  const rand = mulberry32(1337);
  const hex = "abcdef0123456789";
  const suffix = () => Array.from({ length: 5 }, () => hex[Math.floor(rand() * 16)]).join("");
  return Array.from({ length: count }, () => {
    const roll = rand();
    const status: Status =
      roll < 0.82 ? "Running" : roll < 0.9 ? "Pending" : roll < 0.96 ? "CrashLoopBackOff" : "Completed";
    return {
      name: `${DEPLOYMENTS[Math.floor(rand() * DEPLOYMENTS.length)]}-${Math.floor(rand() * 90) + 10}f${suffix().slice(0, 4)}-${suffix()}`,
      status,
      restarts:
        status === "CrashLoopBackOff" ? Math.floor(rand() * 40) + 3 : rand() < 0.85 ? 0 : Math.floor(rand() * 3),
      age: rand() < 0.5 ? `${Math.floor(rand() * 20) + 1}d` : `${Math.floor(rand() * 22) + 1}h`,
      cpu: `${Math.floor(rand() * 240) + 2}m`,
    };
  });
}

const PODS = makePods(438);

const STATUS_COLOR: Record<Status, string> = {
  Running: "green",
  Pending: "yellow",
  CrashLoopBackOff: "red",
  Completed: "gray",
};

function App(): React.JSX.Element {
  const { exit } = useApp();
  const listRef = useRef<VirtualListRef>(null);
  const [selected, setSelected] = useState(0);

  useInput((input, key) => {
    if (input === "q") exit();
    else if (key.upArrow || input === "k") setSelected((i) => Math.max(0, i - 1));
    else if (key.downArrow || input === "j") setSelected((i) => Math.min(PODS.length - 1, i + 1));
    else if (input === "g") {
      setSelected(0);
      listRef.current?.scrollToIndex(0, "top");
    } else if (input === "G") {
      setSelected(PODS.length - 1);
      listRef.current?.scrollToIndex(PODS.length - 1, "bottom");
    }
  });

  const unhealthy = PODS.filter((p) => p.status === "CrashLoopBackOff").length;
  const atTop = selected === 0;
  const atEnd = selected === PODS.length - 1;

  return (
    <Box flexDirection="column">
      <Box>
        <Text color="cyan" bold>
          podwatch
        </Text>
        <Text dimColor> · context prod-us-east · namespace default</Text>
      </Box>

      <Text bold dimColor>
        {"  NAME                       STATUS             R   AGE   CPU"}
      </Text>

      <VirtualList
        items={PODS}
        selectedIndex={selected}
        height={13}
        keyExtractor={(p) => p.name}
        ref={listRef}
        renderItem={({ item, isSelected }) => (
          <Box>
            <Text inverse={isSelected}>
              <Text color={STATUS_COLOR[item.status]}>{"● "}</Text>
              <Text bold={isSelected}>{item.name.padEnd(26).slice(0, 26)}</Text>
              <Text color={STATUS_COLOR[item.status]}> {item.status.padEnd(17)}</Text>
              <Text dimColor={item.restarts === 0} color={item.restarts > 2 ? "red" : undefined}>
                {String(item.restarts).padStart(3)}
              </Text>
              <Text dimColor>
                {"  "}
                {item.age.padStart(4)} {item.cpu.padStart(5)}
              </Text>
            </Text>
          </Box>
        )}
      />

      <Box>
        <Text backgroundColor="cyan" color="black" bold>
          {atEnd ? " END " : atTop ? " TOP " : ` ${String(selected + 1).padStart(3)} `}
        </Text>
        <Text color="cyan" bold>
          {" pod "}
          {selected + 1}/{PODS.length}
        </Text>
        <Text dimColor> · </Text>
        <Text color="red">{unhealthy} unhealthy</Text>
        <Text dimColor> · j/k scroll · g/G jump · q quit</Text>
      </Box>
    </Box>
  );
}

render(<App />);

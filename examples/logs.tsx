#!/usr/bin/env bun
/**
 * "logship" — a log explorer showcase for ink-virtual-list.
 * Chrome: borderless tail view with a position gauge footer (renderScrollBar).
 * Run with: bun examples/logs.tsx  ·  keys: ↑/↓ or j/k move, g/G top/bottom, q quit
 */

import { Box, render, Text, useApp, useInput } from "ink";
import { useRef, useState } from "react";
import type { VirtualListRef } from "../src";
import { VirtualList } from "../src";

// Deterministic PRNG so recordings are reproducible
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

type Level = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogEntry {
  id: number;
  time: string;
  level: Level;
  service: string;
  message: string;
}

const SERVICES = ["api-gateway", "billing-svc", "auth", "cache", "search-idx", "webhooks", "mailer"];
const MESSAGES: Array<[Level, string]> = [
  ["INFO", "request completed in {n}ms"],
  ["INFO", "user u_{n} authenticated"],
  ["INFO", "webhook delivered to shop_{n}"],
  ["INFO", "indexed {n} documents"],
  ["DEBUG", "cache hit ratio 0.9{n}"],
  ["DEBUG", "connection pool at {n}/50"],
  ["WARN", "retrying request, attempt {n}/3"],
  ["WARN", "evicting {n} stale keys"],
  ["WARN", "response time degraded: {n}ms"],
  ["ERROR", "payment declined: card_expired"],
  ["ERROR", "upstream timeout after {n}ms"],
  ["ERROR", "failed to parse payload: unexpected token"],
];

function makeLogs(count: number): LogEntry[] {
  const rand = mulberry32(42);
  const entries: LogEntry[] = [];
  let t = 9 * 3600 + 41 * 60 + 7; // 09:41:07
  for (let i = 0; i < count; i++) {
    t += rand() < 0.6 ? 0 : 1;
    const hh = String(Math.floor(t / 3600)).padStart(2, "0");
    const mm = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
    const ss = String(t % 60).padStart(2, "0");
    // Weight toward INFO/DEBUG so WARN/ERROR pop when they appear
    const roll = rand();
    const pool = roll < 0.72 ? MESSAGES.slice(0, 6) : roll < 0.9 ? MESSAGES.slice(6, 9) : MESSAGES.slice(9);
    const pick = pool[Math.floor(rand() * pool.length)] ?? MESSAGES[0];
    if (!pick) continue;
    const [level, template] = pick;
    entries.push({
      id: i,
      time: `${hh}:${mm}:${ss}`,
      level,
      service: SERVICES[Math.floor(rand() * SERVICES.length)] ?? "api-gateway",
      message: template.replace("{n}", String(Math.floor(rand() * 900) + 12)),
    });
  }
  return entries;
}

const LOGS = makeLogs(12847);

const LEVEL_COLOR: Record<Level, string | undefined> = {
  DEBUG: "gray",
  INFO: "green",
  WARN: "yellow",
  ERROR: "red",
};

const GAUGE_WIDTH = 26;

function App(): React.JSX.Element {
  const { exit } = useApp();
  const listRef = useRef<VirtualListRef>(null);
  const [selected, setSelected] = useState(0);

  useInput((input, key) => {
    if (input === "q") exit();
    else if (key.upArrow || input === "k") setSelected((i) => Math.max(0, i - 1));
    else if (key.downArrow || input === "j") setSelected((i) => Math.min(LOGS.length - 1, i + 1));
    else if (input === "g") {
      setSelected(0);
      listRef.current?.scrollToIndex(0, "top");
    } else if (input === "G") {
      setSelected(LOGS.length - 1);
      listRef.current?.scrollToIndex(LOGS.length - 1, "bottom");
    }
  });

  const atTop = selected === 0;
  const atEnd = selected === LOGS.length - 1;

  return (
    <Box flexDirection="column">
      <Box>
        <Text backgroundColor="magenta" color="black" bold>
          {" logship "}
        </Text>
        <Text dimColor> production-api · tail paused · j/k · g/G · q</Text>
      </Box>

      <VirtualList
        items={LOGS}
        selectedIndex={selected}
        height={14}
        keyExtractor={(e) => String(e.id)}
        ref={listRef}
        renderItem={({ item, isSelected }) => (
          <Box>
            <Text inverse={isSelected}>
              <Text dimColor={!isSelected}>{item.time}</Text>
              <Text color={LEVEL_COLOR[item.level]} bold={item.level === "ERROR"}>
                {"  "}
                {item.level.padEnd(5)}
              </Text>
              <Text color="cyan" dimColor={!isSelected}>
                {" "}
                {item.service.padEnd(12)}
              </Text>
              <Text> {item.message}</Text>
            </Text>
          </Box>
        )}
        renderScrollBar={({ offset, visibleCount, totalCount }) => {
          const filled = Math.max(1, Math.round(((offset + visibleCount) / Math.max(1, totalCount)) * GAUGE_WIDTH));
          return (
            <Box>
              <Text color="magenta">{"█".repeat(filled)}</Text>
              <Text dimColor>{"░".repeat(GAUGE_WIDTH - filled)}</Text>
              <Text color="magenta" bold>
                {"  line "}
                {(selected + 1).toLocaleString("en-US")}
              </Text>
              <Text dimColor> / {totalCount.toLocaleString("en-US")} </Text>
              {atTop && (
                <Text backgroundColor="magenta" color="black" bold>
                  {" TOP "}
                </Text>
              )}
              {atEnd && (
                <Text backgroundColor="magenta" color="black" bold>
                  {" END "}
                </Text>
              )}
            </Box>
          );
        }}
      />
    </Box>
  );
}

render(<App />);

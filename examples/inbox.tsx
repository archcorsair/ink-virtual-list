#!/usr/bin/env bun
/**
 * "termmail" — a two-line-per-item inbox showcase for ink-virtual-list (itemHeight={2}).
 * Run with: bun examples/inbox.tsx  ·  keys: ↑/↓ or j/k move, g/G top/bottom, q quit
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

interface Mail {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

// Sender, subject, and preview stay together so every row reads like real mail
const MAILS: Array<[string, string, string]> = [
  ["Vercel", "Deployment ready: docs-site", "Your production deployment is live at archcorsair.github.io…"],
  ["GitHub", "[ink-virtual-list] PR #8 merged", "webbrain-one's pull request was merged into main…"],
  ["Maya Chen", "re: terminal rendering question", "I tried the height budget approach you mentioned and it…"],
  ["npm", "Weekly download report", "ink-virtual-list was downloaded 4,812 times this week, up…"],
  ["Stripe", "Payment received: $49.00", "Invoice #2210 has been paid. View the receipt in your…"],
  ["Linear", "INK-142: flickering on resize", "Status changed from Todo to In Progress by Dana…"],
  ["PagerDuty", "Incident resolved: api-gateway", "The p95 latency alert has recovered after 12 minutes…"],
  ["GitHub", "v0.3.0 published to npm + JSR", "Both registries verified. Release notes are available at…"],
  ["Dana Torres", "PR review: docs gallery", "Left a couple of small comments on the tape files, looks…"],
  ["Grafana", "[Alert] disk usage above 80%", "The volume data-01 on prod-us-east has crossed the warning…"],
  ["Maya Chen", "lunch thursday?", "There's a new ramen place near the office that supposedly…"],
  ["Docker Hub", "Image pushed: app:v2.4.1", "A new image was pushed to your repository by ci-runner…"],
];
const TIMES = ["09:41", "09:12", "08:55", "08:21", "Yesterday", "Yesterday", "Mon", "Sun", "Aug 3"];

function makeInbox(count: number): Mail[] {
  const rand = mulberry32(2024);
  return Array.from({ length: count }, (_, i) => {
    const pick = MAILS[(i * 7 + Math.floor(rand() * 2)) % MAILS.length] ?? MAILS[0];
    const timeBucket = Math.min(Math.floor((i / count) * TIMES.length + rand() * 1.5), TIMES.length - 1);
    return {
      id: i,
      from: pick?.[0] ?? "GitHub",
      subject: pick?.[1] ?? "",
      preview: pick?.[2] ?? "",
      time: TIMES[timeBucket] ?? "Aug 3",
      unread: i < 3 || rand() < 0.25,
    };
  });
}

const INBOX = makeInbox(342);

function App(): React.JSX.Element {
  const { exit } = useApp();
  const listRef = useRef<VirtualListRef>(null);
  const [selected, setSelected] = useState(0);

  useInput((input, key) => {
    if (input === "q") exit();
    else if (key.upArrow || input === "k") setSelected((i) => Math.max(0, i - 1));
    else if (key.downArrow || input === "j") setSelected((i) => Math.min(INBOX.length - 1, i + 1));
    else if (input === "g") {
      setSelected(0);
      listRef.current?.scrollToIndex(0, "top");
    } else if (input === "G") {
      setSelected(INBOX.length - 1);
      listRef.current?.scrollToIndex(INBOX.length - 1, "bottom");
    }
  });

  const unread = INBOX.filter((m) => m.unread).length;

  return (
    <Box flexDirection="column">
      <Box>
        <Text backgroundColor="blue" color="white" bold>
          {" termmail "}
        </Text>
        <Text dimColor>
          {" inbox · "}
          {INBOX.length} messages ·{" "}
        </Text>
        <Text color="blue" bold>
          {unread} unread
        </Text>
      </Box>

      <VirtualList
        items={INBOX}
        selectedIndex={selected}
        height={14}
        itemHeight={2}
        keyExtractor={(m) => String(m.id)}
        ref={listRef}
        renderItem={({ item, isSelected }) => (
          <Box flexDirection="column">
            <Text inverse={isSelected}>
              <Text color={item.unread ? "blue" : undefined} bold={item.unread}>
                {item.unread ? "● " : "  "}
              </Text>
              <Text bold={item.unread}>{item.from.padEnd(14).slice(0, 14)}</Text>
              <Text bold={item.unread}>{item.subject.padEnd(38).slice(0, 38)}</Text>
              <Text dimColor> {item.time.padStart(9)}</Text>
            </Text>
            <Text dimColor>
              {"    "}
              {item.preview.slice(0, 60)}
            </Text>
          </Box>
        )}
      />

      <Text dimColor>{" j/k scroll · g/G jump · q quit"}</Text>
    </Box>
  );
}

render(<App />);

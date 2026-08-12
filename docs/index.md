---
layout: home

hero:
  name: ink-virtual-list
  text: Virtualized lists for terminal UIs
  tagline: Scroll through 100,000 rows in an Ink app — only what's visible ever renders.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Examples
      link: /examples
    - theme: alt
      text: GitHub
      link: https://github.com/archcorsair/ink-virtual-list

features:
  - icon: ⚡
    title: Virtualized rendering
    details: Render lists of any size — only the visible window hits the terminal, so 12 rows cost the same as 12,000.
  - icon: 🎯
    title: Selection-aware scrolling
    details: The viewport follows selectedIndex as users navigate, with imperative jumps (top / center / bottom) via ref.
  - icon: 📐
    title: Stable height budget
    details: Total rendered height never changes while scrolling — overflow indicators reserve their lines, so surrounding UI stays put.
  - icon: 🖥️
    title: Terminal-aware auto-fill
    details: height="auto" fills the available terminal and re-renders on resize, minus the lines you reserve for your own chrome.
  - icon: 🧩
    title: Composable extras
    details: Custom overflow indicators, thresholds, and a renderScrollBar hook for gauges and scrollbars built on viewport state.
  - icon: 🔷
    title: TypeScript-first
    details: Fully generic API with strict types, tested against Ink 6 and Ink 7 in CI on every push.
---

<div style="max-width: 720px; margin: 3rem auto 0;">

![logship, a log explorer built with ink-virtual-list: scrolling 12,847 lines with a position gauge and overflow indicators](/logs.gif)

<p style="text-align: center;"><em>logship — one of five runnable apps in the <a href="./examples">Examples gallery</a>, each recorded straight from the repo.</em></p>

</div>

# ink-virtual-list — Spec & Action Plan (Agent-Ready)

> Goal: harden correctness + ergonomics for Ink virtualization, then improve DX/docs.
> Output is organized into phases with concrete tasks + acceptance criteria.

---

## 0) Definitions & Invariants

### Virtualization invariants
- **Row budget is authoritative**: the virtualization math assumes each rendered item occupies exactly `itemHeight` terminal rows.
- **Viewport**: inclusive `startIndex`, exclusive `endIndex` indices into `items` that are currently rendered.
- **Offset**: topmost visible item index (or row offset, depending on current implementation). Must be **deterministic** given `(selectedIndex, height, itemHeight, alignment)`.

### Core behaviors
- `scrollToIndex(i, alignment?)` must be:
  - deterministic
  - bounds-safe
  - stable across list updates
  - consistent across `height="fixed"` vs `height="auto"`

---

## Phase 1 — Critical correctness & crash-proofing

### 1.1 Standardize ref API (React conventions)
**Problem**: nonstandard “ref prop” pattern complicates integration and typing.

**Tasks**
- Refactor `VirtualList` to use `React.forwardRef`.
- Expose imperative API via `useImperativeHandle`.
- Update README and examples to use `ref={listRef}`.

**Acceptance criteria**
- Existing imperative example works unchanged except for ref wiring.
- Types:
  - `const ref = useRef<VirtualListHandle>(null)`
  - `ref.current?.scrollToIndex(...)` is typed.

---

### 1.2 Enforce layout constraints to prevent wrap blowout
**Problem**: Ink `Text` wraps by default; wrapped content breaks virtualization window.

**Tasks**
- Wrap each rendered item in a fixed-height container:
  - `Box height={itemHeight} overflow="hidden"` (or equivalent).
- Ensure this wrapper is applied uniformly and cannot be accidentally bypassed.

**Acceptance criteria**
- Long strings that would normally wrap do **not** change overall list height.
- Visual overflow is clipped, not reflowed.

---

### 1.3 TTY/CI safety for terminal sizing
**Problem**: in CI or non-TTY stdout, `process.stdout.rows/columns` + resize events may be undefined.

**Tasks**
- Guard terminal sizing hook:
  - If `!process.stdout.isTTY`, use defaults (e.g. 80x24) and do not attach listeners.
- Add tests for non-TTY environment (mock `isTTY=false`).

**Acceptance criteria**
- No crashes when running tests in CI.
- Size hook returns stable defaults in non-TTY mode.

---

### 1.4 Bounds-safe scrolling APIs
**Problem**: `scrollToIndex()` and internal calculations may accept invalid indices.

**Tasks**
- Define behavior for invalid index:
  - Option A (recommended): **clamp** to `[0, items.length - 1]`.
  - Option B: throw `RangeError` in dev, clamp in prod.
- Implement for:
  - imperative `scrollToIndex`
  - internal `selectedIndex`-driven scroll logic

**Acceptance criteria**
- Calling `scrollToIndex(-1)` scrolls to index `0`.
- Calling `scrollToIndex(items.length)` scrolls to last index.
- Empty list: scrolling is a no-op and does not throw.

---

## Phase 2 — Performance & deterministic rendering

### 2.1 Eliminate “double render” selection sync
**Problem**: syncing `selectedIndex` to scroll state via `useEffect` causes extra render.

**Tasks**
- Derive the required `viewportOffset` during render when possible.
- Only use state updates when needed (e.g., terminal resize or explicit imperative scroll).

**Acceptance criteria**
- Changing `selectedIndex` results in a single render commit for the correct viewport.
- No visible flicker during fast selection changes.

---

### 2.2 `onViewportChange` semantics + frequency
**Problem**: callback may fire too often or unpredictably.

**Tasks**
- Document exact trigger points:
  - on mount?
  - on resize?
  - on scroll/selection change?
  - on `items` change?
- Ensure callback only fires when viewport tuple changes:
  - `(startIndex, endIndex, offset, visibleCount)` changed.
- Add memoization guidance in README.

**Acceptance criteria**
- Tests assert `onViewportChange` is called only on viewport changes.
- README includes `useCallback` guidance.

---

## Phase 3 — Key stability & item measurement contracts

### 3.1 Key safety policy
**Problem**: defaulting to index keys breaks state association when items mutate.

**Tasks**
- Implement safer default key strategy:
  - if item is `string|number`, default to `String(item)`
  - else default to index but warn in dev
- Add dev warning when:
  - `keyExtractor` is missing AND items are objects
  - duplicate keys are detected (best-effort in dev)

**Acceptance criteria**
- Docs explain why `keyExtractor` matters.
- Dev warning appears for object lists without `keyExtractor`.

---

### 3.2 `itemHeight` validation + explicit contract
**Problem**: virtualization assumes fixed row height; missing/invalid `itemHeight` yields incorrect render.

**Tasks**
- Runtime validation:
  - `itemHeight` must be a positive integer.
- If `itemHeight` is omitted and items are potentially variable height:
  - log a dev warning stating assumption of uniform height.
- Add README note clarifying: variable height items are not supported (yet).

**Acceptance criteria**
- Invalid `itemHeight` throws immediately.
- README contains a prominent note about uniform-height requirement.

---

## Phase 4 — API polish & UX features

### 4.1 Document scroll alignment precisely
**Tasks**
- Define `alignment` options and exact math:
  - `top`, `center`, `bottom`, `auto`
- Add JSDoc on `scrollToIndex`.
- Add tests for each alignment.

**Acceptance criteria**
- A reader can predict final viewport for each alignment.

---

### 4.2 Overflow indicator threshold
**Tasks**
- Add prop: `overflowIndicatorThreshold?: number` (default `1`).
- Only render top/bottom overflow indicators if hidden count `>= threshold`.

**Acceptance criteria**
- With threshold 5, “▲ 3 more” does not render.

---

### 4.3 Controlled vs uncontrolled selection
**Tasks**
- Clarify: `selectedIndex` is controlled.
- Add `defaultSelectedIndex?: number` for uncontrolled mode (optional but recommended).
- Provide example patterns in README.

**Acceptance criteria**
- Users can choose controlled or uncontrolled selection with clear semantics.

---

### 4.4 Keyboard navigation guidance (and optional helper)
**Tasks**
- Add README section showing `useInput` wiring for:
  - Up/Down, PageUp/PageDown, Home/End
- (Optional) Provide small helper hook `useListNavigation` that emits next selected index.

**Acceptance criteria**
- Copy/paste example yields a usable navigable list.

---

## Phase 5 — Refactoring for extensibility

### 5.1 Extract headless `useVirtualList` hook
**Tasks**
- Move virtualization math + state into `src/hooks/useVirtualList.ts`.
- `VirtualList.tsx` becomes a thin renderer around the hook.
- Export `useVirtualList` + `VirtualListProps` from entrypoint.

**Acceptance criteria**
- Existing component behavior unchanged.
- New hook documented with example.

---

### 5.2 Variable-height items roadmap doc (no implementation yet)
**Tasks**
- Add `docs/variable-height-items.md` describing options:
  - `estimateItemHeight`
  - `itemSize(index|item)` function
  - measurement callback / caching
- Include performance tradeoffs and potential breaking changes.

**Acceptance criteria**
- Clear future plan exists; does not block current fixed-height correctness.

---

## Testing checklist (add/expand)

### Must-have tests
- Empty list render and imperative calls are no-ops.
- `scrollToIndex` bounds clamping.
- Alignment behaviors (`top/center/bottom/auto`).
- `onViewportChange` called only on meaningful viewport changes.
- Terminal resize changes viewport appropriately.
- Non-TTY safety (no crash).
- Key policy warnings for object items without `keyExtractor`.

---

## Documentation deliverables
- README:
  - Performance Best Practices (memoize callbacks, keyExtractor, renderItem)
  - Accessibility (keyboard nav patterns; selection indicators)
  - Clear API section for:
    - `height` modes + `reservedLines`
    - `itemHeight` contract
    - `scrollToIndex` alignment
    - overflow indicators + threshold
- Exported types:
  - `VirtualListProps`
  - `VirtualListHandle` (imperative API)
  - `Viewport` type

---

## Suggested implementation order
1. Layout constraint wrapper (wrap blowout fix)
2. Non-TTY guard
3. Bounds-safe scroll
4. ForwardRef + imperative handle
5. onViewportChange semantics + tests
6. Key policy
7. Alignment docs/tests
8. Threshold + selection mode
9. Hook extraction + roadmap doc

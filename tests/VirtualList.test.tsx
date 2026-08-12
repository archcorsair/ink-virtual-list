import { describe, expect, test } from "bun:test";
import { Text } from "ink";
import { render } from "ink-testing-library";
import { VirtualList, validateItemHeight } from "../src";

describe("VirtualList", () => {
  test("renders visible items", () => {
    const items = ["Item 0", "Item 1", "Item 2", "Item 3", "Item 4"];
    const { lastFrame } = render(
      <VirtualList
        items={items}
        height={3}
        showOverflowIndicators={false}
        renderItem={({ item }) => <Text>{item}</Text>}
      />,
    );

    const frame = lastFrame() ?? "";
    expect(frame).toContain("Item 0");
    expect(frame).toContain("Item 1");
    expect(frame).toContain("Item 2");
    expect(frame).not.toContain("Item 3");
  });

  test("clips items to itemHeight with overflow hidden", () => {
    const items = ["Short", "This is a very long item that would wrap"];
    const { lastFrame } = render(
      <VirtualList
        items={items}
        height={2}
        itemHeight={1}
        showOverflowIndicators={false}
        renderItem={({ item }) => <Text>{item}</Text>}
      />,
    );

    const frame = lastFrame() ?? "";
    // Both items should be on separate lines, not wrapped
    const lines = frame.split("\n").filter(Boolean);
    expect(lines.length).toBeLessThanOrEqual(2);
  });

  test("hides overflow indicators below threshold", () => {
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
    const { lastFrame } = render(
      <VirtualList
        items={items}
        height={5}
        showOverflowIndicators={true}
        overflowIndicatorThreshold={3}
        renderItem={({ item }) => <Text>{item}</Text>}
      />,
    );

    const frame = lastFrame() ?? "";
    // With height=5, indicators take 2 lines, 3 items visible
    // overflowTop = 0, overflowBottom = 7
    // Threshold is 3, so bottom should show (7 >= 3), top renders a blank placeholder (0 < 3)
    expect(frame).toContain("▼");
    expect(frame).not.toContain("▲");
    // The hidden top indicator still occupies its line, so total height stays at `height`
    expect(frame.split("\n").length).toBe(5);
  });

  test("renders a constant number of lines at every scroll position", () => {
    const items = Array.from({ length: 50 }, (_, i) => `Item ${i}`);
    const renderAt = (selectedIndex: number) => {
      const { lastFrame } = render(
        <VirtualList
          items={items}
          height={8}
          selectedIndex={selectedIndex}
          renderItem={({ item }) => <Text>{item}</Text>}
        />,
      );
      return (lastFrame() ?? "").split("\n").length;
    };

    // Top (no top overflow), middle (both), bottom (no bottom overflow)
    const top = renderAt(0);
    const middle = renderAt(25);
    const bottom = renderAt(items.length - 1);

    expect(top).toBe(8);
    expect(middle).toBe(8);
    expect(bottom).toBe(8);
  });

  test("renders an item at height=2 with indicators enabled by default", () => {
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
    const { lastFrame } = render(
      <VirtualList items={items} height={2} renderItem={({ item }) => <Text>{item}</Text>} />,
    );

    const frame = lastFrame() ?? "";
    // height=2 leaves no room for indicators plus an item, so indicators are dropped
    expect(frame).toContain("Item 0");
  });

  test("renders an item at height=1 with indicators enabled by default", () => {
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
    const { lastFrame } = render(
      <VirtualList items={items} height={1} renderItem={({ item }) => <Text>{item}</Text>} />,
    );

    const frame = lastFrame() ?? "";
    expect(frame).toContain("Item 0");
    expect(frame).not.toContain("▼");
  });

  test("renders nothing for an empty list", () => {
    const { lastFrame } = render(<VirtualList items={[]} height={5} renderItem={({ item }) => <Text>{item}</Text>} />);

    expect(lastFrame() ?? "").not.toContain("more");
  });
});

describe("VirtualList anchor='bottom'", () => {
  test("shows last items when anchor='bottom' without selectedIndex", () => {
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
    const { lastFrame } = render(
      <VirtualList
        items={items}
        height={5}
        anchor="bottom"
        showOverflowIndicators={false}
        renderItem={({ item, isSelected }) => (
          <Text>
            {isSelected ? "> " : "  "}
            {item}
          </Text>
        )}
      />,
    );

    const frame = lastFrame() ?? "";
    expect(frame).toContain("Item 5");
    expect(frame).toContain("Item 6");
    expect(frame).toContain("Item 7");
    expect(frame).toContain("Item 8");
    expect(frame).toContain("> Item 9");
    expect(frame).not.toContain("Item 0");
    expect(frame).not.toContain("Item 4");
  });

  test("follows selection when anchor='bottom' with explicit selectedIndex", () => {
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
    const { lastFrame } = render(
      <VirtualList
        items={items}
        height={5}
        anchor="bottom"
        selectedIndex={2}
        showOverflowIndicators={false}
        renderItem={({ item }) => <Text>{item}</Text>}
      />,
    );

    const frame = lastFrame() ?? "";
    // selectedIndex=2 should be visible, starting from top
    expect(frame).toContain("Item 0");
    expect(frame).toContain("Item 2");
    expect(frame).not.toContain("Item 9");
  });

  test("stays anchored at bottom when items grow", () => {
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
    const { lastFrame, rerender } = render(
      <VirtualList
        items={items}
        height={5}
        anchor="bottom"
        showOverflowIndicators={false}
        renderItem={({ item }) => <Text>{item}</Text>}
      />,
    );

    // Verify initially at bottom
    let frame = lastFrame() ?? "";
    expect(frame).toContain("Item 9");
    expect(frame).not.toContain("Item 0");

    // Add more items at the end
    const moreItems = Array.from({ length: 15 }, (_, i) => `Item ${i}`);
    rerender(
      <VirtualList
        items={moreItems}
        height={5}
        anchor="bottom"
        showOverflowIndicators={false}
        renderItem={({ item }) => <Text>{item}</Text>}
      />,
    );

    frame = lastFrame() ?? "";
    expect(frame).toContain("Item 10");
    expect(frame).toContain("Item 14");
    expect(frame).not.toContain("Item 0");
  });
});

describe("validateItemHeight", () => {
  test("throws on itemHeight of 0", () => {
    expect(() => validateItemHeight(0)).toThrow("itemHeight must be a positive integer");
  });

  test("throws on negative itemHeight", () => {
    expect(() => validateItemHeight(-1)).toThrow("itemHeight must be a positive integer");
  });

  test("throws on non-integer itemHeight", () => {
    expect(() => validateItemHeight(1.5)).toThrow("itemHeight must be a positive integer");
  });

  test("accepts valid positive integers", () => {
    expect(() => validateItemHeight(1)).not.toThrow();
    expect(() => validateItemHeight(5)).not.toThrow();
    expect(() => validateItemHeight(100)).not.toThrow();
  });
});

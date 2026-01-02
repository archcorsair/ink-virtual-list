import { describe, expect, test } from "bun:test";
import { Text } from "ink";
import { render } from "ink-testing-library";
import { VirtualList } from "../src";

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
});

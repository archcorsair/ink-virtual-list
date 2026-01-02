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
});

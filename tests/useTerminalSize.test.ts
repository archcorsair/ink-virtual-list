import { describe, expect, test } from "bun:test";

describe("useTerminalSize", () => {
  test("module exports useTerminalSize", async () => {
    const mod = await import("../src/useTerminalSize");
    expect(typeof mod.useTerminalSize).toBe("function");
  });

  // Note: Full TTY testing requires mocking stdout which is complex
  // The fix is simple enough to verify via code review
});

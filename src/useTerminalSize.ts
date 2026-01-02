import { useStdout } from "ink";
import { useEffect, useState } from "react";

/**
 * Represents the terminal dimensions.
 */
export interface TerminalSize {
  /** Number of rows (lines) in the terminal */
  rows: number;
  /** Number of columns (characters) in the terminal */
  columns: number;
}

const DEFAULT_ROWS = 24;
const DEFAULT_COLUMNS = 80;

/**
 * Hook that returns the current terminal size and updates on resize.
 * Uses Ink's stdout to detect terminal dimensions.
 */
export function useTerminalSize(): TerminalSize {
  const { stdout } = useStdout();
  const [size, setSize] = useState<TerminalSize>({
    rows: stdout.rows ?? DEFAULT_ROWS,
    columns: stdout.columns ?? DEFAULT_COLUMNS,
  });

  useEffect(() => {
    // Skip resize listener in non-TTY environments (CI, pipes)
    if (!stdout.isTTY) {
      return;
    }

    const handleResize = () => {
      setSize({
        rows: stdout.rows ?? DEFAULT_ROWS,
        columns: stdout.columns ?? DEFAULT_COLUMNS,
      });
    };

    stdout.on("resize", handleResize);
    return () => {
      stdout.off("resize", handleResize);
    };
  }, [stdout]);

  return size;
}

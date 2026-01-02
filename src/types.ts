import type { ReactNode } from "react";

/**
 * Props passed to the renderItem function for each visible item.
 */
export interface RenderItemProps<T> {
  /** The item data from the items array */
  item: T;
  /** The index of this item in the full items array */
  index: number;
  /** Whether this item is currently selected */
  isSelected: boolean;
}

/**
 * Represents the current viewport state of the virtual list.
 */
export interface ViewportState {
  /** Number of items scrolled past (hidden above viewport) */
  offset: number;
  /** Number of items currently visible in the viewport */
  visibleCount: number;
  /** Total number of items in the list */
  totalCount: number;
}

/**
 * Props for the VirtualList component.
 */
export interface VirtualListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Render function for each visible item */
  renderItem: (props: RenderItemProps<T>) => ReactNode;

  /** Index of the currently selected item (default: 0) */
  selectedIndex?: number;
  /** Function to extract a unique key for each item */
  keyExtractor?: (item: T, index: number) => string;

  /** Fixed height in lines, or "auto" to fill available terminal space (default: 10) */
  height?: number | "auto";
  /** Lines to reserve when using height="auto" (e.g., for headers/footers) */
  reservedLines?: number;
  /** Height of each item in lines (default: 1) */
  itemHeight?: number;

  /** Whether to show "N more" indicators when items overflow (default: true) */
  showOverflowIndicators?: boolean;
  /** Minimum overflow count before showing indicators (default: 1) */
  overflowIndicatorThreshold?: number;
  /** Custom renderer for the top overflow indicator */
  renderOverflowTop?: (count: number) => ReactNode;
  /** Custom renderer for the bottom overflow indicator */
  renderOverflowBottom?: (count: number) => ReactNode;

  /** Custom renderer for a scrollbar (receives viewport state) */
  renderScrollBar?: (viewport: ViewportState) => ReactNode;

  /** Callback fired when the viewport changes */
  onViewportChange?: (viewport: ViewportState) => void;
}

/**
 * Imperative handle methods exposed via ref.
 */
export interface VirtualListRef {
  /** Scroll to bring a specific index into view */
  scrollToIndex: (index: number, alignment?: "auto" | "top" | "center" | "bottom") => void;
  /** Get the current viewport state */
  getViewport: () => ViewportState;
  /** Force recalculation of viewport dimensions */
  remeasure: () => void;
}

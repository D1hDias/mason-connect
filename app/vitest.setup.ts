import '@testing-library/jest-dom/vitest';

// Screens render TrendLineChart/CategoryBarChart from the design system, whose
// Recharts ResponsiveContainer needs ResizeObserver, which jsdom does not implement.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = global.ResizeObserver ?? (ResizeObserverMock as unknown as typeof ResizeObserver);

import '@testing-library/jest-dom/vitest';

// Recharts' ResponsiveContainer needs ResizeObserver, which jsdom does not implement.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error -- jsdom has no ResizeObserver
global.ResizeObserver = global.ResizeObserver ?? ResizeObserverMock;

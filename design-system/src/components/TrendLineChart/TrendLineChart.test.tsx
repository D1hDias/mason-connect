import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TrendLineChart } from './TrendLineChart';

const DATA = [
  { label: 'Fev', value: 38 },
  { label: 'Mar', value: 55 },
];

beforeEach(() => {
  // recharts@2.15's ResponsiveContainer measures its container via
  // getBoundingClientRect() (not offsetWidth/offsetHeight — see
  // node_modules/recharts/es6/component/ResponsiveContainer.js), and jsdom's
  // default getBoundingClientRect() returns an all-zero DOMRect, so the SVG
  // never renders unless we mock it.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 400,
    height: 210,
    top: 0,
    left: 0,
    bottom: 210,
    right: 400,
    x: 0,
    y: 0,
    toJSON: () => {},
  });
});

describe('TrendLineChart', () => {
  it('renders an SVG line chart for the given data', () => {
    const { container } = render(<TrendLineChart data={DATA} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(DATA.length);
  });
});

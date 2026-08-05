import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { CategoryBarChart } from './CategoryBarChart';

const DATA = [
  { label: 'Davi', value: 7 },
  { label: 'Luetil', value: 6 },
];

beforeEach(() => {
  // recharts@2.15's ResponsiveContainer measures its container via
  // getBoundingClientRect() (not offsetWidth/offsetHeight — see
  // node_modules/recharts/es6/component/ResponsiveContainer.js), and jsdom's
  // default getBoundingClientRect() returns an all-zero DOMRect, so the SVG
  // never renders unless we mock it.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 400,
    height: 230,
    top: 0,
    left: 0,
    bottom: 230,
    right: 400,
    x: 0,
    y: 0,
    toJSON: () => {},
  });
});

describe('CategoryBarChart', () => {
  it('renders an SVG bar chart with one bar per datum', () => {
    const { container } = render(<CategoryBarChart data={DATA} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(DATA.length);
  });
});

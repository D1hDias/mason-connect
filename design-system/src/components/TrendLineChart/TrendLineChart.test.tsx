import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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

  // <Line>'s dots stay unrendered until react-smooth's mount animation
  // reports isAnimationFinished (recharts/es6/cartesian/Line.js:
  // `if (isAnimationActive && !this.state.isAnimationFinished) return null`
  // in renderDots()). react-smooth drives that animation with
  // requestAnimationFrame (react-smooth/es6/configUpdate.js,
  // setRafTimeout.js). Vitest's jsdom pool defaults to
  // `pretendToBeVisual: true`, under which jsdom *does* implement
  // requestAnimationFrame — it isn't missing, it just fires asynchronously
  // relative to Testing Library's synchronous render(). Stub it to invoke
  // its callback synchronously with a strictly increasing, non-zero
  // timestamp so the whole start -> interpolate -> onAnimationEnd sequence
  // (including the animationBegin/animationDuration delay steps, which are
  // also implemented via requestAnimationFrame) resolves before render()
  // returns — without changing the shipped component's animation behavior.
  let now = 0;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    now += 10000;
    cb(now);
    return 0;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TrendLineChart', () => {
  it('renders an SVG line chart for the given data', () => {
    const { container } = render(<TrendLineChart data={DATA} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(DATA.length);
  });
});

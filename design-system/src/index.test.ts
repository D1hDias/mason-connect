import { describe, it, expect } from 'vitest';
import * as DesignSystem from './index';

describe('public API', () => {
  it('exports every v1 component', () => {
    const expectedExports = [
      'Button', 'Badge', 'Card', 'SectionTitle', 'Stat', 'Avatar',
      'Input', 'Select', 'FilterTabs', 'List', 'ListRow', 'ProgressBar',
      'EmptyState', 'BottomNav', 'NavTab', 'TrendLineChart', 'CategoryBarChart',
    ];
    for (const name of expectedExports) {
      expect(DesignSystem).toHaveProperty(name);
    }
  });

  it('exports the brand color tokens', () => {
    expect(DesignSystem.brandColors.brown).toBe('#855023');
  });
});

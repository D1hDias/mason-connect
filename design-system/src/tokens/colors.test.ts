import { describe, it, expect } from 'vitest';
import { brandColors, statusColors, financeColors } from './colors';

describe('brandColors', () => {
  it('matches the official Mason Connect brand palette', () => {
    expect(brandColors.brown).toBe('#855023');
    expect(brandColors.gold).toBe('#CAAA67');
    // The prototype used #F5EFE3 for cream; the official token value wins (design doc §6).
    expect(brandColors.cream).toBe('#F7F1E4');
  });
});

describe('statusColors', () => {
  it('defines all five semantic status variants', () => {
    expect(Object.keys(statusColors).sort()).toEqual(
      ['accent', 'critical', 'neutral', 'success', 'warning'].sort()
    );
  });
});

describe('financeColors', () => {
  it('defines positive and negative monetary tints', () => {
    expect(financeColors.positive).toBe('#2F6B3D');
    expect(financeColors.negative).toBe('#8A2B2B');
  });
});

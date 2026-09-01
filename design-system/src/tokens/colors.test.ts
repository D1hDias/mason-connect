import { describe, it, expect } from 'vitest';
import { brandColors, statusColors, financeColors, presenceColors } from './colors';

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

describe('presenceColors', () => {
  it('defines all four presence states with bg/fg pairs', () => {
    expect(Object.keys(presenceColors).sort()).toEqual(
      ['falta', 'justificada', 'presente', 'representado'].sort()
    );
  });

  it('has correct hex values for presente state', () => {
    expect(presenceColors.presente.bg).toBe('#e4ebd9');
    expect(presenceColors.presente.fg).toBe('#2f6b3d');
  });

  it('has correct hex values for falta state', () => {
    expect(presenceColors.falta.bg).toBe('#f6e3d9');
    expect(presenceColors.falta.fg).toBe('#8a2b2b');
  });

  it('has correct hex values for justificada state', () => {
    expect(presenceColors.justificada.bg).toBe('#f3e4c8');
    expect(presenceColors.justificada.fg).toBe('#8a6a1f');
  });

  it('has correct hex values for representado state', () => {
    expect(presenceColors.representado.bg).toBe('#f0e6cf');
    expect(presenceColors.representado.fg).toBe('#8a6a3f');
  });
});

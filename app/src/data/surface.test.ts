import { describe, expect, it } from 'vitest';
import { abbreviateName, filterForSurface } from './surface';

interface Item {
  label: string;
  desktopOnly?: boolean;
}

describe('filterForSurface', () => {
  const items: Item[] = [
    { label: 'a' },
    { label: 'b', desktopOnly: true },
    { label: 'c' },
    { label: 'd', desktopOnly: false },
  ];

  it('returns every item, including desktopOnly ones, when isDesktop is true', () => {
    expect(filterForSurface(items, true)).toEqual(items);
  });

  it('drops items marked desktopOnly when isDesktop is false', () => {
    expect(filterForSurface(items, false)).toEqual([
      { label: 'a' },
      { label: 'c' },
      { label: 'd', desktopOnly: false },
    ]);
  });

  it('keeps items with no desktopOnly field regardless of surface', () => {
    const noFlag: Item[] = [{ label: 'a' }, { label: 'b' }];
    expect(filterForSurface(noFlag, false)).toEqual(noFlag);
    expect(filterForSurface(noFlag, true)).toEqual(noFlag);
  });

  it('returns an empty array unchanged', () => {
    expect(filterForSurface([], false)).toEqual([]);
    expect(filterForSurface([], true)).toEqual([]);
  });

  it('does not mutate the input array', () => {
    const original = [...items];
    filterForSurface(items, false);
    expect(items).toEqual(original);
  });
});

describe('abbreviateName', () => {
  it('abbreviates a two-part name to first name + last initial', () => {
    expect(abbreviateName('Leonardo Almeida')).toBe('Leonardo A.');
    expect(abbreviateName('Jackson Pereira')).toBe('Jackson P.');
    expect(abbreviateName('Camila Rocha')).toBe('Camila R.');
    expect(abbreviateName('Eduardo Matos')).toBe('Eduardo M.');
    expect(abbreviateName('Davi Lopes')).toBe('Davi L.');
  });

  it('uses the last name for the initial when there are middle names', () => {
    expect(abbreviateName('Maria da Silva Santos')).toBe('Maria S.');
  });

  it('returns a single-word name unchanged', () => {
    expect(abbreviateName('Madonna')).toBe('Madonna');
  });

  it('trims and collapses surrounding/extra whitespace', () => {
    expect(abbreviateName('  Camila   Rocha  ')).toBe('Camila R.');
  });

  it('returns an empty string for empty input', () => {
    expect(abbreviateName('')).toBe('');
  });
});

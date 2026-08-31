import { describe, it, expect } from 'vitest';
import { fontFamilies } from './typography';

describe('fontFamilies', () => {
  it('defines all four font family stacks', () => {
    expect(Object.keys(fontFamilies).sort()).toEqual(
      ['body', 'deck', 'heading', 'tabular'].sort()
    );
  });

  it('heading uses Georgia serif', () => {
    expect(fontFamilies.heading).toContain('Georgia');
  });

  it('body uses Verdana sans-serif stack', () => {
    expect(fontFamilies.body).toContain('Verdana');
  });

  it('deck uses Calibri sans-serif stack', () => {
    expect(fontFamilies.deck).toContain('Calibri');
  });

  it('tabular uses IBM Plex Sans for numeric alignment', () => {
    expect(fontFamilies.tabular).toContain('IBM Plex Sans');
    expect(fontFamilies.tabular).toContain('Verdana');
  });
});

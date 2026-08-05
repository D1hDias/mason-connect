import { describe, it, expect } from 'vitest';
import { VERSION } from './index';

describe('package scaffolding', () => {
  it('exposes a version constant', () => {
    expect(VERSION).toBe('0.1.0');
  });
});

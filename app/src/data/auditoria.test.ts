import { describe, expect, it } from 'vitest';
import { auditoria } from './auditoria';

describe('auditoria', () => {
  it('should export an array with exactly 3 entries', () => {
    expect(auditoria).toHaveLength(3);
  });

  it('should have valid shape for each entry', () => {
    auditoria.forEach((item) => {
      expect(item).toHaveProperty('key');
      expect(item).toHaveProperty('acao');
      expect(item).toHaveProperty('quando');
    });
  });

  it('should have correct types for all fields', () => {
    auditoria.forEach((item) => {
      expect(typeof item.key).toBe('number');
      expect(typeof item.acao).toBe('string');
      expect(typeof item.quando).toBe('string');
    });
  });

  it('should have non-empty strings for acao and quando', () => {
    auditoria.forEach((item) => {
      expect(item.acao.length).toBeGreaterThan(0);
      expect(item.quando.length).toBeGreaterThan(0);
    });
  });

  it('should have unique keys', () => {
    const keys = auditoria.map((item) => item.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(auditoria.length);
  });
});

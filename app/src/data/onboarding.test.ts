import { describe, expect, it } from 'vitest';
import { emOnboarding } from './onboarding';

describe('emOnboarding', () => {
  it('should export an array with exactly 4 entries', () => {
    expect(emOnboarding).toHaveLength(4);
  });

  it('should have valid shape for each entry', () => {
    emOnboarding.forEach((item) => {
      expect(item).toHaveProperty('nome');
      expect(item).toHaveProperty('dias');
      expect(item).toHaveProperty('etapa');
    });
  });

  it('should have correct types for all fields', () => {
    emOnboarding.forEach((item) => {
      expect(typeof item.nome).toBe('string');
      expect(typeof item.dias).toBe('number');
      expect(typeof item.etapa).toBe('string');
    });
  });

  it('should have non-empty strings for nome and etapa', () => {
    emOnboarding.forEach((item) => {
      expect(item.nome.length).toBeGreaterThan(0);
      expect(item.etapa.length).toBeGreaterThan(0);
    });
  });

  it('should have positive dias values', () => {
    emOnboarding.forEach((item) => {
      expect(item.dias).toBeGreaterThan(0);
    });
  });

  it('should have unique nomes', () => {
    const nomes = emOnboarding.map((item) => item.nome);
    const uniqueNomes = new Set(nomes);
    expect(uniqueNomes.size).toBe(emOnboarding.length);
  });
});

import { describe, expect, it } from 'vitest';
import { tiposConduta, ocorrencias } from './conduta';

describe('tiposConduta', () => {
  it('should export an array with exactly 6 types', () => {
    expect(tiposConduta).toHaveLength(6);
  });

  it('should have valid shape for each type', () => {
    tiposConduta.forEach((item) => {
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });

  it('should have correct types for all fields', () => {
    tiposConduta.forEach((item) => {
      expect(typeof item.label).toBe('string');
      expect(typeof item.value).toBe('string');
    });
  });

  it('should have non-empty label and value', () => {
    tiposConduta.forEach((item) => {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.value.length).toBeGreaterThan(0);
    });
  });

  it('should have unique values', () => {
    const values = tiposConduta.map((item) => item.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(tiposConduta.length);
  });
});

describe('ocorrencias', () => {
  it('should export an array with exactly 4 entries', () => {
    expect(ocorrencias).toHaveLength(4);
  });

  it('should have valid shape for each ocorrencia', () => {
    ocorrencias.forEach((item) => {
      expect(item).toHaveProperty('key');
      expect(item).toHaveProperty('membro');
      expect(item).toHaveProperty('tipo');
      expect(item).toHaveProperty('descricao');
      expect(item).toHaveProperty('rodape');
      expect(item).toHaveProperty('seloTom');
      expect(item).toHaveProperty('seloTexto');
    });
  });

  it('should have correct types for all fields', () => {
    ocorrencias.forEach((item) => {
      expect(typeof item.key).toBe('number');
      expect(typeof item.membro).toBe('string');
      expect(typeof item.tipo).toBe('string');
      expect(typeof item.descricao).toBe('string');
      expect(typeof item.rodape).toBe('string');
      expect(typeof item.seloTom).toBe('string');
      expect(typeof item.seloTexto).toBe('string');
    });
  });

  it('should have non-empty strings for all text fields', () => {
    ocorrencias.forEach((item) => {
      expect(item.membro.length).toBeGreaterThan(0);
      expect(item.tipo.length).toBeGreaterThan(0);
      expect(item.descricao.length).toBeGreaterThan(0);
      expect(item.rodape.length).toBeGreaterThan(0);
      expect(item.seloTexto.length).toBeGreaterThan(0);
    });
  });

  it('should have valid seloTom values', () => {
    const validToms = ['critical', 'neutral', 'warning'];
    ocorrencias.forEach((item) => {
      expect(validToms).toContain(item.seloTom);
    });
  });

  it('should have unique keys', () => {
    const keys = ocorrencias.map((item) => item.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(ocorrencias.length);
  });
});

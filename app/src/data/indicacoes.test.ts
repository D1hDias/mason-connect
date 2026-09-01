import { describe, expect, it } from 'vitest';
import { indicacoes } from './indicacoes';

describe('indicacoes', () => {
  it('should export an array with exactly 5 entries', () => {
    expect(indicacoes).toHaveLength(5);
  });

  it('should have valid shape for each entry', () => {
    indicacoes.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('indicador');
      expect(item).toHaveProperty('destinatario');
      expect(item).toHaveProperty('descricao');
      expect(item).toHaveProperty('estagio');
      expect(item).toHaveProperty('dias');
      expect(item).toHaveProperty('valor');
    });
  });

  it('should have correct types for required fields', () => {
    indicacoes.forEach((item) => {
      expect(typeof item.id).toBe('number');
      expect(typeof item.indicador).toBe('string');
      expect(typeof item.destinatario).toBe('string');
      expect(typeof item.descricao).toBe('string');
      expect(typeof item.estagio).toBe('string');
      expect(typeof item.dias).toBe('number');
      expect(item.valor === null || typeof item.valor === 'number').toBe(true);
    });
  });

  it('should have one entry of each estagio type', () => {
    const estagios = indicacoes.map((item) => item.estagio);
    expect(estagios).toContain('registrada');
    expect(estagios).toContain('contato');
    expect(estagios).toContain('andamento');
    expect(estagios).toContain('fechado');
    expect(estagios).toContain('perdido');
  });

  it('should have motivo field only for lost indicacao', () => {
    const perdido = indicacoes.find((item) => item.estagio === 'perdido');
    expect(perdido).toBeDefined();
    expect(perdido?.motivo).toBeDefined();

    const naoPeridos = indicacoes.filter((item) => item.estagio !== 'perdido');
    naoPeridos.forEach((item) => {
      expect(item.motivo).toBeUndefined();
    });
  });

  it('should have positive dias values', () => {
    indicacoes.forEach((item) => {
      expect(item.dias).toBeGreaterThan(0);
    });
  });

  it('should have valor null or positive number', () => {
    indicacoes.forEach((item) => {
      if (item.valor !== null) {
        expect(item.valor).toBeGreaterThan(0);
      }
    });
  });
});

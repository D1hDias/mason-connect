import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FinanceiroScreen } from './FinanceiroScreen';
import { AppOverlaysProvider } from '../../shell/overlays/AppOverlaysProvider';

afterEach(() => {
  cleanup();
});

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/financeiro']}>
      <AppOverlaysProvider>
        <FinanceiroScreen />
      </AppOverlaysProvider>
    </MemoryRouter>,
  );
}

describe('FinanceiroScreen', () => {
  it('renders the mobile-visible KPI stats with the exact brief values and hints', () => {
    renderScreen();
    expect(screen.getByText('R$ 8.420')).toBeInTheDocument();
    expect(screen.getByText('após o coffee break')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.300')).toBeInTheDocument();
    expect(screen.getByText('2 membros')).toBeInTheDocument();
  });

  it('wraps only the 3rd KPI Stat ("Recebido no mês") hidden below the lg breakpoint (not md)', () => {
    renderScreen();
    expect(screen.getByText('R$ 8.420').closest('.hidden.lg\\:block')).toBeNull();
    const recebido = screen.getByText('22 pagantes');
    expect(recebido.closest('.hidden.lg\\:block')).not.toBeNull();
    // Never `hidden md:block` for this KPI — the brief is explicit it's an `lg` cutoff.
    expect(recebido.closest('.hidden.md\\:block')).toBeNull();
  });

  it('renders "Mensalidades 07/2026" as a positive (+) mc-num value in finance-positive, in both lists', () => {
    renderScreen();
    const values = screen.getAllByText('+ R$ 14.300');
    expect(values).toHaveLength(2); // mobile + desktop extrato lists
    for (const value of values) {
      expect(value).toHaveClass('mc-num', 'text-finance-positive');
      expect(value.textContent?.startsWith('+')).toBe(true);
    }
  });

  it('renders "Coffee break — junho" as a negative (−, U+2212) mc-num value in finance-negative, in both lists', () => {
    renderScreen();
    const values = screen.getAllByText('− R$ 380');
    expect(values).toHaveLength(2);
    for (const value of values) {
      expect(value).toHaveClass('mc-num', 'text-finance-negative');
      expect(value.textContent?.[0]).toBe('−');
      expect(value.textContent?.[0]).not.toBe('-'); // never a plain hyphen
    }
  });

  it('renders "Taxa de adesão" as a positive (+) mc-num value in finance-positive, in both lists', () => {
    renderScreen();
    const values = screen.getAllByText('+ R$ 900');
    expect(values).toHaveLength(2);
    for (const value of values) {
      expect(value).toHaveClass('mc-num', 'text-finance-positive');
    }
  });

  it('renders "Aluguel da sede" as a negative (−, U+2212) mc-num value in finance-negative, only in the desktop list (desktopOnly)', () => {
    renderScreen();
    const values = screen.getAllByText('− R$ 2.400');
    expect(values).toHaveLength(1);
    expect(values[0]).toHaveClass('mc-num', 'text-finance-negative');
    expect(values[0].closest('.md\\:hidden')).toBeNull();
    expect(screen.queryByText('Aluguel da sede')).not.toBeNull();
  });

  it('renders "Indicações por membro" only inside the mobile-only (md:hidden) wrapper — absent from desktop entirely', () => {
    renderScreen();
    const heading = screen.getByText('Indicações por membro');
    expect(heading.closest('.md\\:hidden')).not.toBeNull();
    // Financeiro desktop has no chart at all — must not be duplicated anywhere else in the tree.
    expect(screen.getAllByText('Indicações por membro')).toHaveLength(1);
  });

  it('renders "Cobrança do mês" with both ProgressBar labels, desktop-only', () => {
    renderScreen();
    const heading = screen.getByText('Cobrança do mês');
    expect(heading.closest('.md\\:hidden')).toBeNull();
    expect(screen.getByText('Mensalidades recebidas')).toBeInTheDocument();
    expect(screen.getByText('Boletos emitidos')).toBeInTheDocument();
  });

  it('renders "Registrar lançamento" as two separate mobile/desktop buttons, and "Exportar extrato" only on desktop', () => {
    renderScreen();
    const registrar = screen.getAllByRole('button', { name: 'Registrar lançamento' });
    expect(registrar).toHaveLength(2);
    const mobileButton = registrar.find((button) => button.closest('.md\\:hidden'));
    const desktopButton = registrar.find((button) => button.closest('.hidden.md\\:grid'));
    expect(mobileButton).not.toBeUndefined();
    expect(desktopButton).not.toBeUndefined();

    const exportar = screen.getByRole('button', { name: 'Exportar extrato' });
    expect(exportar.closest('.hidden.md\\:grid')).not.toBeNull();
  });
});

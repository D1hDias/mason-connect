import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PainelScreen } from './PainelScreen';

afterEach(() => {
  cleanup();
});

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/painel']}>
      <PainelScreen />
    </MemoryRouter>,
  );
}

describe('PainelScreen', () => {
  it('renders the mobile-visible KPI stats with the exact brief values and hints', () => {
    renderScreen();
    expect(screen.getByText('87%')).toBeInTheDocument();
    expect(screen.getByText('+4 p.p. vs. junho')).toBeInTheDocument();
    expect(screen.getByText('R$ 127 mil')).toBeInTheDocument();
    expect(screen.getByText('12 negócios')).toBeInTheDocument();
  });

  it('wraps the two desktop-only Stat tiles individually so only two show on mobile', () => {
    renderScreen();
    // "Presença média" and "Negócios fechados" (checked above) have no such wrapper.
    expect(screen.getByText('87%').closest('.hidden.md\\:block')).toBeNull();
    // "Indicações no mês" / "Membros ativos" are the ones the brief says stay `hidden md:block`.
    expect(screen.getByText('meta 30').closest('.hidden.md\\:block')).not.toBeNull();
    expect(screen.getByText('2 pendentes').closest('.hidden.md\\:block')).not.toBeNull();
  });

  it('renders the meetings list twice (mobile 2 rows, desktop 3 rows with the desktopOnly item)', () => {
    renderScreen();
    // "Coworking de setembro" isn't desktopOnly, so it renders in both the mobile and desktop lists.
    expect(screen.getAllByText('Coworking de setembro')).toHaveLength(2);
    expect(screen.getAllByText('Rodada de indicações')).toHaveLength(2);
    // "Jantar de encerramento" is desktopOnly, so it renders only once (the desktop list).
    expect(screen.getByText('Jantar de encerramento')).toBeInTheDocument();
  });

  it('renders "Indicações por membro" only inside the desktop-only grid, never on its own for mobile', () => {
    renderScreen();
    const heading = screen.getByText('Indicações por membro');
    expect(heading.closest('.hidden.md\\:grid')).not.toBeNull();
    // This card is desktop-only per the brief — must not also appear elsewhere in the tree.
    expect(screen.getAllByText('Indicações por membro')).toHaveLength(1);
  });

  it('renders the goals card with all 3 progress bar labels and a desktop-only EmptyState note', () => {
    renderScreen();
    expect(screen.getByText('Metas do trimestre')).toBeInTheDocument();
    expect(screen.getByText('Indicações qualificadas')).toBeInTheDocument();
    expect(screen.getByText('Reuniões um-a-um')).toBeInTheDocument();
    expect(screen.getByText('Novos membros')).toBeInTheDocument();

    const note = screen.getByText('As metas são reavaliadas na última reunião do trimestre.');
    expect(note.closest('.hidden.md\\:block')).not.toBeNull();
  });

  it('renders the "Valor gerado no núcleo" trend card', () => {
    renderScreen();
    expect(screen.getByText('Valor gerado no núcleo')).toBeInTheDocument();
  });
});

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { IndicacoesScreen, canSeeIndicacaoValue, indicacoesDoEstagio } from './IndicacoesScreen';
import { indicacoes } from '../../data/indicacoes';
import { AppOverlaysProvider } from '../../shell/overlays/AppOverlaysProvider';
import { AppRoutes } from '../../routes';

afterEach(() => {
  cleanup();
});

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/indicacoes']}>
      <AppOverlaysProvider>
        <IndicacoesScreen />
      </AppOverlaysProvider>
    </MemoryRouter>,
  );
}

/** Scopes queries to the confirm modal identified by its (unique) title text. */
function withinModal(titleText: string) {
  const title = screen.getByText(titleText);
  const container = title.closest('.flex.flex-col.gap-4');
  if (!container) {
    throw new Error(`Could not find modal container for "${titleText}"`);
  }
  return within(container as HTMLElement);
}

describe('IndicacoesScreen — registrar indicação form', () => {
  it('is closed by default, showing the "Registrar indicação" button and no form fields', () => {
    renderScreen();
    expect(screen.getByRole('button', { name: 'Registrar indicação' })).toBeInTheDocument();
    expect(screen.queryByText('Nova indicação')).not.toBeInTheDocument();
    expect(screen.queryByText('Destinatário')).not.toBeInTheDocument();
  });

  it('opens to show the 2 selects, the input, and the RF-32 note', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Registrar indicação' }));

    expect(screen.getByText('Nova indicação')).toBeInTheDocument();
    expect(screen.getByText('Destinatário')).toBeInTheDocument();
    expect(screen.getByText('Co-indicador (opcional)')).toBeInTheDocument();
    expect(screen.getByText('Oportunidade')).toBeInTheDocument();
    expect(
      screen.getByText(
        'O co-indicador divide o crédito da indicação (RF-32). Seu nome como indicador não poderá ser alterado depois.',
      ),
    ).toBeInTheDocument();
  });

  it('"Confirmar registro" closes the form, keeps the active tab on "Registradas", shows the exact toast, and does NOT insert a new card (count unchanged)', async () => {
    const user = userEvent.setup();
    renderScreen();

    // Start on a different tab to prove the confirm switches it back.
    await user.click(screen.getByRole('button', { name: 'Em contato' }));
    expect(screen.getByText('Você → Eduardo Matos')).toBeInTheDocument();

    const countBefore = () => screen.queryAllByText('Registrada').length;

    await user.click(screen.getByRole('button', { name: 'Registrar indicação' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar registro' }));

    expect(screen.queryByText('Nova indicação')).not.toBeInTheDocument();
    expect(
      screen.getByText('Indicação registrada. O SLA de 7 dias começou a contar.'),
    ).toBeInTheDocument();

    // Back on "Registradas": exactly the original single item, no new card.
    expect(screen.getByText('Davi Lopes → Camila Rocha')).toBeInTheDocument();
    expect(countBefore()).toBe(1);
  });

  it('"Cancelar" only closes the form, without showing any toast', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Registrar indicação' }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByText('Nova indicação')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Indicação registrada. O SLA de 7 dias começou a contar.'),
    ).not.toBeInTheDocument();
  });
});

describe('IndicacoesScreen — tabs show the right item per estágio', () => {
  it('"Registradas" (default) shows Davi Lopes → Camila Rocha with the "Registrada" badge', () => {
    renderScreen();
    expect(screen.getByText('Davi Lopes → Camila Rocha')).toBeInTheDocument();
    expect(screen.getByText('Reforma do escritório do cliente Vega — projeto e execução.')).toBeInTheDocument();
    expect(screen.getByText('Registrada')).toBeInTheDocument();
  });

  it('"Em contato" shows Você → Eduardo Matos with the "Em contato" badge', async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole('button', { name: 'Em contato' }));

    expect(screen.getByText('Você → Eduardo Matos')).toBeInTheDocument();
    expect(
      screen.getByText('Abertura de filial: contabilidade e enquadramento tributário.'),
    ).toBeInTheDocument();
    // "Em contato" is both the active FilterTabs button label and the
    // card's badge text — 2 instances once this tab is active.
    expect(screen.getAllByText('Em contato')).toHaveLength(2);
  });

  it('"Em andamento" shows Leonardo Almeida → Davi Lopes with the "Em andamento" badge', async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole('button', { name: 'Em andamento' }));

    expect(screen.getByText('Leonardo Almeida → Davi Lopes')).toBeInTheDocument();
    expect(screen.getByText('Migração do ERP de uma rede com 4 lojas.')).toBeInTheDocument();
    // "Em andamento" is both the active FilterTabs button label and the
    // card's badge text — 2 instances once this tab is active.
    expect(screen.getAllByText('Em andamento')).toHaveLength(2);
  });

  it('"Fechadas" shows Camila Rocha → Renata Vieira with the "Fechado" badge', async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole('button', { name: 'Fechadas' }));

    expect(screen.getByText('Camila Rocha → Renata Vieira')).toBeInTheDocument();
    expect(screen.getByText('Recuperação de crédito tributário de 3 exercícios.')).toBeInTheDocument();
    expect(screen.getByText('Fechado')).toBeInTheDocument();
  });

  it('"Perdidas" shows Jackson Pereira → Leonardo Almeida with the "Perdido" badge', async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole('button', { name: 'Perdidas' }));

    expect(screen.getByText('Jackson Pereira → Leonardo Almeida')).toBeInTheDocument();
    expect(screen.getByText('Diagnóstico de gestão para transportadora familiar.')).toBeInTheDocument();
    expect(screen.getByText('Perdido')).toBeInTheDocument();
  });
});

describe('IndicacoesScreen — SLA badges', () => {
  it('"Registradas" shows "SLA vencido · 9d" (critical) since dias=9 > 7', () => {
    renderScreen();
    expect(screen.getByText('SLA vencido · 9d')).toBeInTheDocument();
  });

  it('"Em contato" shows "SLA 1d" (warning) since dias=6 >= 6 (7 - 6 = 1)', async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole('button', { name: 'Em contato' }));

    expect(screen.getByText('SLA 1d')).toBeInTheDocument();
  });

  it('"Em andamento" shows no SLA badge', async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole('button', { name: 'Em andamento' }));

    expect(screen.queryByText(/SLA/)).not.toBeInTheDocument();
  });
});

describe('IndicacoesScreen — valor sigiloso (fechado)', () => {
  it('shows "R$ 42.000" on "Fechadas" since profile.categoria is "gestor" (always visible)', async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole('button', { name: 'Fechadas' }));

    expect(screen.getByText('R$ 42.000')).toBeInTheDocument();
    expect(screen.queryByText('valor restrito')).not.toBeInTheDocument();
  });
});

describe('canSeeIndicacaoValue', () => {
  const indicacao = indicacoes.find((i) => i.estagio === 'fechado')!;

  it('returns true for categoria "gestor"', () => {
    expect(canSeeIndicacaoValue(indicacao, 'gestor')).toBe(true);
  });

  it('returns true for categoria "administrativo"', () => {
    expect(canSeeIndicacaoValue(indicacao, 'administrativo')).toBe(true);
  });

  it('returns true when indicador is "Você", even for a non-gestor categoria', () => {
    expect(canSeeIndicacaoValue({ ...indicacao, indicador: 'Você' }, 'empresario')).toBe(true);
  });

  it('returns false when categoria is not gestor/administrativo and neither party is "Você"', () => {
    expect(canSeeIndicacaoValue(indicacao, 'empresario')).toBe(false);
  });
});

describe('IndicacoesScreen — motivo da perda', () => {
  it('shows the exact motivo text on "Perdidas"', async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole('button', { name: 'Perdidas' }));

    expect(
      screen.getByText('Motivo da perda: cliente adiou o projeto para o próximo exercício.'),
    ).toBeInTheDocument();
  });
});

describe('IndicacoesScreen — confirmar fechamento', () => {
  it('shows "Confirmar fechamento" only on the andamento item', async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole('button', { name: 'Em andamento' }));

    expect(screen.getByRole('button', { name: 'Confirmar fechamento' })).toBeInTheDocument();
  });

  it('opens the modal with the exact título/corpo/nota, and confirming closes the deal with the default valor 18500, switches to "Fechadas", shows the toast, and moves the card between tabs', async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole('button', { name: 'Em andamento' }));
    expect(screen.getByText('Leonardo Almeida → Davi Lopes')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirmar fechamento' }));

    expect(screen.getByText('Confirmar fechamento deste negócio?')).toBeInTheDocument();
    const modal = withinModal('Confirmar fechamento deste negócio?');
    expect(
      modal.getByText(
        'O crédito de Leonardo Almeida é perpétuo e não poderá ser alterado. O fechamento entra na pauta de reconhecimento da próxima reunião.',
      ),
    ).toBeInTheDocument();
    expect(
      modal.getByText(
        'Ato definitivo e auditado (RN-13). Valores individuais permanecem restritos às partes e à gestão (RN-26).',
      ),
    ).toBeInTheDocument();

    await user.click(modal.getByRole('button', { name: 'Confirmar fechamento' }));

    expect(
      screen.getByText('Fechamento confirmado. O indicador foi notificado.'),
    ).toBeInTheDocument();

    // Active tab switched to "Fechadas": both the pre-existing closed deal
    // and the newly closed one show, the latter with the default valor.
    expect(screen.getByText('Camila Rocha → Renata Vieira')).toBeInTheDocument();
    expect(screen.getByText('Leonardo Almeida → Davi Lopes')).toBeInTheDocument();
    expect(screen.getByText('R$ 42.000')).toBeInTheDocument();
    expect(screen.getByText('R$ 18.500')).toBeInTheDocument();

    // "Em andamento" is now empty in reality (its only item just closed) —
    // this exercises the EmptyState branch through a real click sequence.
    await user.click(screen.getByRole('button', { name: 'Em andamento' }));
    expect(screen.getByText('Nada por aqui.')).toBeInTheDocument();
    expect(screen.getByText('A próxima Rodada de Negócios muda isso.')).toBeInTheDocument();
  });
});

describe('indicacoesDoEstagio', () => {
  it('returns only items matching the given estágio', () => {
    const result = indicacoesDoEstagio(indicacoes, 'fechado');
    expect(result.map((i) => i.id)).toEqual([4]);
  });

  it('reaches the EmptyState branch in isolation: filtering an empty list always returns empty', () => {
    expect(indicacoesDoEstagio([], 'registrada')).toEqual([]);
  });
});

describe('IndicacoesScreen — route integration', () => {
  it('renders /indicacoes inside the AppShell (with BottomNav/sidebar), not standalone', () => {
    render(
      <MemoryRouter initialEntries={['/indicacoes']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    // Distinguishing content of the screen itself (unique — the mobile and
    // desktop topbar subtitles both render "Funil de indicações do
    // núcleo", so that text isn't safe to assert on alone).
    expect(screen.getByText('Davi Lopes → Camila Rocha')).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: 'Painel' })).toHaveLength(2);
    const indicacoesNav = screen.getByRole('button', { name: 'Indicações' });
    expect(indicacoesNav).toHaveAttribute('aria-current', 'page');
  });
});

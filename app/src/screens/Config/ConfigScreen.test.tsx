import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ConfigScreen, canEditConfig } from './ConfigScreen';
import type { ProfileCategoria } from '../../data/profile';
import { AppOverlaysProvider } from '../../shell/overlays/AppOverlaysProvider';
import { AppRoutes } from '../../routes';

// Mutable override read by the `vi.mock` factory below. `vi.hoisted` makes
// it available inside the factory despite `vi.mock` hoisting to the top of
// the file. Defaults to `null` (passthrough to the real data, always
// `'gestor'`), so every test that doesn't set it exercises the real mock —
// only the "bloqueado" tests override it, each resetting in `afterEach`
// (same pattern as `MembrosScreen.test.tsx`).
const profileState = vi.hoisted(() => ({ override: null as ProfileCategoria | null }));

vi.mock('../../data/profile', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../data/profile')>();
  return {
    ...actual,
    get profile() {
      return profileState.override ? { ...actual.profile, categoria: profileState.override } : actual.profile;
    },
  };
});

afterEach(() => {
  cleanup();
});

afterEach(() => {
  profileState.override = null;
});

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/config']}>
      <AppOverlaysProvider>
        <ConfigScreen />
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

describe('canEditConfig', () => {
  it('returns true for "gestor"', () => {
    expect(canEditConfig('gestor')).toBe(true);
  });

  it('returns false for "administrativo"', () => {
    expect(canEditConfig('administrativo')).toBe(false);
  });

  it('returns false for "empresario"', () => {
    expect(canEditConfig('empresario')).toBe(false);
  });
});

describe('ConfigScreen — branch liberado (profile.categoria is "gestor")', () => {
  it('shows "Planos de mensalidade" with the 3 exact formatted values', () => {
    renderScreen();

    expect(screen.getByText('Gratuito')).toBeInTheDocument();
    expect(screen.getByText('R$ 0,00 · exige justificativa (RN-29)')).toBeInTheDocument();

    expect(screen.getByText('Mensal')).toBeInTheDocument();
    expect(screen.getByText('R$ 130,00 por competência')).toBeInTheDocument();

    expect(screen.getByText('Anual')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.248,00 · equivale a R$ 104/mês')).toBeInTheDocument();
  });

  it('shows the 3 "Editar" buttons, one per plan', () => {
    renderScreen();
    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(3);
  });

  it('clicking "Editar" on the "Anual" plan opens the modal with the exact título/corpo/nota; confirming shows the exact toast and does NOT change any displayed value', async () => {
    const user = userEvent.setup();
    renderScreen();

    const anualRow = screen.getByText('Anual').closest('div.flex.items-center.justify-between') as HTMLElement;
    await user.click(within(anualRow).getByRole('button', { name: 'Editar' }));

    expect(screen.getByText('Editar o plano Anual?')).toBeInTheDocument();
    const modal = withinModal('Editar o plano Anual?');
    expect(
      modal.getByText('A alteração passa a valer na próxima competência. Mensalidades já lançadas não mudam.'),
    ).toBeInTheDocument();
    expect(modal.getByText('A mudança de valor gera entrada na trilha de auditoria.')).toBeInTheDocument();

    await user.click(modal.getByRole('button', { name: 'Abrir edição' }));

    expect(screen.getByText('Plano Anual aberto para edição.')).toBeInTheDocument();

    // No mutation: the 3 plan values remain exactly as before.
    expect(screen.getByText('R$ 0,00 · exige justificativa (RN-29)')).toBeInTheDocument();
    expect(screen.getByText('R$ 130,00 por competência')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.248,00 · equivale a R$ 104/mês')).toBeInTheDocument();
  });

  it('shows the 5 "Regras parametrizáveis" rows with the exact nome/código/badge', () => {
    renderScreen();

    expect(screen.getByText('Limite de faltas consecutivas')).toBeInTheDocument();
    expect(screen.getByText('RN-08b')).toBeInTheDocument();
    expect(screen.getByText('3 reuniões')).toBeInTheDocument();

    expect(screen.getByText('SLA de 1º contato da indicação')).toBeInTheDocument();
    expect(screen.getByText('RN-23')).toBeInTheDocument();
    expect(screen.getByText('7 dias')).toBeInTheDocument();

    expect(screen.getByText('Convidados por membro por reunião')).toBeInTheDocument();
    expect(screen.getByText('RN-21')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText('Antecedência para falta justificada')).toBeInTheDocument();
    expect(screen.getByText('RN-19')).toBeInTheDocument();
    expect(screen.getByText('24 horas')).toBeInTheDocument();

    expect(screen.getByText('Política de comissão')).toBeInTheDocument();
    expect(screen.getByText('RN-09')).toBeInTheDocument();
    expect(screen.getByText('Pendente de ratificação')).toBeInTheDocument();
  });

  it('shows the 3 "Trilha de auditoria" entries with the exact acao/quando', () => {
    renderScreen();

    expect(screen.getByText('Leonardo A. aprovou o cadastro de Rafael T.')).toBeInTheDocument();
    expect(screen.getByText('Hoje, 10h12')).toBeInTheDocument();

    expect(screen.getByText('Eduardo M. confirmou fechamento de negócio')).toBeInTheDocument();
    expect(screen.getByText('Ontem, 21h47')).toBeInTheDocument();

    expect(screen.getByText('Harrison M. lançou despesa de coffee break')).toBeInTheDocument();
    expect(screen.getByText('30/06, 09h05')).toBeInTheDocument();
  });

  it('shows the exact footer paragraph', () => {
    renderScreen();
    expect(
      screen.getByText('Registros imutáveis e append-only (RN-33). Toda alteração de valor gera nova entrada.'),
    ).toBeInTheDocument();
  });
});

describe('ConfigScreen — branch bloqueado (profile.categoria is not "gestor")', () => {
  it('shows only the EmptyState, none of the liberado content', () => {
    profileState.override = 'empresario';
    renderScreen();

    expect(
      screen.getByText('Somente o perfil Gestor edita os parâmetros do grupo.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Fale com a gestão do núcleo se precisar de uma alteração.'),
    ).toBeInTheDocument();

    expect(screen.queryByText('Planos de mensalidade')).not.toBeInTheDocument();
    expect(screen.queryByText('Regras parametrizáveis')).not.toBeInTheDocument();
    expect(screen.queryByText('Trilha de auditoria')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
    expect(
      screen.queryByText('Registros imutáveis e append-only (RN-33). Toda alteração de valor gera nova entrada.'),
    ).not.toBeInTheDocument();
  });

  it('also shows only the EmptyState for categoria "administrativo"', () => {
    profileState.override = 'administrativo';
    renderScreen();

    expect(
      screen.getByText('Somente o perfil Gestor edita os parâmetros do grupo.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Planos de mensalidade')).not.toBeInTheDocument();
  });
});

describe('ConfigScreen — route integration', () => {
  it('renders /config inside the AppShell (with BottomNav/sidebar), not standalone', () => {
    render(
      <MemoryRouter initialEntries={['/config']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    // Distinguishing content of the screen itself.
    expect(screen.getByText('Planos de mensalidade')).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: 'Painel' })).toHaveLength(2);
    const configNav = screen.getByRole('button', { name: 'Config' });
    expect(configNav).toHaveAttribute('aria-current', 'page');
  });
});

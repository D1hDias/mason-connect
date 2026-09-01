import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CondutaScreen, canViewConduta } from './CondutaScreen';
import { canEditConfig } from '../Config/ConfigScreen';
import { ocorrencias, tiposConduta } from '../../data/conduta';
import type { ProfileCategoria } from '../../data/profile';
import { AppOverlaysProvider } from '../../shell/overlays/AppOverlaysProvider';
import { AppRoutes } from '../../routes';

// Mutable override read by the `vi.mock` factory below (same pattern as
// `ConfigScreen.test.tsx`/`MembrosScreen.test.tsx`). Defaults to `null`
// (passthrough to the real data, always `'gestor'`) — only the "bloqueado"
// tests override it, each resetting in `afterEach`.
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
    <MemoryRouter initialEntries={['/conduta']}>
      <AppOverlaysProvider>
        <CondutaScreen />
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

describe('canViewConduta', () => {
  it('returns true for "gestor"', () => {
    expect(canViewConduta('gestor')).toBe(true);
  });

  it('returns false for "administrativo"', () => {
    expect(canViewConduta('administrativo')).toBe(false);
  });

  it('returns false for "empresario"', () => {
    expect(canViewConduta('empresario')).toBe(false);
  });

  it('is its own export, not an alias of `canEditConfig` (Task 14) — distinct functions even though their return value coincides today', () => {
    expect(canViewConduta).not.toBe(canEditConfig);
    // Sanity: they do coincide in return value today (only one profile has
    // both permissions) — the point under test is that they're separate
    // exports, not that their behavior differs.
    const categorias: ProfileCategoria[] = ['gestor', 'administrativo', 'empresario'];
    for (const categoria of categorias) {
      expect(canViewConduta(categoria)).toBe(canEditConfig(categoria));
    }
  });
});

describe('CondutaScreen — branch liberado (profile.categoria is "gestor")', () => {
  it('shows the confidentiality card with the exact title and warning text', () => {
    renderScreen();

    expect(screen.getByText('Documento confidencial')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Não compartilhe fora da gestão. Três ocorrências validadas abrem processo de revisão de permanência (RN-32).',
      ),
    ).toBeInTheDocument();
  });

  it('shows the 2 literal Stats', () => {
    renderScreen();

    expect(screen.getByText('Registros no ano')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3 validados')).toBeInTheDocument();

    expect(screen.getByText('Em revisão')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('atingiu 3 validadas')).toBeInTheDocument();
  });

  it('shows the "Ocorrências registradas" header and the 4 entries with membro/tipo/descricao/rodape/badge', () => {
    renderScreen();

    expect(ocorrencias).toHaveLength(4);

    // Scoped to the list itself: `membro` and `tipo` values also appear in
    // the "Registrar ocorrência" form's Membro/Tipo selects below (e.g.
    // "Renata Vieira" and "Pressão agressiva" are option labels too), so a
    // page-wide `getByText` would find duplicates.
    const header = screen.getByText('Ocorrências registradas');
    const list = header.closest('.bg-surface.rounded-lg.overflow-hidden.shadow');
    if (!list) {
      throw new Error('Could not find the "Ocorrências registradas" List container');
    }
    const listScope = within(list as HTMLElement);

    for (const ocorrencia of ocorrencias) {
      expect(listScope.getByText(ocorrencia.descricao)).toBeInTheDocument();
      expect(listScope.getByText(ocorrencia.rodape)).toBeInTheDocument();
      expect(listScope.getByText(ocorrencia.seloTexto)).toBeInTheDocument();
    }

    // `membro`/`tipo` repeat within this list too (e.g. "Jackson Pereira"
    // appears in 2 entries), so checked by expected count rather than
    // uniqueness.
    const counts = new Map<string, number>();
    for (const ocorrencia of ocorrencias) {
      counts.set(ocorrencia.membro, (counts.get(ocorrencia.membro) ?? 0) + 1);
      counts.set(ocorrencia.tipo, (counts.get(ocorrencia.tipo) ?? 0) + 1);
    }
    for (const [text, count] of counts) {
      expect(listScope.getAllByText(text)).toHaveLength(count);
    }
  });

  it('shows the "Registrar ocorrência" form with the Membro select, Tipo select (all 6 tiposConduta options), and Descrição input', () => {
    renderScreen();

    expect(screen.getByText('Registrar ocorrência')).toBeInTheDocument();
    expect(screen.getByText('Membro')).toBeInTheDocument();
    expect(screen.getByText('Tipo de ocorrência')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('O que aconteceu, com data e contexto')).toBeInTheDocument();

    expect(tiposConduta).toHaveLength(6);
    for (const tipo of tiposConduta) {
      expect(screen.getByRole('option', { name: tipo.label })).toBeInTheDocument();
    }
  });

  it('clicking "Registrar" opens the modal with the exact título/corpo/nota; confirming shows the exact toast and does NOT add a new ocorrência (count unchanged)', async () => {
    const user = userEvent.setup();
    renderScreen();

    const countBefore = ocorrencias.length;

    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(screen.getByText('Registrar ocorrência de conduta?')).toBeInTheDocument();
    const modal = withinModal('Registrar ocorrência de conduta?');
    expect(
      modal.getByText(
        'O registro é sigiloso e visível apenas à gestão. Três ocorrências validadas abrem processo de revisão de permanência.',
      ),
    ).toBeInTheDocument();
    expect(modal.getByText('Registra autor, data e hora (RN-32 · RF-36).')).toBeInTheDocument();

    await user.click(modal.getByRole('button', { name: 'Registrar ocorrência' }));

    expect(screen.getByText('Ocorrência registrada em sigilo.')).toBeInTheDocument();

    // No mutation: the exported dataset is unchanged.
    expect(ocorrencias).toHaveLength(countBefore);
  });
});

describe('CondutaScreen — branch bloqueado (profile.categoria is not "gestor")', () => {
  it('shows only the EmptyState, none of the liberado content', () => {
    profileState.override = 'empresario';
    renderScreen();

    expect(screen.getByText('Este registro é visível apenas ao perfil Gestor.')).toBeInTheDocument();
    expect(
      screen.getByText('Ocorrências de conduta são sigilosas por decisão de governança.'),
    ).toBeInTheDocument();

    expect(screen.queryByText('Documento confidencial')).not.toBeInTheDocument();
    expect(screen.queryByText('Registros no ano')).not.toBeInTheDocument();
    expect(screen.queryByText('Ocorrências registradas')).not.toBeInTheDocument();
    expect(screen.queryByText('Registrar ocorrência')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Registrar' })).not.toBeInTheDocument();
  });

  it('also shows only the EmptyState for categoria "administrativo"', () => {
    profileState.override = 'administrativo';
    renderScreen();

    expect(screen.getByText('Este registro é visível apenas ao perfil Gestor.')).toBeInTheDocument();
    expect(screen.queryByText('Ocorrências registradas')).not.toBeInTheDocument();
  });
});

describe('CondutaScreen — route integration', () => {
  it('renders /conduta inside the AppShell (with BottomNav/sidebar), not standalone', () => {
    render(
      <MemoryRouter initialEntries={['/conduta']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    // Distinguishing content of the screen itself.
    expect(screen.getByText('Ocorrências registradas')).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: 'Painel' })).toHaveLength(2);
    const condutaNav = screen.getByRole('button', { name: 'Conduta' });
    expect(condutaNav).toHaveAttribute('aria-current', 'page');
  });
});

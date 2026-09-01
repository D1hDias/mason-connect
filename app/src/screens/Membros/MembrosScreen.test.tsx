import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MembrosScreen, filterMembers } from './MembrosScreen';
import { members, type Member } from '../../data/members';
import type { ProfileCategoria } from '../../data/profile';
import { AppOverlaysProvider } from '../../shell/overlays/AppOverlaysProvider';

// Mutable overrides read by the `vi.mock` factories below. `vi.hoisted`
// makes them available inside factories despite `vi.mock` hoisting to the
// top of the file. Both default to `null` (passthrough to the real data),
// so every pre-existing test in this file is unaffected — only the new
// tests that explicitly set an override observe different data, and each
// resets it in its own `afterEach` cleanup below.
const membersState = vi.hoisted(() => ({ override: null as Member[] | null }));
const profileState = vi.hoisted(() => ({ override: null as ProfileCategoria | null }));

vi.mock('../../data/members', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../data/members')>();
  return {
    ...actual,
    get members() {
      return membersState.override ?? actual.members;
    },
  };
});

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
  membersState.override = null;
  profileState.override = null;
});

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/membros']}>
      <AppOverlaysProvider>
        <MembrosScreen />
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

describe('MembrosScreen', () => {
  it('shows 5 members with abbreviated names on mobile and all 6 with full names on desktop', () => {
    renderScreen();
    // Mobile abbreviated names (via abbreviateName), Renata Vieira (desktopOnly, index 5) absent.
    expect(screen.getByText('Leonardo A.')).toBeInTheDocument();
    expect(screen.getByText('Jackson P.')).toBeInTheDocument();
    expect(screen.getByText('Camila R.')).toBeInTheDocument();
    expect(screen.getByText('Eduardo M.')).toBeInTheDocument();
    expect(screen.getByText('Davi L.')).toBeInTheDocument();
    expect(screen.queryByText('Renata V.')).not.toBeInTheDocument();

    // Desktop full names, including the 6th, desktopOnly-adjacent member.
    expect(screen.getByText('Leonardo Almeida')).toBeInTheDocument();
    expect(screen.getByText('Jackson Pereira')).toBeInTheDocument();
    expect(screen.getByText('Camila Rocha')).toBeInTheDocument();
    expect(screen.getByText('Eduardo Matos')).toBeInTheDocument();
    expect(screen.getByText('Davi Lopes')).toBeInTheDocument();
    expect(screen.getByText('Renata Vieira')).toBeInTheDocument();
  });

  it('filters to only the 2 pending members when the "Pendentes" tab is clicked', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Pendentes' }));

    // Pending members (Jackson Pereira, Davi Lopes) still show, in both mobile and desktop lists.
    expect(screen.getAllByText('Jackson Pereira').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Davi Lopes').length).toBeGreaterThan(0);
    expect(screen.getByText('Jackson P.')).toBeInTheDocument();
    expect(screen.getByText('Davi L.')).toBeInTheDocument();

    // Active members are gone from both surfaces.
    expect(screen.queryByText('Leonardo Almeida')).not.toBeInTheDocument();
    expect(screen.queryByText('Leonardo A.')).not.toBeInTheDocument();
    expect(screen.queryByText('Camila Rocha')).not.toBeInTheDocument();
    expect(screen.queryByText('Eduardo Matos')).not.toBeInTheDocument();
    expect(screen.queryByText('Renata Vieira')).not.toBeInTheDocument();
  });

  it('renders the two "Convidar novo membro" buttons as separate mobile/desktop nodes', () => {
    renderScreen();
    const buttons = screen.getAllByRole('button', { name: 'Convidar novo membro' });
    expect(buttons).toHaveLength(2);

    const mobileButton = buttons.find((button) => button.closest('.md\\:hidden'));
    const desktopButton = buttons.find((button) => button.closest('.hidden.md\\:block'));
    expect(mobileButton).not.toBeUndefined();
    expect(desktopButton).not.toBeUndefined();
    expect(mobileButton).not.toBe(desktopButton);
  });

  it('renders the desktop-only retention Stat and "Cadeiras em aberto" card inside a hidden-on-mobile grid', () => {
    renderScreen();
    const retention = screen.getByText('Taxa de retenção');
    expect(retention.closest('.hidden.md\\:grid')).not.toBeNull();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('12 meses')).toBeInTheDocument();

    expect(screen.getByText('Cadeiras em aberto')).toBeInTheDocument();
    expect(screen.getByText('Odontologia')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Logística')).toBeInTheDocument();
    expect(screen.getByText('Engenharia civil')).toBeInTheDocument();
  });
});

describe('filterMembers', () => {
  it('returns the full list for "todos"', () => {
    expect(filterMembers(members, 'todos')).toEqual(members);
  });

  it('returns only pending members for "pendente"', () => {
    const result = filterMembers(members, 'pendente');
    expect(result.map((m) => m.name)).toEqual(['Jackson Pereira', 'Davi Lopes']);
  });

  it('returns only active members for "ativo"', () => {
    const result = filterMembers(members, 'ativo');
    expect(result.map((m) => m.name)).toEqual([
      'Leonardo Almeida',
      'Camila Rocha',
      'Eduardo Matos',
      'Renata Vieira',
    ]);
  });

  it('reaches the EmptyState branch: a filter value outside the domain empties the list, which no real click sequence can do with the current 6-member dataset', () => {
    expect(filterMembers(members, 'suspenso')).toEqual([]);
  });
});

describe('member row — faltas alert', () => {
  it('shows the "2 faltas seguidas" warning badge for Eduardo Matos (faltas: 2), once per list (mobile + desktop)', () => {
    renderScreen();
    expect(screen.getAllByText('2 faltas seguidas')).toHaveLength(2);
  });

  it('reaches the critical branch: a mocked member with faltas: 3 shows "3 faltas seguidas · crítico" instead of the warning badge', () => {
    membersState.override = [
      { name: 'Membro Crítico', role: 'Teste · Plano Mensal', status: 'ativo', faltas: 3 },
    ];
    renderScreen();
    expect(screen.getAllByText('3 faltas seguidas · crítico')).toHaveLength(2);
    expect(screen.queryByText('2 faltas seguidas')).not.toBeInTheDocument();
  });
});

describe('member row — approval decision buttons (gestor gate)', () => {
  it('shows "Aprovar cadastro" and "Recusar" for pending members when profile.categoria is "gestor"', () => {
    renderScreen();
    // Jackson Pereira and Davi Lopes are the 2 pending members, each rendered once
    // in the mobile list and once in the desktop list.
    expect(screen.getAllByRole('button', { name: 'Aprovar cadastro' })).toHaveLength(4);
    expect(screen.getAllByRole('button', { name: 'Recusar' })).toHaveLength(4);
  });

  it('reaches the non-gestor branch: with profile.categoria mocked to a non-"gestor" value, no member shows the decision buttons', () => {
    profileState.override = 'empresario';
    renderScreen();
    expect(screen.queryByRole('button', { name: 'Aprovar cadastro' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Recusar' })).not.toBeInTheDocument();
  });
});

describe('approval flow', () => {
  it('"Aprovar cadastro" opens a confirm modal with the right copy; confirming approves the member, hides the decision buttons, and shows the success toast', async () => {
    const user = userEvent.setup();
    renderScreen();

    const jacksonRow = screen.getByText('Jackson Pereira').closest('div.flex.flex-col.gap-2') as HTMLElement;
    await user.click(within(jacksonRow).getByRole('button', { name: 'Aprovar cadastro' }));

    expect(screen.getByText('Aprovar o cadastro de Jackson Pereira?')).toBeInTheDocument();
    expect(
      screen.getByText('A aprovação é definitiva e dá acesso imediato ao núcleo. Cadeira: Seguros · Plano Mensal.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Registra autor, data e hora na trilha de auditoria (RN-02 · RN-33).'),
    ).toBeInTheDocument();

    const modal = withinModal('Aprovar o cadastro de Jackson Pereira?');
    await user.click(modal.getByRole('button', { name: 'Aprovar cadastro' }));

    expect(screen.queryByText('Aprovar o cadastro de Jackson Pereira?')).not.toBeInTheDocument();
    expect(
      screen.getByText('Jackson Pereira foi aprovado. O padrinho já pode iniciar o onboarding.'),
    ).toBeInTheDocument();

    const updatedRow = screen.getByText('Jackson Pereira').closest('div.flex.flex-col.gap-2') as HTMLElement;
    expect(within(updatedRow).queryByRole('button', { name: 'Aprovar cadastro' })).not.toBeInTheDocument();
    expect(within(updatedRow).queryByRole('button', { name: 'Recusar' })).not.toBeInTheDocument();
    expect(within(updatedRow).getByText('Ativo')).toBeInTheDocument();
  });

  it('"Recusar" opens a confirm modal asking for a motivo; confirming shows the toast without changing the member\'s status', async () => {
    const user = userEvent.setup();
    renderScreen();

    const daviRow = screen.getByText('Davi Lopes').closest('div.flex.flex-col.gap-2') as HTMLElement;
    await user.click(within(daviRow).getByRole('button', { name: 'Recusar' }));

    expect(screen.getByText('Recusar o cadastro de Davi Lopes?')).toBeInTheDocument();
    expect(screen.getByLabelText('Motivo (opcional)')).toBeInTheDocument();

    const modal = withinModal('Recusar o cadastro de Davi Lopes?');
    await user.click(modal.getByRole('button', { name: 'Recusar cadastro' }));

    expect(screen.queryByText('Recusar o cadastro de Davi Lopes?')).not.toBeInTheDocument();
    expect(screen.getByText('Cadastro de Davi Lopes recusado.')).toBeInTheDocument();

    // Status is unchanged: Davi Lopes is still pending, decision buttons still visible.
    const updatedRow = screen.getByText('Davi Lopes').closest('div.flex.flex-col.gap-2') as HTMLElement;
    expect(within(updatedRow).getByRole('button', { name: 'Aprovar cadastro' })).toBeInTheDocument();
    expect(within(updatedRow).getByRole('button', { name: 'Recusar' })).toBeInTheDocument();
    expect(within(updatedRow).getByText('Pendente')).toBeInTheDocument();
  });

  it('clicking "Cancelar" on the confirm modal closes it without changing anything', async () => {
    const user = userEvent.setup();
    renderScreen();

    const jacksonRow = screen.getByText('Jackson Pereira').closest('div.flex.flex-col.gap-2') as HTMLElement;
    await user.click(within(jacksonRow).getByRole('button', { name: 'Aprovar cadastro' }));

    const modal = withinModal('Aprovar o cadastro de Jackson Pereira?');
    await user.click(modal.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByText('Aprovar o cadastro de Jackson Pereira?')).not.toBeInTheDocument();

    const updatedRow = screen.getByText('Jackson Pereira').closest('div.flex.flex-col.gap-2') as HTMLElement;
    expect(within(updatedRow).getByRole('button', { name: 'Aprovar cadastro' })).toBeInTheDocument();
    expect(within(updatedRow).getByText('Pendente')).toBeInTheDocument();
  });
});

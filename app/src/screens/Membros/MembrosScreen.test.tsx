import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MembrosScreen, filterMembers } from './MembrosScreen';
import { members } from '../../data/members';

afterEach(() => {
  cleanup();
});

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/membros']}>
      <MembrosScreen />
    </MemoryRouter>,
  );
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

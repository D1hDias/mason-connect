import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PresencaScreen } from './PresencaScreen';
import { AppOverlaysProvider } from '../../shell/overlays/AppOverlaysProvider';
import { AppRoutes } from '../../routes';

afterEach(() => {
  cleanup();
});

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/presenca']}>
      <AppOverlaysProvider>
        <PresencaScreen />
      </AppOverlaysProvider>
    </MemoryRouter>,
  );
}

/**
 * Finds the clickable row button for a member by their visible name. Member
 * names also appear as literal `<option>` text inside the "Suplente
 * responsável" select (whenever at least one row is `representado`), so this
 * disambiguates by picking the match whose nearest ancestor is a `<button>`.
 */
function memberRow(name: string): HTMLElement {
  const button = screen
    .getAllByText(name)
    .map((el) => el.closest('button'))
    .find((el): el is HTMLButtonElement => el !== null);
  if (!button) {
    throw new Error(`Could not find a row button for "${name}"`);
  }
  return button;
}

describe('PresencaScreen — counter', () => {
  it('shows the initial counter "4/4" (Leonardo, Camila and Eduardo presente + Renata representado all count as present)', () => {
    renderScreen();
    expect(screen.getByText('4/4')).toBeInTheDocument();
  });

  it('drops to "3/4" when a presente member is clicked to falta', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(memberRow('Leonardo Almeida'));

    expect(screen.getByText('3/4')).toBeInTheDocument();
    expect(within(memberRow('Leonardo Almeida')).getByText('Falta')).toBeInTheDocument();
  });
});

describe('PresencaScreen — cyclic chip', () => {
  it('cycles presente → falta → justificada → representado → presente on repeated clicks', async () => {
    const user = userEvent.setup();
    renderScreen();

    const row = () => memberRow('Camila Rocha');

    expect(within(row()).getByText('Presente')).toBeInTheDocument();

    await user.click(row());
    expect(within(row()).getByText('Falta')).toBeInTheDocument();

    await user.click(row());
    expect(within(row()).getByText('Justificada')).toBeInTheDocument();

    await user.click(row());
    expect(within(row()).getByText('Representado')).toBeInTheDocument();

    await user.click(row());
    expect(within(row()).getByText('Presente')).toBeInTheDocument();
  });
});

describe('PresencaScreen — critical faltas alert', () => {
  it('shows the exact critical alert text for Eduardo Matos (faltas: 2) once clicked to falta', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(memberRow('Eduardo Matos'));

    expect(within(memberRow('Eduardo Matos')).getByText('Falta')).toBeInTheDocument();
    expect(screen.getByText('3ª falta seguida · limite atingido (RN-08b)')).toBeInTheDocument();
  });

  it('does not show the alert for a member with faltas: 0 even when clicked to falta', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(memberRow('Leonardo Almeida'));

    expect(within(memberRow('Leonardo Almeida')).getByText('Falta')).toBeInTheDocument();
    expect(screen.queryByText('3ª falta seguida · limite atingido (RN-08b)')).not.toBeInTheDocument();
  });
});

describe('PresencaScreen — suplente select', () => {
  it('shows the "Suplente responsável" select for Renata Vieira (initially representado)', () => {
    renderScreen();
    expect(screen.getByText('Suplente responsável')).toBeInTheDocument();
  });

  it('hides the select for members not in the representado state, and shows it once a member cycles into representado', async () => {
    const user = userEvent.setup();
    renderScreen();

    // Only Renata (representado) shows it initially — 1 instance.
    expect(screen.getAllByText('Suplente responsável')).toHaveLength(1);

    // Leonardo: presente → falta → justificada → representado (3 clicks).
    const row = memberRow('Leonardo Almeida');
    await user.click(row);
    await user.click(row);
    await user.click(row);

    expect(within(memberRow('Leonardo Almeida')).getByText('Representado')).toBeInTheDocument();
    expect(screen.getAllByText('Suplente responsável')).toHaveLength(2);
  });
});

describe('PresencaScreen — convidados desta reunião', () => {
  it('renders the 2 literal guest cards with their exact badges', () => {
    renderScreen();

    expect(screen.getByText('Convidados desta reunião')).toBeInTheDocument();

    expect(screen.getByText('Carlos Nogueira')).toBeInTheDocument();
    expect(screen.getByText('Logística · anfitrião: Davi Lopes')).toBeInTheDocument();
    expect(screen.getByText('2ª participação')).toBeInTheDocument();

    expect(screen.getByText('Beatriz Salles')).toBeInTheDocument();
    expect(screen.getByText('Odontologia · anfitriã: Camila Rocha')).toBeInTheDocument();
    expect(screen.getByText('1ª participação')).toBeInTheDocument();
  });
});

describe('PresencaScreen — agendar reunião', () => {
  it('clicking "Agendar reunião" shows the exact shared toast message', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Agendar reunião' }));

    expect(screen.getByText('Reunião agendada. Os membros foram notificados.')).toBeInTheDocument();
  });
});

describe('PresencaScreen — route integration', () => {
  it('renders /presenca inside the AppShell (with BottomNav/sidebar), not standalone', () => {
    render(
      <MemoryRouter initialEntries={['/presenca']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    // Distinguishing content of the screen itself (unique — "Rodada de
    // Negócios" also appears as a literal option in the "Tipo de reunião"
    // select, so it isn't safe to assert on alone).
    expect(screen.getByText('Toque na linha para alternar o registro. Um toque = um estado.')).toBeInTheDocument();

    // Nav chrome present. "Painel" is in both the mobile bottom nav (4-item
    // `navItems`) and the desktop sidebar (8-item `moduleItems`) — 2
    // instances. "Presença" is only in `moduleItems` (desktop sidebar), not
    // the mobile bottom nav's 4 core tabs — 1 instance, active.
    expect(screen.getAllByRole('button', { name: 'Painel' })).toHaveLength(2);
    const presencaNav = screen.getByRole('button', { name: 'Presença' });
    expect(presencaNav).toHaveAttribute('aria-current', 'page');
  });
});

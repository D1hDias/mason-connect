import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PerfilScreen } from './PerfilScreen';

afterEach(() => {
  cleanup();
});

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/perfil']}>
      <PerfilScreen />
    </MemoryRouter>,
  );
}

describe('PerfilScreen', () => {
  it('renders the identity card (name, cadeira, "Ativo"/"Plano Anual" badges) once per surface', () => {
    renderScreen();
    expect(screen.getAllByText('Leonardo Almeida')).toHaveLength(2);
    expect(screen.getAllByText('Cadeira: Consultoria Empresarial')).toHaveLength(2);

    const ativoBadges = screen.getAllByText('Ativo');
    expect(ativoBadges).toHaveLength(2);
    const planoBadges = screen.getAllByText('Plano Anual');
    expect(planoBadges).toHaveLength(2);
  });

  it('renders the stats block (Membro desde / Indicações feitas / Presença no ano) only once, inside the desktop identity Card', () => {
    renderScreen();
    const membroDesde = screen.getByText('Membro desde');
    expect(membroDesde.closest('.hidden.md\\:grid')).not.toBeNull();
    expect(membroDesde.closest('.md\\:hidden')).toBeNull();

    expect(screen.getByText('março de 2023')).toBeInTheDocument();
    expect(screen.getByText('Indicações feitas')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
    expect(screen.getByText('Presença no ano')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();

    // The stats block lives inside the SAME Card as the identity content, not a separate one —
    // confirm the "Membro desde" row shares an ancestor Card with the "Leonardo Almeida" name.
    const desktopCards = screen.getAllByText('Leonardo Almeida').map((el) => el.closest('.hidden.md\\:grid'));
    expect(desktopCards.some((card) => card?.contains(membroDesde))).toBe(true);
  });

  it('renders "Telefone" only on desktop (absent from the mobile "Meus dados" card)', () => {
    renderScreen();
    const telefoneInputs = screen.getAllByLabelText('Telefone');
    expect(telefoneInputs).toHaveLength(1);
    expect(telefoneInputs[0].closest('.hidden.md\\:grid')).not.toBeNull();
    expect(telefoneInputs[0].closest('.md\\:hidden')).toBeNull();
  });

  it('renders "Nome completo", "E-mail" and "Núcleo" once per surface (mobile + desktop)', () => {
    renderScreen();
    expect(screen.getAllByLabelText('Nome completo')).toHaveLength(2);
    expect(screen.getAllByLabelText('E-mail')).toHaveLength(2);
    expect(screen.getAllByLabelText('Núcleo')).toHaveLength(2);
    expect(screen.getAllByText('Meus dados')).toHaveLength(2);
  });

  it('renders "Salvar alterações" and "Sair da conta" as fullWidth on mobile and non-fullWidth on desktop', () => {
    renderScreen();
    const salvarButtons = screen.getAllByRole('button', { name: 'Salvar alterações' });
    expect(salvarButtons).toHaveLength(2);
    const mobileSalvar = salvarButtons.find((button) => button.closest('.md\\:hidden'));
    const desktopSalvar = salvarButtons.find((button) => button.closest('.hidden.md\\:grid'));
    expect(mobileSalvar).not.toBeUndefined();
    expect(desktopSalvar).not.toBeUndefined();
    expect(mobileSalvar).toHaveClass('w-full');
    expect(desktopSalvar).not.toHaveClass('w-full');

    const sairButtons = screen.getAllByRole('button', { name: 'Sair da conta' });
    expect(sairButtons).toHaveLength(2);
    const mobileSair = sairButtons.find((button) => button.closest('.md\\:hidden'));
    const desktopSair = sairButtons.find((button) => button.closest('.hidden.md\\:grid'));
    expect(mobileSair).not.toBeUndefined();
    expect(desktopSair).not.toBeUndefined();
    expect(mobileSair).toHaveClass('w-full');
    expect(desktopSair).not.toHaveClass('w-full');
  });

  it('has no SectionTitle heading anywhere on the screen', () => {
    renderScreen();
    expect(screen.queryByText('Meu perfil')).not.toBeInTheDocument();
  });

  it('keeps "Nome completo" controlled: typing into it updates the value shared by both mobile and desktop inputs', async () => {
    const user = userEvent.setup();
    renderScreen();

    const [nameInput] = screen.getAllByLabelText('Nome completo') as HTMLInputElement[];
    expect(nameInput.value).toBe('Leonardo Almeida');

    await user.clear(nameInput);
    await user.type(nameInput, 'Leonardo A. Souza');

    const updatedInputs = screen.getAllByLabelText('Nome completo') as HTMLInputElement[];
    expect(updatedInputs).toHaveLength(2);
    for (const input of updatedInputs) {
      expect(input.value).toBe('Leonardo A. Souza');
    }
  });
});

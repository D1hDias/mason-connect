import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecuperarSenhaScreen } from './RecuperarSenhaScreen';

const { requestPasswordResetMock } = vi.hoisted(() => ({ requestPasswordResetMock: vi.fn() }));

vi.mock('../../lib/authClient', () => ({
  authClient: {
    requestPasswordReset: requestPasswordResetMock,
  },
}));

afterEach(() => {
  cleanup();
  requestPasswordResetMock.mockReset();
});

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/recuperar-senha']}>
      <Routes>
        <Route path="/recuperar-senha" element={<RecuperarSenhaScreen />} />
        <Route path="/login" element={<p>Login screen</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RecuperarSenhaScreen', () => {
  it('renders the "Recuperar senha" card with the explanatory paragraph and e-mail field', () => {
    renderScreen();

    expect(screen.getByText('Recuperar senha', { selector: 'p' })).toBeInTheDocument();
    expect(
      screen.getByText('Informe o e-mail cadastrado. Enviaremos um link de redefinição válido por 30 minutos.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar instruções' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar ao login' })).toBeInTheDocument();
  });

  it('calls authClient.requestPasswordReset with the typed e-mail and a redirectTo pointing at /redefinir-senha, then navigates to /login', async () => {
    const user = userEvent.setup();
    requestPasswordResetMock.mockResolvedValue({});
    renderScreen();

    await user.type(screen.getByLabelText('E-mail'), 'irmao@exemplo.com.br');
    await user.click(screen.getByRole('button', { name: 'Enviar instruções' }));

    expect(requestPasswordResetMock).toHaveBeenCalledTimes(1);
    expect(requestPasswordResetMock).toHaveBeenCalledWith({
      email: 'irmao@exemplo.com.br',
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('navigates to /login without calling authClient when "Voltar ao login" is clicked', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Voltar ao login' }));

    expect(requestPasswordResetMock).not.toHaveBeenCalled();
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });
});

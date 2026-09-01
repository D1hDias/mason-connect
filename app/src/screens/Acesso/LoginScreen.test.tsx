import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LoginScreen } from './LoginScreen';

const { signInEmailMock } = vi.hoisted(() => ({ signInEmailMock: vi.fn() }));

vi.mock('../../lib/authClient', () => ({
  authClient: {
    signIn: { email: signInEmailMock },
  },
}));

afterEach(() => {
  cleanup();
  signInEmailMock.mockReset();
});

function renderScreen(initialEntries: Array<string | { pathname: string; state?: unknown }> = ['/login']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/painel" element={<p>Painel</p>} />
        <Route path="/recuperar-senha" element={<p>Recuperar senha screen</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LoginScreen', () => {
  it('renders the "Entrar" card with e-mail and password fields', () => {
    renderScreen();

    expect(screen.getByText('Entrar', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    const senhaInput = screen.getByLabelText('Senha') as HTMLInputElement;
    expect(senhaInput).toBeInTheDocument();
    expect(senhaInput.type).toBe('password');
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Esqueci minha senha' })).toBeInTheDocument();
  });

  it('calls authClient.signIn.email with the typed credentials and navigates to /painel on success', async () => {
    const user = userEvent.setup();
    signInEmailMock.mockImplementation((_payload, { onSuccess }) => {
      onSuccess();
      return Promise.resolve();
    });
    renderScreen();

    await user.type(screen.getByLabelText('E-mail'), 'irmao@exemplo.com.br');
    await user.type(screen.getByLabelText('Senha'), 'segredo123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(signInEmailMock).toHaveBeenCalledTimes(1);
    expect(signInEmailMock.mock.calls[0][0]).toEqual({
      email: 'irmao@exemplo.com.br',
      password: 'segredo123',
    });
    expect(screen.getByText('Painel')).toBeInTheDocument();
  });

  it('shows the server error message inline and does not navigate on failure', async () => {
    const user = userEvent.setup();
    signInEmailMock.mockImplementation((_payload, { onError }) => {
      onError({ error: { message: 'Invalid email or password' } });
      return Promise.resolve();
    });
    renderScreen();

    await user.type(screen.getByLabelText('E-mail'), 'irmao@exemplo.com.br');
    await user.type(screen.getByLabelText('Senha'), 'errada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    expect(screen.queryByText('Painel')).not.toBeInTheDocument();
  });

  it('falls back to a generic error message when the server error has no message', async () => {
    const user = userEvent.setup();
    signInEmailMock.mockImplementation((_payload, { onError }) => {
      onError({ error: { message: '' } });
      return Promise.resolve();
    });
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(screen.getByText('Ocorreu um erro. Tente novamente.')).toBeInTheDocument();
  });

  it('navigates to /recuperar-senha when "Esqueci minha senha" is clicked', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Esqueci minha senha' }));

    expect(screen.getByText('Recuperar senha screen')).toBeInTheDocument();
  });

  it('shows a toast carried via location.state (from RedefinirSenhaScreen) and clears it from history state', () => {
    renderScreen([{ pathname: '/login', state: { toast: 'Senha redefinida. Entre com a nova senha.' } }]);

    expect(screen.getByText('Senha redefinida. Entre com a nova senha.')).toBeInTheDocument();
  });
});

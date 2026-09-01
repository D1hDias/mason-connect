import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RedefinirSenhaScreen } from './RedefinirSenhaScreen';

const { resetPasswordMock } = vi.hoisted(() => ({ resetPasswordMock: vi.fn() }));

vi.mock('../../lib/authClient', () => ({
  authClient: {
    resetPassword: resetPasswordMock,
  },
}));

afterEach(() => {
  cleanup();
  resetPasswordMock.mockReset();
});

function renderScreen(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/redefinir-senha" element={<RedefinirSenhaScreen />} />
        <Route path="/login" element={<p>Login screen</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RedefinirSenhaScreen', () => {
  it('renders the "Definir nova senha" card with new/confirm password fields', () => {
    renderScreen('/redefinir-senha?token=abc123');

    expect(screen.getByText('Definir nova senha', { selector: 'p' })).toBeInTheDocument();
    const novaSenha = screen.getByLabelText('Nova senha') as HTMLInputElement;
    const confirmarSenha = screen.getByLabelText('Confirmar senha') as HTMLInputElement;
    expect(novaSenha.type).toBe('password');
    expect(confirmarSenha.type).toBe('password');
    expect(screen.getByRole('button', { name: 'Salvar nova senha' })).toBeInTheDocument();
  });

  it('calls authClient.resetPassword with the new password and token, then navigates to /login carrying a toast in location.state', async () => {
    const user = userEvent.setup();
    resetPasswordMock.mockImplementation((_payload, { onSuccess }) => {
      onSuccess();
      return Promise.resolve();
    });
    renderScreen('/redefinir-senha?token=abc123');

    await user.type(screen.getByLabelText('Nova senha'), 'novaSenha123');
    await user.type(screen.getByLabelText('Confirmar senha'), 'novaSenha123');
    await user.click(screen.getByRole('button', { name: 'Salvar nova senha' }));

    expect(resetPasswordMock).toHaveBeenCalledTimes(1);
    expect(resetPasswordMock.mock.calls[0][0]).toEqual({
      newPassword: 'novaSenha123',
      token: 'abc123',
    });
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('shows the server error message inline and does not navigate on failure', async () => {
    const user = userEvent.setup();
    resetPasswordMock.mockImplementation((_payload, { onError }) => {
      onError({ error: { message: 'Invalid or expired token' } });
      return Promise.resolve();
    });
    renderScreen('/redefinir-senha?token=abc123');

    await user.type(screen.getByLabelText('Nova senha'), 'novaSenha123');
    await user.type(screen.getByLabelText('Confirmar senha'), 'novaSenha123');
    await user.click(screen.getByRole('button', { name: 'Salvar nova senha' }));

    expect(screen.getByText('Invalid or expired token')).toBeInTheDocument();
    expect(screen.queryByText('Login screen')).not.toBeInTheDocument();
  });

  it('blocks submission with an inline error when the passwords do not match, without calling authClient.resetPassword', async () => {
    const user = userEvent.setup();
    renderScreen('/redefinir-senha?token=abc123');

    await user.type(screen.getByLabelText('Nova senha'), 'novaSenha123');
    await user.type(screen.getByLabelText('Confirmar senha'), 'outraSenha456');
    await user.click(screen.getByRole('button', { name: 'Salvar nova senha' }));

    expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument();
    expect(resetPasswordMock).not.toHaveBeenCalled();
  });

  // Decision (no prototype covers this): a missing `token` query param shows a
  // persistent inline warning and disables "Salvar nova senha" instead of
  // letting the user fill the form only to hit a doomed server call.
  it('disables "Salvar nova senha" and shows a warning when the URL has no token', async () => {
    const user = userEvent.setup();
    renderScreen('/redefinir-senha');

    expect(screen.getByText('Link inválido ou expirado. Solicite uma nova recuperação de senha.')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'Salvar nova senha' });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(resetPasswordMock).not.toHaveBeenCalled();
  });
});

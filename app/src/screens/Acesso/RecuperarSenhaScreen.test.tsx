import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
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

/** Renders whatever `location.state?.toast` arrived at /login — how LoginScreen consumes it. */
function LoginStub() {
  const location = useLocation();
  const state = location.state as { toast?: string } | null;
  return (
    <div>
      <p>Login screen</p>
      {state?.toast && <p>{state.toast}</p>}
    </div>
  );
}

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/recuperar-senha']}>
      <Routes>
        <Route path="/recuperar-senha" element={<RecuperarSenhaScreen />} />
        <Route path="/login" element={<LoginStub />} />
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

  it('calls authClient.requestPasswordReset with the typed e-mail and a redirectTo pointing at /redefinir-senha, then navigates to /login carrying the toast in location.state', async () => {
    const user = userEvent.setup();
    requestPasswordResetMock.mockImplementation((_payload, { onSuccess }) => {
      onSuccess();
      return Promise.resolve();
    });
    renderScreen();

    await user.type(screen.getByLabelText('E-mail'), 'irmao@exemplo.com.br');
    await user.click(screen.getByRole('button', { name: 'Enviar instruções' }));

    expect(requestPasswordResetMock).toHaveBeenCalledTimes(1);
    expect(requestPasswordResetMock.mock.calls[0][0]).toEqual({
      email: 'irmao@exemplo.com.br',
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    expect(screen.getByText('Login screen')).toBeInTheDocument();
    // The state-carried toast — not a local useLocalToast/LocalToastHost, which
    // would unmount with this screen before ever painting (React 18 batches the
    // setState + navigate() in the same commit).
    expect(screen.getByText('Instruções enviadas. Verifique sua caixa de entrada.')).toBeInTheDocument();
  });

  it('shows a generic inline error and does not navigate when the request fails', async () => {
    const user = userEvent.setup();
    requestPasswordResetMock.mockImplementation((_payload, { onError }) => {
      onError({ error: { message: 'Network error' } });
      return Promise.resolve();
    });
    renderScreen();

    await user.type(screen.getByLabelText('E-mail'), 'irmao@exemplo.com.br');
    await user.click(screen.getByRole('button', { name: 'Enviar instruções' }));

    expect(screen.getByText('Ocorreu um erro. Tente novamente.')).toBeInTheDocument();
    expect(screen.queryByText('Login screen')).not.toBeInTheDocument();
  });

  it('navigates to /login without calling authClient when "Voltar ao login" is clicked', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Voltar ao login' }));

    expect(requestPasswordResetMock).not.toHaveBeenCalled();
    expect(screen.getByText('Login screen')).toBeInTheDocument();
    expect(screen.queryByText('Instruções enviadas. Verifique sua caixa de entrada.')).not.toBeInTheDocument();
  });
});

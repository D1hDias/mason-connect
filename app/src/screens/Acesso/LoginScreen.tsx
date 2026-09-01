import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from 'mason-connect-design-system';
import { authClient } from '../../lib/authClient';
import { useLocalToast } from '../../hooks/useLocalToast';
import { AcessoLayout } from './AcessoLayout';
import { LocalToastHost } from './LocalToastHost';

interface LoginLocationState {
  toast?: string;
}

/**
 * Tela real de login (Task 10, `Fase2Acesso.dc.html:32-40`). Rota irmã fora
 * do `AppShell` — sem `BottomNav`/`AppOverlaysProvider`, por isso o toast é
 * local (`useLocalToast`), não `useToast()`.
 *
 * Também lê `location.state?.toast` uma única vez no mount: é assim que
 * `RedefinirSenhaScreen` entrega "Senha redefinida..." depois de navegar pra
 * cá — o `useLocalToast` DELA não sobreviveria à navegação a tempo de exibir
 * a mensagem, então a mensagem viaja no `state` da navegação e é mostrada
 * aqui. O `state` é limpo em seguida (`replace: true, state: {}`) pra não
 * reaparecer num refresh ou "voltar" do navegador.
 */
export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const { toastMessage, showToast } = useLocalToast();

  useEffect(() => {
    const state = location.state as LoginLocationState | null;
    if (state?.toast) {
      showToast(state.toast);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // Mount-only: consumes whatever arrived with THIS navigation, once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleEntrar() {
    setErro(null);
    await authClient.signIn.email(
      { email, password: senha },
      {
        onSuccess: () => {
          navigate('/painel');
        },
        onError: (ctx) => {
          setErro(ctx.error.message || 'Ocorreu um erro. Tente novamente.');
        },
      },
    );
  }

  return (
    <AcessoLayout>
      <Card>
        <p className="mb-[18px] font-heading text-lg font-bold text-brand-brown">Entrar</p>
        <div className="flex flex-col gap-3.5">
          <Input
            label="E-mail"
            type="email"
            placeholder="irmao@exemplo.com.br"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />
        </div>
        {erro && <p className="mt-3 text-xs text-status-critical-fg">{erro}</p>}
        <div className="mt-5 flex flex-col items-center gap-3.5">
          <Button variant="primary" fullWidth onClick={handleEntrar}>
            Entrar
          </Button>
          <button
            type="button"
            onClick={() => navigate('/recuperar-senha')}
            className="inline-flex min-h-[44px] items-center text-[13px] font-semibold text-brand-brown underline underline-offset-4"
          >
            Esqueci minha senha
          </button>
        </div>
      </Card>
      <LocalToastHost message={toastMessage} />
    </AcessoLayout>
  );
}

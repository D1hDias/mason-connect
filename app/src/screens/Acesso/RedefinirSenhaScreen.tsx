import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Input } from 'mason-connect-design-system';
import { authClient } from '../../lib/authClient';
import { AcessoLayout } from './AcessoLayout';

/**
 * Tela real de redefinição de senha (Task 10, achado #21 — SEM protótipo, o
 * fluxo original só ia até "enviar o link"; segue a mesma linguagem visual
 * de `LoginScreen`/`RecuperarSenhaScreen`). Lê `token` da query string
 * (`?token=...`, como o link do e-mail chega no navegador).
 *
 * Decisão pra `token` ausente (não especificado no protótipo): mostra um
 * aviso inline persistente e desabilita "Salvar nova senha" — evita uma
 * chamada ao servidor fadada a falhar e deixa claro o que fazer (pedir um
 * novo link em `/recuperar-senha`), em vez de deixar o usuário preencher o
 * form pra só então descobrir que o link é inválido.
 *
 * Sucesso navega pra `/login` levando a mensagem de toast via
 * `navigate(..., { state: { toast } })` — `LoginScreen` é quem efetivamente
 * mostra esse toast (ver comentário lá) porque um `useLocalToast` aqui não
 * sobreviveria à navegação a tempo de aparecer.
 */
export function RedefinirSenhaScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  async function handleSalvar() {
    if (!token) {
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    setErro(null);
    await authClient.resetPassword(
      { newPassword: novaSenha, token },
      {
        onSuccess: () => {
          navigate('/login', { state: { toast: 'Senha redefinida. Entre com a nova senha.' } });
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
        <p className="mb-[18px] font-heading text-lg font-bold text-brand-brown">Definir nova senha</p>
        {!token && (
          <p className="mb-3.5 text-xs text-status-critical-fg">
            Link inválido ou expirado. Solicite uma nova recuperação de senha.
          </p>
        )}
        <div className="flex flex-col gap-3.5">
          <Input
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            value={novaSenha}
            onChange={(event) => setNovaSenha(event.target.value)}
          />
          <Input
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            value={confirmarSenha}
            onChange={(event) => setConfirmarSenha(event.target.value)}
          />
        </div>
        {erro && <p className="mt-3 text-xs text-status-critical-fg">{erro}</p>}
        <div className="mt-5">
          <Button variant="primary" fullWidth onClick={handleSalvar} disabled={!token}>
            Salvar nova senha
          </Button>
        </div>
      </Card>
    </AcessoLayout>
  );
}

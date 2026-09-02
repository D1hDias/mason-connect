import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from 'mason-connect-design-system';
import { authClient } from '../../lib/authClient';
import { AcessoLayout } from './AcessoLayout';

/**
 * Tela real de recuperação de senha (Task 10, `Fase2Acesso.dc.html:42-51`).
 * "Enviar instruções" navega pra `/login` levando a mensagem de toast via
 * `navigate(..., { state: { toast } })` — MESMO padrão de
 * `RedefinirSenhaScreen` (`LoginScreen` lê `location.state?.toast` no
 * mount). Achado de revisão: um `useLocalToast` local aqui não funcionaria
 * — `showToast()` + `navigate()` síncronos no mesmo handler são batchados
 * pelo React 18 no mesmo commit, então esta tela (e o `LocalToastHost`
 * dela) desmontam antes de qualquer frame com o toast visível chegar a
 * pintar. "Voltar ao login" navega sem `state` nenhum (sem toast).
 */
export function RecuperarSenhaScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleEnviar() {
    setErro(null);
    setSubmitting(true);
    try {
      await authClient.requestPasswordReset(
        {
          email,
          redirectTo: `${window.location.origin}/redefinir-senha`,
        },
        {
          onSuccess: () => {
            navigate('/login', { state: { toast: 'Instruções enviadas. Verifique sua caixa de entrada.' } });
          },
          onError: () => {
            // Mensagem genérica de propósito: diferente de LoginScreen, este
            // endpoint é fire-and-forget por design no servidor (evita
            // vazar se o e-mail existe via timing attack) — não há uma
            // mensagem de erro "legítima" do usuário pra repassar aqui, só
            // falhas reais de rede/servidor.
            setErro('Ocorreu um erro. Tente novamente.');
          },
        },
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void handleEnviar();
  }

  return (
    <AcessoLayout>
      <Card>
        <p className="mb-1.5 font-heading text-lg font-bold text-brand-brown">Recuperar senha</p>
        <p className="mb-[18px] text-[13px] leading-relaxed text-brand-bronze">
          Informe o e-mail cadastrado. Enviaremos um link de redefinição válido por 30 minutos.
        </p>
        <form onSubmit={handleSubmit} className="contents">
          <Input
            label="E-mail"
            type="email"
            placeholder="irmao@exemplo.com.br"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {erro && <p className="mt-3 text-xs text-status-critical-fg">{erro}</p>}
          <div className="mt-5 flex flex-col gap-2.5">
            <Button type="submit" variant="primary" fullWidth disabled={submitting}>
              Enviar instruções
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => navigate('/login')}>
              Voltar ao login
            </Button>
          </div>
        </form>
      </Card>
    </AcessoLayout>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from 'mason-connect-design-system';
import { authClient } from '../../lib/authClient';
import { useLocalToast } from '../../hooks/useLocalToast';
import { AcessoLayout } from './AcessoLayout';
import { LocalToastHost } from './LocalToastHost';

/**
 * Tela real de recuperação de senha (Task 10, `Fase2Acesso.dc.html:42-51`).
 * "Enviar instruções" navega pra `/login` com um toast local pendente (a
 * navegação acontece mesmo que o toast local ainda esteja visível — mesma
 * UX de outras telas do app que navegam com um toast pendente, achado #7 do
 * plano). "Voltar ao login" navega sem toast nenhum.
 */
export function RecuperarSenhaScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { toastMessage, showToast } = useLocalToast();

  async function handleEnviar() {
    await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    showToast('Instruções enviadas. Verifique sua caixa de entrada.');
    navigate('/login');
  }

  return (
    <AcessoLayout>
      <Card>
        <p className="mb-1.5 font-heading text-lg font-bold text-brand-brown">Recuperar senha</p>
        <p className="mb-[18px] text-[13px] leading-relaxed text-brand-bronze">
          Informe o e-mail cadastrado. Enviaremos um link de redefinição válido por 30 minutos.
        </p>
        <Input
          label="E-mail"
          type="email"
          placeholder="irmao@exemplo.com.br"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="mt-5 flex flex-col gap-2.5">
          <Button variant="primary" fullWidth onClick={handleEnviar}>
            Enviar instruções
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/login')}>
            Voltar ao login
          </Button>
        </div>
      </Card>
      <LocalToastHost message={toastMessage} />
    </AcessoLayout>
  );
}

import { useState } from 'react';
import { Avatar, Badge, Button, Card, Input, Select } from 'mason-connect-design-system';
import { useConfirmModal, useToast } from '../../shell/overlays/AppOverlaysProvider';
import { profile } from '../../data/profile';
import { nucleos } from '../../data/nucleos';
import type { PlanoTipo } from '../../data/nucleos';

const PLANO_LABELS: Record<PlanoTipo, string> = {
  isento: 'Isento',
  mensal: 'Plano Mensal',
  anual: 'Plano Anual',
};

/**
 * `profile.ts` não traz e-mail/telefone (não especificados no PRD/protótipo,
 * que só exibe rótulos de campo vazios) — placeholders plausíveis definidos
 * aqui, mesmo padrão dos KPIs literais de tela usados em Painel/Membros/
 * Financeiro (achado documentado nos briefs dos Tasks 6-8).
 */
const PLACEHOLDER_EMAIL = 'leonardo.almeida@masonconnect.com.br';
const PLACEHOLDER_PHONE = '(21) 99876-5432';

interface PerfilFormState {
  name: string;
  email: string;
  phone: string;
  /** Valor do `Select` (`nucleos.ts`), não o rótulo armazenado em `profile.nucleo`. */
  nucleo: string;
}

function initialNucleoValue(): string {
  return nucleos.find((option) => option.label === profile.nucleo)?.value ?? nucleos[0].value;
}

/**
 * Card de identidade — Avatar, nome, cadeira, badges "Ativo"/"Plano Anual".
 * O bloco de estatísticas (Membro desde / Indicações feitas / Presença no
 * ano) mora dentro deste MESMO `Card`, só desktop (`DesktopApp.dc.html:167-171`)
 * — nunca um `Card` separado.
 */
function IdentityCard({ isDesktop }: { isDesktop: boolean }) {
  const statusLabel = profile.status === 'ativo' ? 'Ativo' : 'Pendente';
  const statusVariant = profile.status === 'ativo' ? ('success' as const) : ('neutral' as const);

  return (
    <Card>
      <div className="flex items-center gap-3.5">
        <Avatar name={profile.name} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-heading text-xl font-bold text-brand-brown">{profile.name}</span>
          <span className="text-xs text-brand-bronze">Cadeira: {profile.cadeira}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Badge variant={statusVariant}>{statusLabel}</Badge>
        <Badge variant="accent">{PLANO_LABELS[profile.planoTipo]}</Badge>
      </div>
      {isDesktop && (
        <div className="mt-5 flex flex-col gap-2.5 border-t border-border pt-[18px]">
          <span className="flex justify-between text-[13px]">
            <span className="text-brand-bronze">Membro desde</span>
            <b className="mc-num font-bold">{profile.memberSince}</b>
          </span>
          <span className="flex justify-between text-[13px]">
            <span className="text-brand-bronze">Indicações feitas</span>
            <b className="mc-num font-bold">{profile.indicacoesFeitas}</b>
          </span>
          <span className="flex justify-between text-[13px]">
            <span className="text-brand-bronze">Presença no ano</span>
            <b className="mc-num font-bold">{profile.presencaAnoPercent}%</b>
          </span>
        </div>
      )}
    </Card>
  );
}

/**
 * Card "Meus dados". Desktop: grade `md:grid-cols-2` com os 4 campos (Nome,
 * E-mail, Telefone, Núcleo) e, dentro do MESMO `Card`, a linha de botões
 * "Salvar alterações"/"Sair da conta" (`DesktopApp.dc.html:173-185` — os
 * botões são filhos do card, não irmãos). Mobile: coluna única, sem
 * Telefone, e SEM os botões dentro do card — eles são irmãos soltos do card
 * na tela mobile (`MobileApp.dc.html:109-116`).
 */
function MeusDadosCard({
  isDesktop,
  form,
  onFieldChange,
  onSalvar,
  onSair,
}: {
  isDesktop: boolean;
  form: PerfilFormState;
  onFieldChange: (field: keyof PerfilFormState, value: string) => void;
  onSalvar: () => void;
  onSair: () => void;
}) {
  return (
    <Card>
      <p className="mb-[18px] font-heading text-lg font-bold text-brand-brown">Meus dados</p>
      <div className={isDesktop ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-4'}>
        <Input label="Nome completo" value={form.name} onChange={(e) => onFieldChange('name', e.target.value)} />
        <Input label="E-mail" value={form.email} onChange={(e) => onFieldChange('email', e.target.value)} />
        {isDesktop && (
          <Input label="Telefone" value={form.phone} onChange={(e) => onFieldChange('phone', e.target.value)} />
        )}
        <Select
          label="Núcleo"
          options={nucleos}
          value={form.nucleo}
          onChange={(e) => onFieldChange('nucleo', e.target.value)}
        />
      </div>
      {isDesktop && (
        <div className="mt-[22px] flex gap-2.5">
          <Button variant="primary" onClick={onSalvar}>
            Salvar alterações
          </Button>
          <Button variant="secondary" onClick={onSair}>
            Sair da conta
          </Button>
        </div>
      )}
    </Card>
  );
}

/**
 * Tela "Perfil" — última das 4 telas (Task 9). Sem `SectionTitle`: nem
 * mobile (protótipo mobile não a usa, achado documentado em
 * `shell/screens-meta.ts`) nem desktop (título/subtítulo já vêm do
 * `DesktopTopbar`, mesmo padrão das outras 3 telas).
 *
 * Grade externa desktop `1fr 1.4fr` (`DesktopApp.dc.html:154`) — não
 * confundir com a grade interna `md:grid-cols-2` dos campos do card "Meus
 * dados", que é um detalhe totalmente separado.
 *
 * Inputs controlados via `useState`, sem validação nenhuma. Ainda sem
 * persistência real: "Salvar alterações" e "Sair da conta" dão feedback via
 * `Toast`/`ConfirmModal` em vez de serem no-ops silenciosos — clicar e não
 * ver nada acontecer lê como bug, não como escopo pendente.
 */
export function PerfilScreen() {
  const { showToast } = useToast();
  const { confirm } = useConfirmModal();
  const [form, setForm] = useState<PerfilFormState>(() => ({
    name: profile.name,
    email: PLACEHOLDER_EMAIL,
    phone: PLACEHOLDER_PHONE,
    nucleo: initialNucleoValue(),
  }));

  function handleFieldChange(field: keyof PerfilFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  // Sem persistência real neste escopo — só o retorno visual.
  function handleSalvar() {
    showToast('Alterações salvas no seu perfil.');
  }

  // Sem sessão real modelada aqui (ver `lib/authClient.ts`) — confirma e
  // devolve o feedback, sem navegar para `/login`.
  function handleSair() {
    confirm({
      titulo: 'Sair da conta?',
      corpo: 'Você precisará entrar novamente para acessar o núcleo.',
      nota: 'Alterações não salvas neste formulário serão perdidas.',
      acao: 'Sair da conta',
      onConfirm: () => showToast('Sessão encerrada.'),
    });
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-8 md:py-7">
      <div className="md:hidden">
        <IdentityCard isDesktop={false} />
      </div>
      <div className="md:hidden">
        <MeusDadosCard
          isDesktop={false}
          form={form}
          onFieldChange={handleFieldChange}
          onSalvar={handleSalvar}
          onSair={handleSair}
        />
      </div>
      <div className="md:hidden">
        <Button variant="primary" fullWidth onClick={handleSalvar}>
          Salvar alterações
        </Button>
      </div>
      <div className="md:hidden">
        <Button variant="secondary" fullWidth onClick={handleSair}>
          Sair da conta
        </Button>
      </div>

      <div className="hidden items-start gap-[18px] md:grid md:grid-cols-[1fr_1.4fr]">
        <IdentityCard isDesktop />
        <MeusDadosCard
          isDesktop
          form={form}
          onFieldChange={handleFieldChange}
          onSalvar={handleSalvar}
          onSair={handleSair}
        />
      </div>
    </div>
  );
}

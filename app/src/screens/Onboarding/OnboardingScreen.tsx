import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  List,
  ListRow,
  ProgressBar,
  SectionTitle,
  Stat,
} from 'mason-connect-design-system';
import { profile } from '../../data/profile';
import { emOnboarding } from '../../data/onboarding';
import { useLocalToast } from '../../hooks/useLocalToast';
import { OnboardingHeader } from './OnboardingHeader';
import { LocalToastHost } from '../Acesso/LocalToastHost';

interface Etapa {
  id: string;
  titulo: string;
  detalhe: string;
}

/** As 3 etapas obrigatórias do percurso de entrada, `Fase2Acesso.dc.html:87-98`. */
const ETAPAS: Etapa[] = [
  { id: 'boas-vindas', titulo: 'Boas-vindas do núcleo', detalhe: 'Acolhimento na primeira reunião presencial' },
  { id: 'pilares', titulo: 'Apresentação dos 12 Pilares', detalhe: 'Leitura guiada com o padrinho · 40 min' },
  { id: 'um-a-um', titulo: '1ª reunião 1-a-1 com o padrinho', detalhe: 'Agendar em até 30 dias da aprovação' },
];

/** A 1ª etapa já vem concluída no estado inicial (fiel ao protótipo). */
const ETAPAS_INICIAIS = new Set<string>(['boas-vindas']);

/**
 * Uma linha de "Etapas obrigatórias" — substitui `ListRow` porque a linha
 * inteira é um botão clicável com um check circular customizado (mesmo
 * raciocínio de `MemberRow` em `MembrosScreen.tsx`: `List` clona qualquer
 * elemento filho válido e injeta `className` nele para o zebra-striping,
 * então funciona igual com um componente próprio). Clicar numa etapa já
 * concluída é no-op (sem `onClick` re-disparado — ver `handleEtapaClick`).
 */
function EtapaRow({
  etapa,
  done,
  onClick,
  className,
}: {
  etapa: Etapa;
  done: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[44px] w-full items-center justify-between gap-3 px-5 py-3.5 text-left ${className ?? ''}`}
    >
      <span className="flex min-w-0 items-center gap-3.5">
        <span
          className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 text-xs font-bold ${
            done
              ? 'border-status-success-fg bg-status-success-fg text-white'
              : 'border-brand-gold text-transparent'
          }`}
        >
          ✓
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-semibold">{etapa.titulo}</span>
          <span className="text-[11px] leading-snug text-brand-bronze">{etapa.detalhe}</span>
        </span>
      </span>
      <Badge variant={done ? 'success' : 'neutral'}>{done ? 'Concluída' : 'Pendente'}</Badge>
    </button>
  );
}

/**
 * Branch `profile.categoria === 'empresario'` (e, por decisão documentada em
 * `OnboardingScreen`, também `'administrativo'`): o próprio percurso de
 * entrada do membro. `concluidas` é local à tela — nunca desmarca uma etapa,
 * só adiciona (`useState` de `Set<string>`, mesmo padrão de `approvedNames`
 * em `MembrosScreen`).
 */
function MembroContent({ showToast }: { showToast: (message: string) => void }) {
  const [concluidas, setConcluidas] = useState<Set<string>>(() => new Set(ETAPAS_INICIAIS));
  const total = ETAPAS.length;
  const numConcluidas = concluidas.size;

  const subtitle =
    numConcluidas === total
      ? 'Percurso concluído · bem-vindo ao núcleo'
      : `${numConcluidas} de ${total} etapas concluídas · aprovado em 12 de agosto`;

  function handleEtapaClick(etapa: Etapa) {
    if (concluidas.has(etapa.id)) {
      return;
    }
    setConcluidas((prev) => {
      const next = new Set(prev);
      next.add(etapa.id);
      return next;
    });
    showToast('Etapa registrada. Seu padrinho foi notificado.');
  }

  return (
    <>
      <SectionTitle subtitle={subtitle}>Boas-vindas, Irmão</SectionTitle>
      <Card>
        <ProgressBar label="Percurso de entrada" value={numConcluidas} percent={numConcluidas / total} tone="accent" />
        <p className="mt-2.5 text-xs leading-relaxed text-brand-bronze">
          As três etapas são obrigatórias e liberam o registro de indicações.
        </p>
      </Card>
      <List header="Etapas obrigatórias">
        {ETAPAS.map((etapa) => (
          <EtapaRow
            key={etapa.id}
            etapa={etapa}
            done={concluidas.has(etapa.id)}
            onClick={() => handleEtapaClick(etapa)}
          />
        ))}
      </List>
      <Card>
        <p className="mb-3.5 font-heading text-lg font-bold text-brand-brown">Seu padrinho</p>
        <div className="flex items-center gap-3.5">
          <Avatar name="Leonardo Almeida" />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-semibold">Leonardo Almeida</span>
            <span className="text-xs text-brand-bronze">Consultoria Empresarial · desde março de 2023</span>
          </span>
        </div>
        <div className="mt-4">
          {/* Sem handler: no-op documentado, mesmo padrão de ações sem dado real por trás já usado em Perfil. */}
          <Button variant="secondary" fullWidth>
            Agendar reunião 1-a-1
          </Button>
        </div>
      </Card>
      <Card>
        <div className="flex items-start justify-between gap-3">
          <span className="flex min-w-0 flex-col gap-1.5">
            <span className="text-sm font-semibold">Prazo de conclusão</span>
            <span className="text-xs leading-relaxed text-brand-bronze">
              Onboarding incompleto após 30 dias é sinalizado ao Gestor do núcleo.
            </span>
          </span>
          <Badge variant="warning">Dia 19 de 30</Badge>
        </div>
      </Card>
    </>
  );
}

/** Branch `profile.categoria === 'gestor'`: visão consolidada do núcleo. */
function GestorContent() {
  return (
    <>
      <SectionTitle subtitle="4 membros em percurso de entrada">Onboarding do núcleo</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Em andamento" value="4" hint="dos 24 membros" tone="accent" />
        <Stat label="Acima de 30 dias" value="1" hint="requer conversa" tone="default" />
      </div>
      <List header="Percurso por membro">
        {emOnboarding.map((o) => (
          <ListRow
            key={o.nome}
            leading={<Avatar name={o.nome} tone="pending" />}
            title={o.nome}
            subtitle={`${o.etapa} · ${o.dias} dias desde a aprovação`}
            trailing={<Badge variant={o.dias > 30 ? 'critical' : 'neutral'}>{o.dias} dias</Badge>}
          />
        ))}
      </List>
      <Card>
        <p className="mb-4 font-heading text-lg font-bold text-brand-brown">Conclusão por etapa</p>
        <ProgressBar label="Boas-vindas" value={4} percent={1} tone="success" />
        <ProgressBar label="Apresentação dos 12 Pilares" value={3} percent={0.75} tone="accent" />
        <ProgressBar label="1ª reunião com o padrinho" value={1} percent={0.25} tone="accent" />
      </Card>
    </>
  );
}

/**
 * Tela "Onboarding" (`Fase2Acesso.dc.html:61-137`). Rota standalone
 * (`/onboarding`), fora do `AppShell` — sem `BottomNav`/sidebar/topbar
 * compartilhados, só o `OnboardingHeader` próprio desta tela. Não entra em
 * `navItems`/`moduleItems`: só alcançável por navegação direta (achado #5
 * do plano) — ver teste dedicado a essa ausência.
 *
 * Dois branches por `profile.categoria`. O protótipo só cobre `'empresario'`
 * (visão do próprio membro em onboarding) e `'gestor'` (visão do núcleo); o
 * terceiro valor do type, `'administrativo'`, não tem branch dedicado nele
 * — decisão (não especificada, o mock real é sempre `'gestor'`): cai no
 * branch de `'empresario'`, já que semanticamente é também alguém *sujeito*
 * ao onboarding (não um gestor supervisionando o núcleo inteiro).
 *
 * `useLocalToast` (Task 10) porque esta tela, como as 3 de `Acesso`, fica
 * fora do `AppOverlaysProvider` e não tem acesso ao `useToast()` do overlay
 * compartilhado.
 */
export function OnboardingScreen() {
  const { toastMessage, showToast } = useLocalToast();

  return (
    <div className="relative flex min-h-screen flex-col bg-brand-cream">
      <OnboardingHeader />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-4 px-4 py-5">
        {profile.categoria === 'gestor' ? <GestorContent /> : <MembroContent showToast={showToast} />}
      </main>
      <LocalToastHost message={toastMessage} />
    </div>
  );
}

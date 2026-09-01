import { useState, type ReactNode } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  FilterTabs,
  List,
  SectionTitle,
  Stat,
} from 'mason-connect-design-system';
import { screensMeta } from '../../shell/screens-meta';
import { abbreviateName } from '../../data/surface';
import { members, type Member, type MemberStatus } from '../../data/members';
import { profile } from '../../data/profile';
import { useConfirmModal, useToast } from '../../shell/overlays/AppOverlaysProvider';

const meta = screensMeta['/membros'];

type MemberFilterValue = 'todos' | 'ativo' | 'pendente';

const FILTER_OPTIONS: { label: string; value: MemberFilterValue }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Ativos', value: 'ativo' },
  { label: 'Pendentes', value: 'pendente' },
];

/** "Cadeiras em aberto" — 4 pílulas fixas do protótipo desktop, sem dataset. */
const CHAIR_BADGES = ['Odontologia', 'Marketing', 'Logística', 'Engenharia civil'];

/**
 * Filtro puro, exportado para teste isolado do branch `EmptyState`: com os
 * 6 membros canônicos (Jackson Pereira e Davi Lopes pendentes, os demais
 * ativos) nenhum valor real de `MemberFilterValue` zera a lista — o branch
 * só é alcançável passando um filtro fora do domínio, testado diretamente
 * aqui (não via clique simulado em `FilterTabs`).
 */
export function filterMembers(list: Member[], filter: string): Member[] {
  return filter === 'todos' ? list : list.filter((member) => member.status === filter);
}

function statusBadge(member: Member) {
  return member.status === 'ativo'
    ? { variant: 'success' as const, label: 'Ativo' }
    : { variant: 'neutral' as const, label: 'Pendente' };
}

/**
 * Substitui `ListRow` para membros: até 3 linhas empilhadas. Linha 1 é
 * idêntica ao que `ListRow` renderizava (avatar/nome/subtítulo/badge);
 * linhas 2 e 3 são condicionais (alerta de faltas, botões de decisão de
 * gestor). Aceita `className` porque `List` clona QUALQUER elemento filho
 * válido e injeta `className` nele para o zebra-striping — funciona com
 * qualquer componente, não só `ListRow` (ver `List.tsx`).
 */
function MemberRow({
  member,
  displayName,
  effectiveStatus,
  onApprove,
  onReject,
  className,
}: {
  member: Member;
  displayName: ReactNode;
  effectiveStatus: MemberStatus;
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}) {
  const badge = statusBadge({ ...member, status: effectiveStatus });
  const faltas = member.faltas;
  const showDecisionButtons = profile.categoria === 'gestor' && effectiveStatus === 'pendente';

  return (
    <div className={`flex flex-col gap-2 px-5 py-3.5 ${className ?? ''}`}>
      <div className="flex min-h-[44px] items-center justify-between gap-3">
        <Avatar name={member.name} tone={effectiveStatus === 'ativo' ? 'active' : 'pending'} />
        <div className="flex-1">
          <p className="font-semibold">{displayName}</p>
          <p className="text-xs text-brand-bronze">{member.role}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </div>

      {faltas !== undefined && faltas >= 2 && (
        <div className="pl-[52px]">
          {faltas >= 3 ? (
            <Badge variant="critical">3 faltas seguidas · crítico</Badge>
          ) : (
            <Badge variant="warning">2 faltas seguidas</Badge>
          )}
        </div>
      )}

      {showDecisionButtons && (
        <div className="flex flex-wrap gap-2 pl-[52px]">
          <Button variant="primary" onClick={onApprove}>
            Aprovar cadastro
          </Button>
          <Button variant="danger" onClick={onReject}>
            Recusar
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Tela "Membros". Retenção 92% e as 4 cadeiras em aberto são literais do
 * protótipo desktop — não existem em `data/` (mesmo padrão dos KPIs
 * literais do Painel, achado documentado no brief do Task 6).
 *
 * "Aprovar"/"Recusar" nunca mutam o array `members` importado de
 * `data/members.ts` — o efeito de "aprovar" é local a esta tela,
 * rastreado em `approvedNames`, e derivado na hora de renderizar via
 * `getEffectiveStatus`. "Recusar" não muda nenhum estado (fiel ao
 * protótipo original, que só dispara o toast) — o membro segue
 * `'pendente'` e os botões seguem visíveis depois.
 */
export function MembrosScreen() {
  const [filter, setFilter] = useState<MemberFilterValue>('todos');
  const [approvedNames, setApprovedNames] = useState<Set<string>>(new Set());
  const { confirm } = useConfirmModal();
  const { showToast } = useToast();

  const getEffectiveStatus = (member: Member): MemberStatus =>
    approvedNames.has(member.name) ? 'ativo' : member.status;

  const handleApprove = (member: Member) => {
    confirm({
      titulo: `Aprovar o cadastro de ${member.name}?`,
      corpo: `A aprovação é definitiva e dá acesso imediato ao núcleo. Cadeira: ${member.role}.`,
      nota: 'Registra autor, data e hora na trilha de auditoria (RN-02 · RN-33).',
      acao: 'Aprovar cadastro',
      onConfirm: () => {
        setApprovedNames((prev) => {
          const next = new Set(prev);
          next.add(member.name);
          return next;
        });
        showToast(`${member.name} foi aprovado. O padrinho já pode iniciar o onboarding.`);
      },
    });
  };

  const handleReject = (member: Member) => {
    confirm({
      titulo: `Recusar o cadastro de ${member.name}?`,
      corpo: 'O candidato não será notificado automaticamente. A recusa fica registrada para consulta da gestão.',
      nota: 'O motivo é opcional e entra na trilha de auditoria.',
      acao: 'Recusar cadastro',
      pedeMotivo: true,
      onConfirm: () => {
        showToast(`Cadastro de ${member.name} recusado.`);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-8 md:py-7">
      <div className="md:hidden">
        <SectionTitle subtitle={meta.mobileSubtitle}>{meta.title}</SectionTitle>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterTabs
          options={FILTER_OPTIONS}
          value={filter}
          onChange={(value) => setFilter(value as MemberFilterValue)}
        />
        <div className="hidden md:block">
          <Button variant="primary">Convidar novo membro</Button>
        </div>
      </div>

      <div className="md:hidden">
        <MembersRows
          isDesktop={false}
          filter={filter}
          getEffectiveStatus={getEffectiveStatus}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
      <div className="md:hidden">
        <Button variant="secondary" fullWidth>
          Convidar novo membro
        </Button>
      </div>

      <div className="hidden items-start gap-[18px] md:grid md:grid-cols-[1.7fr_1fr]">
        <MembersRows
          isDesktop
          filter={filter}
          getEffectiveStatus={getEffectiveStatus}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        <div className="flex flex-col gap-[18px]">
          <Stat label="Taxa de retenção" value="92%" hint="12 meses" tone="success" />
          <Card>
            <p className="mb-3 font-heading text-lg font-bold text-brand-brown">Cadeiras em aberto</p>
            <div className="flex flex-wrap gap-2">
              {CHAIR_BADGES.map((label) => (
                <Badge key={label} variant="neutral">
                  {label}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * "Quadro de membros" — renderizada duas vezes (mobile e desktop) porque as
 * duas fontes divergem: mobile usa `members.slice(0, 5)` com nomes
 * abreviados (`abbreviateName`), desktop usa os 6 registros completos com
 * nome cheio. Uma única `List` com linhas escondidas via CSS quebraria o
 * zebra-striping por índice do componente (mesmo raciocínio do
 * `MeetingsList` em Painel, Task 6).
 */
function MembersRows({
  isDesktop,
  filter,
  getEffectiveStatus,
  onApprove,
  onReject,
}: {
  isDesktop: boolean;
  filter: MemberFilterValue;
  getEffectiveStatus: (member: Member) => MemberStatus;
  onApprove: (member: Member) => void;
  onReject: (member: Member) => void;
}) {
  const source = isDesktop ? members : members.slice(0, 5);
  const visible = filterMembers(source, filter);

  if (visible.length === 0) {
    return <EmptyState message="Nenhum membro neste filtro." hint="Ajuste o filtro acima para ver mais nomes." />;
  }

  return (
    <List header={isDesktop ? 'Quadro de membros' : undefined}>
      {visible.map((member) => (
        <MemberRow
          key={member.name}
          member={member}
          displayName={isDesktop ? member.name : abbreviateName(member.name)}
          effectiveStatus={getEffectiveStatus(member)}
          onApprove={() => onApprove(member)}
          onReject={() => onReject(member)}
        />
      ))}
    </List>
  );
}

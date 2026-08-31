import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  FilterTabs,
  List,
  ListRow,
  SectionTitle,
  Stat,
} from 'mason-connect-design-system';
import { screensMeta } from '../../shell/screens-meta';
import { abbreviateName } from '../../data/surface';
import { members, type Member } from '../../data/members';

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
 * "Quadro de membros" — renderizada duas vezes (mobile e desktop) porque as
 * duas fontes divergem: mobile usa `members.slice(0, 5)` com nomes
 * abreviados (`abbreviateName`), desktop usa os 6 registros completos com
 * nome cheio. Uma única `List` com linhas escondidas via CSS quebraria o
 * zebra-striping por índice do componente (mesmo raciocínio do
 * `MeetingsList` em Painel, Task 6).
 */
function MembersRows({ isDesktop, filter }: { isDesktop: boolean; filter: MemberFilterValue }) {
  const source = isDesktop ? members : members.slice(0, 5);
  const visible = filterMembers(source, filter);

  if (visible.length === 0) {
    return <EmptyState message="Nenhum membro neste filtro." hint="Ajuste o filtro acima para ver mais nomes." />;
  }

  return (
    <List header={isDesktop ? 'Quadro de membros' : undefined}>
      {visible.map((member) => {
        const badge = statusBadge(member);
        return (
          <ListRow
            key={member.name}
            leading={<Avatar name={member.name} tone={member.status === 'ativo' ? 'active' : 'pending'} />}
            title={isDesktop ? member.name : abbreviateName(member.name)}
            subtitle={member.role}
            trailing={<Badge variant={badge.variant}>{badge.label}</Badge>}
          />
        );
      })}
    </List>
  );
}

/**
 * Tela "Membros". Retenção 92% e as 4 cadeiras em aberto são literais do
 * protótipo desktop — não existem em `data/` (mesmo padrão dos KPIs
 * literais do Painel, achado documentado no brief do Task 6).
 */
export function MembrosScreen() {
  const [filter, setFilter] = useState<MemberFilterValue>('todos');

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
        <MembersRows isDesktop={false} filter={filter} />
      </div>
      <div className="md:hidden">
        <Button variant="secondary" fullWidth>
          Convidar novo membro
        </Button>
      </div>

      <div className="hidden items-start gap-[18px] md:grid md:grid-cols-[1.7fr_1fr]">
        <MembersRows isDesktop filter={filter} />
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

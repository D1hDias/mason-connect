import {
  Badge,
  type BadgeVariant,
  Card,
  CategoryBarChart,
  EmptyState,
  List,
  ListRow,
  ProgressBar,
  SectionTitle,
  Stat,
  TrendLineChart,
} from 'mason-connect-design-system';
import { screensMeta } from '../../shell/screens-meta';
import { filterForSurface } from '../../data/surface';
import { trend } from '../../data/trend';
import { goals } from '../../data/goals';
import { meetings, type Meeting, type MeetingStatus } from '../../data/meetings';
import { referrals } from '../../data/referrals';

const meta = screensMeta['/painel'];

/** Rótulo/variante de `Badge` por `MeetingStatus`, transcrito do protótipo desktop. */
const MEETING_BADGE: Record<MeetingStatus, { label: string; variant: BadgeVariant }> = {
  confirmado: { label: 'Confirmado', variant: 'accent' },
  pendente: { label: 'Pendente', variant: 'neutral' },
  aguardando: { label: 'Aguardando', variant: 'warning' },
};

function meetingSubtitle(meeting: Meeting): string {
  return meeting.venue ? `${meeting.dateLabel} · ${meeting.venue}` : meeting.dateLabel;
}

/**
 * "Próximos encontros" — renderizada duas vezes (mobile e desktop) porque
 * `filterForSurface` devolve arrays de tamanhos diferentes (2 vs. 3 linhas,
 * a 3ª "Jantar de encerramento" `desktopOnly`); uma única `List` com linhas
 * escondidas via CSS quebraria o zebra-striping por índice do componente.
 */
function MeetingsList({ isDesktop }: { isDesktop: boolean }) {
  return (
    <List header="Próximos encontros">
      {filterForSurface(meetings, isDesktop).map((meeting) => {
        const badge = MEETING_BADGE[meeting.status];
        return (
          <ListRow
            key={meeting.title}
            title={meeting.title}
            subtitle={meetingSubtitle(meeting)}
            trailing={<Badge variant={badge.variant}>{badge.label}</Badge>}
          />
        );
      })}
    </List>
  );
}

/**
 * Tela "Painel da Gestão". KPIs (87%, R$ 127 mil, 24, 24) são literais de
 * tela — não existem em `data/` (achado documentado no brief do Task 6).
 * O card "Indicações por membro" (`CategoryBarChart`) é exclusivo desktop:
 * não existe nenhuma versão mobile dele nesta tela.
 */
export function PainelScreen() {
  return (
    <div className="flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-8 md:py-7">
      <div className="md:hidden">
        <SectionTitle subtitle={meta.mobileSubtitle}>{meta.title}</SectionTitle>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-[18px] lg:grid-cols-4">
        <Stat label="Presença média" value="87%" hint="+4 p.p. vs. junho" tone="success" />
        <Stat label="Negócios fechados" value="R$ 127 mil" hint="12 negócios" tone="accent" />
        <div className="hidden md:block">
          <Stat label="Indicações no mês" value="24" hint="meta 30" />
        </div>
        <div className="hidden md:block">
          <Stat label="Membros ativos" value="24" hint="2 pendentes" />
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-[18px]">
        <Card>
          <p className="font-heading text-lg font-bold text-brand-brown">Valor gerado no núcleo</p>
          <p className="mb-3 mt-1 text-xs text-brand-bronze">Últimos seis meses</p>
          <TrendLineChart data={trend} valueFormatter={(v) => `R$ ${v} mil`} />
        </Card>

        <Card>
          <p className="mb-4 font-heading text-lg font-bold text-brand-brown">Metas do trimestre</p>
          {goals.map((goal) => (
            <ProgressBar key={goal.label} label={goal.label} value={goal.current} percent={goal.percent} tone={goal.tone} />
          ))}
          <div className="hidden md:block">
            <EmptyState message="As metas são reavaliadas na última reunião do trimestre." />
          </div>
        </Card>
      </div>

      <div className="md:hidden">
        <MeetingsList isDesktop={false} />
      </div>

      <div className="hidden items-start gap-[18px] md:grid md:grid-cols-[1fr_1fr]">
        <MeetingsList isDesktop />
        <Card>
          <p className="font-heading text-lg font-bold text-brand-brown">Indicações por membro</p>
          <p className="mb-3 mt-1 text-xs text-brand-bronze">Trimestre corrente</p>
          <CategoryBarChart data={referrals} />
        </Card>
      </div>
    </div>
  );
}

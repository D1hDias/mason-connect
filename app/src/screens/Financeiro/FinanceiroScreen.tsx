import {
  Button,
  Card,
  CategoryBarChart,
  List,
  ListRow,
  ProgressBar,
  SectionTitle,
  Stat,
} from 'mason-connect-design-system';
import { screensMeta } from '../../shell/screens-meta';
import { filterForSurface } from '../../data/surface';
import { financeEntries, type FinanceEntry } from '../../data/finance';
import { referrals } from '../../data/referrals';

const meta = screensMeta['/financeiro'];

/** Sinal U+2212 para negativos (nunca hífen `-`), `+` para positivos. */
const MINUS = '−';

function formatBRL(amount: number): string {
  return `R$ ${amount.toLocaleString('pt-BR')}`;
}

/** Texto assinado (`+`/`−` + `mc-num`) e classe de cor por `FinanceEntryKind`. */
function entryAmount(entry: FinanceEntry): { text: string; toneClass: string } {
  const isReceita = entry.kind === 'receita';
  return {
    text: `${isReceita ? '+' : MINUS} ${formatBRL(entry.amount)}`,
    toneClass: isReceita ? 'text-finance-positive' : 'text-finance-negative',
  };
}

/**
 * "Extrato do caixa" — renderizada duas vezes (mobile e desktop) porque
 * `filterForSurface` devolve arrays de tamanhos diferentes (3 vs. 4 linhas,
 * a 4ª "Aluguel da sede" `desktopOnly`); uma única `List` com linhas
 * escondidas via CSS quebraria o zebra-striping por índice do componente
 * (mesmo raciocínio do `MeetingsList` em Painel, Task 6, e `MembersRows` em
 * Membros, Task 7).
 */
function ExtratoList({ isDesktop }: { isDesktop: boolean }) {
  return (
    <List header="Extrato do caixa">
      {filterForSurface(financeEntries, isDesktop).map((entry) => {
        const { text, toneClass } = entryAmount(entry);
        return (
          <ListRow
            key={entry.title}
            title={entry.title}
            subtitle={entry.subtitle}
            trailing={<span className={`mc-num font-bold text-[15px] whitespace-nowrap ${toneClass}`}>{text}</span>}
          />
        );
      })}
    </List>
  );
}

/**
 * Tela "Financeiro". KPIs (R$ 8.420, R$ 1.300, R$ 14.300) e os dois valores
 * de `ProgressBar` de "Cobrança do mês" (22/24, 24/24) são literais de tela
 * — não existem em `data/` (mesmo padrão dos KPIs literais do Painel/Membros,
 * achado documentado nos briefs dos Tasks 6-7).
 *
 * O card "Indicações por membro" (`CategoryBarChart`) é exclusivo **mobile**
 * nesta tela — ele mora no Painel **desktop** (Task 6); nunca as duas telas
 * ao mesmo tempo (ver comentário em `data/referrals.ts`). Financeiro desktop
 * não tem gráfico algum.
 *
 * Os botões "Registrar lançamento"/"Exportar extrato" são no-op — sem
 * handler de submissão real, só o visual do protótipo.
 */
export function FinanceiroScreen() {
  return (
    <div className="flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-8 md:py-7">
      <div className="md:hidden">
        <SectionTitle subtitle={meta.mobileSubtitle}>{meta.title}</SectionTitle>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-[18px] lg:grid-cols-3">
        <Stat label="Saldo em caixa" value="R$ 8.420" hint="após o coffee break" tone="success" />
        <Stat label="Inadimplência" value="R$ 1.300" hint="2 membros" tone="default" />
        <div className="hidden lg:block">
          <Stat label="Recebido no mês" value="R$ 14.300" hint="22 pagantes" tone="accent" />
        </div>
      </div>

      <div className="md:hidden">
        <Card>
          <p className="font-heading text-lg font-bold text-brand-brown">Indicações por membro</p>
          <p className="mb-3 mt-1 text-xs text-brand-bronze">Trimestre corrente</p>
          <CategoryBarChart data={filterForSurface(referrals, false)} />
        </Card>
      </div>

      <div className="md:hidden">
        <ExtratoList isDesktop={false} />
      </div>
      <div className="md:hidden">
        <Button variant="primary" fullWidth>
          Registrar lançamento
        </Button>
      </div>

      <div className="hidden items-start gap-[18px] md:grid md:grid-cols-[1.7fr_1fr]">
        <ExtratoList isDesktop />
        <div className="flex flex-col gap-[18px]">
          <Card>
            <p className="mb-4 font-heading text-lg font-bold text-brand-brown">Cobrança do mês</p>
            <ProgressBar label="Mensalidades recebidas" value={22} percent={22 / 24} tone="success" />
            <ProgressBar label="Boletos emitidos" value={24} percent={24 / 24} tone="accent" />
          </Card>
          <Button variant="primary" fullWidth>
            Registrar lançamento
          </Button>
          <Button variant="secondary" fullWidth>
            Exportar extrato
          </Button>
        </div>
      </div>
    </div>
  );
}

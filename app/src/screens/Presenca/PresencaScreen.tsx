import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Input,
  List,
  ListRow,
  SectionTitle,
  Select,
  type ChipEstado,
} from 'mason-connect-design-system';
import { screensMeta } from '../../shell/screens-meta';
import { members, type Member } from '../../data/members';
import { useToast } from '../../shell/overlays/AppOverlaysProvider';

const meta = screensMeta['/presenca'];

/** Ciclo de estados do chip de presença (`Fase2Gestao.dc.html:80-136`). Um toque = um estado. */
const CYCLE: ChipEstado[] = ['presente', 'falta', 'justificada', 'representado'];

function nextEstado(current: ChipEstado): ChipEstado {
  const index = CYCLE.indexOf(current);
  return CYCLE[(index + 1) % CYCLE.length];
}

/** Conta como presença tanto `'presente'` quanto `'representado'` (contador `presentes/ativos.length`, `:88`). */
function countsAsPresent(estado: ChipEstado): boolean {
  return estado === 'presente' || estado === 'representado';
}

/**
 * Cor da borda esquerda da linha por estado — decisão de composição LOCAL
 * desta tela (não do `Chip`, que é só o pill), usando os mesmos tokens
 * `presence-*` já existentes.
 */
const ESTADO_BORDER_CLASSES: Record<ChipEstado, string> = {
  presente: 'border-presence-presente-fg',
  falta: 'border-presence-falta-fg',
  justificada: 'border-presence-justificada-fg',
  representado: 'border-presence-representado-fg',
};

/**
 * Os 4 membros ativos do dataset real (`data/members.ts`), mapeados 1:1
 * pelo nome com o protótipo (`Fase2Gestao.dc.html:80-136`) — inclui Renata
 * Vieira (`desktopOnly` em Membros, mas essa flag é só sobre o quadro de
 * membros, não sobre esta tela: o protótipo desta tela é um único frame
 * mobile sem divergência mobile/desktop, achado #14 do plano).
 */
const ATIVOS: Member[] = members.filter((member) => member.status === 'ativo');

/** Estado inicial por nome — os 3 primeiros `'presente'`, Renata Vieira `'representado'` (`:80-136`). */
const INITIAL_ESTADOS: Record<string, ChipEstado> = Object.fromEntries(
  ATIVOS.map((member) => [member.name, member.name === 'Renata Vieira' ? 'representado' : 'presente']),
);

const SUPLENTE_OPTIONS = ATIVOS.map((member) => ({ label: member.name, value: member.name }));

const TIPO_REUNIAO_OPTIONS = [
  { label: 'Rodada de Negócios', value: 'rodada' },
  { label: 'Reunião quinzenal', value: 'quinzenal' },
  { label: 'Coworking', value: 'coworking' },
  { label: 'Assembleia do núcleo', value: 'assembleia' },
];

/**
 * Uma linha de membro: botão clicável que avança o ciclo de presença, mais
 * o alerta crítico e o `Select` de suplente condicionais abaixo dela.
 */
function PresenceRow({
  member,
  estado,
  onAdvance,
}: {
  member: Member;
  estado: ChipEstado;
  onAdvance: () => void;
}) {
  const showAlerta = member.faltas !== undefined && member.faltas >= 2 && estado === 'falta';
  const showSuplente = estado === 'representado';

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onAdvance}
        className={`flex min-h-[44px] items-center justify-between gap-3 rounded-lg border-l-4 border border-border bg-surface px-4 py-3 text-left shadow ${ESTADO_BORDER_CLASSES[estado]}`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <Avatar name={member.name} tone={estado === 'falta' ? 'pending' : 'active'} />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-semibold">{member.name}</span>
            <span className="text-xs text-brand-bronze">{member.role}</span>
          </span>
        </span>
        <span className="flex-none">
          <Chip estado={estado} />
        </span>
      </button>

      {showAlerta && (
        <div className="pl-4">
          <Badge variant="critical">3ª falta seguida · limite atingido (RN-08b)</Badge>
        </div>
      )}

      {showSuplente && (
        <div className="pl-4">
          <Select label="Suplente responsável" options={SUPLENTE_OPTIONS} />
        </div>
      )}
    </div>
  );
}

/**
 * Tela "Presença ao Vivo" (Task 12). Ground truth: `Fase2Gestao.dc.html:80-136`
 * — frame único (mobile-width), sem divergência mobile/desktop, diferente
 * das telas do Task 6-9. Visível pra qualquer perfil (achado #14): sem gate
 * de `profile.categoria`.
 *
 * O ciclo de presença é local (`useState<Record<string, ChipEstado>>`
 * chaveado por nome do membro) — não muta `data/members.ts`. "Agendar
 * reunião" é um no-op documentado: só dispara o toast compartilhado, sem
 * inserir reunião em lugar nenhum (mesmo padrão de "Registrar
 * indicação"/"Registrar ocorrência" de outras telas do plano).
 */
export function PresencaScreen() {
  const [estados, setEstados] = useState<Record<string, ChipEstado>>(INITIAL_ESTADOS);
  const { showToast } = useToast();

  const presentes = ATIVOS.filter((member) => countsAsPresent(estados[member.name])).length;

  function handleAdvance(member: Member) {
    setEstados((current) => ({
      ...current,
      [member.name]: nextEstado(current[member.name]),
    }));
  }

  function handleAgendar() {
    showToast('Reunião agendada. Os membros foram notificados.');
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-5 md:mx-auto md:w-full md:max-w-3xl md:gap-5 md:px-8 md:py-7">
      <div className="md:hidden">
        <SectionTitle subtitle={meta.mobileSubtitle}>{meta.title}</SectionTitle>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3.5">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-heading text-lg font-bold text-brand-brown">Rodada de Negócios</span>
            <span className="text-xs text-brand-bronze">Toque na linha para alternar o registro. Um toque = um estado.</span>
          </div>
          <span className="mc-num flex-none text-[26px] font-bold text-brand-brown">
            {presentes}/{ATIVOS.length}
          </span>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        {ATIVOS.map((member) => (
          <PresenceRow
            key={member.name}
            member={member}
            estado={estados[member.name]}
            onAdvance={() => handleAdvance(member)}
          />
        ))}
      </div>

      <List header="Convidados desta reunião">
        <ListRow
          title="Carlos Nogueira"
          subtitle="Logística · anfitrião: Davi Lopes"
          trailing={<Badge variant="accent">2ª participação</Badge>}
        />
        <ListRow
          title="Beatriz Salles"
          subtitle="Odontologia · anfitriã: Camila Rocha"
          trailing={<Badge variant="neutral">1ª participação</Badge>}
        />
      </List>

      <Card>
        <p className="mb-1 font-heading text-lg font-bold text-brand-brown">Agendar próxima reunião</p>
        <p className="mb-4 text-xs text-brand-bronze">Falta justificada exige 24h de antecedência (RN-19).</p>
        <div className="flex flex-col gap-3">
          <Select label="Tipo de reunião" options={TIPO_REUNIAO_OPTIONS} />
          <Input label="Data e hora" type="datetime-local" />
          <Input label="Local" placeholder="Sede ou link da chamada" />
          <Input label="Pauta" placeholder="Assunto principal do encontro" />
          <Button variant="primary" fullWidth onClick={handleAgendar}>
            Agendar reunião
          </Button>
        </div>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Badge, Button, Card, EmptyState, FilterTabs, Input, SectionTitle, Select } from 'mason-connect-design-system';
import { screensMeta } from '../../shell/screens-meta';
import { members } from '../../data/members';
import { indicacoes, type Indicacao, type IndicacaoEstagio } from '../../data/indicacoes';
import { profile, type ProfileCategoria } from '../../data/profile';
import { useConfirmModal, useToast } from '../../shell/overlays/AppOverlaysProvider';

const meta = screensMeta['/indicacoes'];

/** Valor default aplicado a um fechamento manual quando a indicação ainda não tinha valor (`Fase2Gestao.dc.html:416`). */
const VALOR_FECHAMENTO_DEFAULT = 18500;

const ESTAGIO_OPTIONS: { label: string; value: IndicacaoEstagio }[] = [
  { label: 'Registradas', value: 'registrada' },
  { label: 'Em contato', value: 'contato' },
  { label: 'Em andamento', value: 'andamento' },
  { label: 'Fechadas', value: 'fechado' },
  { label: 'Perdidas', value: 'perdido' },
];

const MAPA_ROTULO: Record<IndicacaoEstagio, string> = {
  registrada: 'Registrada',
  contato: 'Em contato',
  andamento: 'Em andamento',
  fechado: 'Fechado',
  perdido: 'Perdido',
};

const MAPA_VARIANTE: Record<IndicacaoEstagio, 'success' | 'warning' | 'critical' | 'neutral' | 'accent'> = {
  registrada: 'neutral',
  contato: 'accent',
  andamento: 'accent',
  fechado: 'success',
  perdido: 'critical',
};

const ATIVOS = members.filter((member) => member.status === 'ativo');
const DESTINATARIO_OPTIONS = ATIVOS.map((member) => ({ label: member.name, value: member.name }));
const CO_INDICADOR_OPTIONS = [{ label: 'Sem co-indicador', value: '' }, ...DESTINATARIO_OPTIONS];

/**
 * Regra de sigilo do valor de uma indicação fechada (`podeVerValor`,
 * `Fase2Gestao.dc.html:417`): gestão (`gestor`/`administrativo`) sempre vê;
 * qualquer outro perfil só vê quando é uma das partes envolvidas nesse
 * negócio específico. Exportada para teste isolado (mesmo padrão de
 * `filterMembers`/`canEditConfig`).
 */
export function canSeeIndicacaoValue(indicacao: Indicacao, categoria: ProfileCategoria): boolean {
  return (
    categoria === 'gestor' ||
    categoria === 'administrativo' ||
    indicacao.indicador === 'Você' ||
    indicacao.destinatario === 'Você'
  );
}

/**
 * Filtro puro por estágio, exportado para testar isoladamente o branch
 * `EmptyState`: com o dataset real de 5 indicações (uma por estágio) toda
 * aba sempre tem exatamente 1 item, então esse branch só é alcançável
 * filtrando uma lista vazia artificialmente (mesmo padrão de
 * `filterMembers` em Membros).
 */
export function indicacoesDoEstagio(list: Indicacao[], estagio: IndicacaoEstagio): Indicacao[] {
  return list.filter((indicacao) => indicacao.estagio === estagio);
}

/** Badge de SLA condicional — vencido (registrada, >7 dias) ou próximo do prazo (contato, ≥6 dias); `null` caso contrário (`:550-557`). */
function slaBadge(indicacao: Indicacao) {
  if (indicacao.estagio === 'registrada' && indicacao.dias > 7) {
    return <Badge variant="critical">SLA vencido · {indicacao.dias}d</Badge>;
  }
  if (indicacao.estagio === 'contato' && indicacao.dias >= 6) {
    return <Badge variant="warning">SLA {7 - indicacao.dias}d</Badge>;
  }
  return null;
}

function IndicacaoCard({
  indicacao,
  categoria,
  onFechar,
}: {
  indicacao: Indicacao;
  categoria: ProfileCategoria;
  onFechar: () => void;
}) {
  const sla = slaBadge(indicacao);
  const mostraValor = indicacao.estagio === 'fechado';
  const podeVerValor = mostraValor && canSeeIndicacaoValue(indicacao, categoria);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 shadow">
      <div className="flex items-center justify-between gap-2.5">
        <span className="flex min-w-0 items-center gap-1.5 text-xs font-bold text-brand-brown">
          <span className="text-brand-gold" aria-hidden="true">
            ⚿
          </span>
          <span className="truncate">
            {indicacao.indicador} → {indicacao.destinatario}
          </span>
        </span>
        <span className="flex-none">
          <Badge variant={MAPA_VARIANTE[indicacao.estagio]}>{MAPA_ROTULO[indicacao.estagio]}</Badge>
        </span>
      </div>

      <p className="m-0 text-sm leading-relaxed">{indicacao.descricao}</p>

      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <span className="flex items-center gap-2">{sla}</span>
        {mostraValor &&
          (podeVerValor ? (
            <span className="mc-num text-sm font-bold text-status-success-fg">
              R$ {indicacao.valor!.toLocaleString('pt-BR')}
            </span>
          ) : (
            <span className="text-xs text-brand-bronze">valor restrito</span>
          ))}
      </div>

      {indicacao.estagio === 'andamento' && (
        <Button variant="primary" fullWidth onClick={onFechar}>
          Confirmar fechamento
        </Button>
      )}

      {indicacao.motivo && <p className="m-0 text-xs text-status-critical-fg">{indicacao.motivo}</p>}
    </div>
  );
}

/**
 * Tela "Indicações e Negócios" (Task 13). Ground truth:
 * `Fase2Gestao.dc.html:138-183` + lógica em `:416-418, 531-569`.
 *
 * "Registrar indicação" nunca insere item novo em `indicacoes` (achado
 * #15 — fiel ao protótipo, que também não insere): confirmar só fecha o
 * form, troca a aba ativa pra "Registradas" e dispara o toast. "Confirmar
 * fechamento" É uma mutação real, mas local a esta tela — rastreada em
 * `fechamentosLocais` (`Map<id, valor>`), nunca mutando o array
 * `indicacoes` importado. Uma indicação fechada manualmente é derivada a
 * cada render combinando o dataset base com esse overlay.
 */
export function IndicacoesScreen() {
  const [formAberto, setFormAberto] = useState(false);
  const [estagioAtivo, setEstagioAtivo] = useState<IndicacaoEstagio>('registrada');
  const [fechamentosLocais, setFechamentosLocais] = useState<Map<number, number>>(new Map());
  const { confirm } = useConfirmModal();
  const { showToast } = useToast();

  const indicacoesEfetivas: Indicacao[] = indicacoes.map((indicacao) => {
    const valorFechado = fechamentosLocais.get(indicacao.id);
    if (valorFechado === undefined) {
      return indicacao;
    }
    return { ...indicacao, estagio: 'fechado', valor: valorFechado };
  });

  const visiveis = indicacoesDoEstagio(indicacoesEfetivas, estagioAtivo);

  function handleRegistrar() {
    setFormAberto(false);
    setEstagioAtivo('registrada');
    showToast('Indicação registrada. O SLA de 7 dias começou a contar.');
  }

  function handleCancelar() {
    setFormAberto(false);
  }

  function handleFechar(indicacao: Indicacao) {
    confirm({
      titulo: 'Confirmar fechamento deste negócio?',
      corpo: `O crédito de ${indicacao.indicador} é perpétuo e não poderá ser alterado. O fechamento entra na pauta de reconhecimento da próxima reunião.`,
      nota: 'Ato definitivo e auditado (RN-13). Valores individuais permanecem restritos às partes e à gestão (RN-26).',
      acao: 'Confirmar fechamento',
      onConfirm: () => {
        setFechamentosLocais((current) => {
          const next = new Map(current);
          next.set(indicacao.id, indicacao.valor ?? VALOR_FECHAMENTO_DEFAULT);
          return next;
        });
        setEstagioAtivo('fechado');
        showToast('Fechamento confirmado. O indicador foi notificado.');
      },
    });
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-5 md:mx-auto md:w-full md:max-w-3xl md:gap-5 md:px-8 md:py-7">
      <div className="md:hidden">
        <SectionTitle subtitle={meta.mobileSubtitle}>{meta.title}</SectionTitle>
      </div>

      {formAberto ? (
        <Card>
          <p className="mb-4 font-heading text-lg font-bold text-brand-brown">Nova indicação</p>
          <div className="flex flex-col gap-3">
            <Select label="Destinatário" options={DESTINATARIO_OPTIONS} />
            <Select label="Co-indicador (opcional)" options={CO_INDICADOR_OPTIONS} />
            <Input label="Oportunidade" placeholder="Descreva a oportunidade" />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-brand-bronze">
            O co-indicador divide o crédito da indicação (RF-32). Seu nome como indicador não poderá ser alterado
            depois.
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <Button variant="primary" fullWidth onClick={handleRegistrar}>
              Confirmar registro
            </Button>
            <Button variant="secondary" fullWidth onClick={handleCancelar}>
              Cancelar
            </Button>
          </div>
        </Card>
      ) : (
        <Button variant="primary" fullWidth onClick={() => setFormAberto(true)}>
          Registrar indicação
        </Button>
      )}

      <FilterTabs
        options={ESTAGIO_OPTIONS}
        value={estagioAtivo}
        onChange={(value) => setEstagioAtivo(value as IndicacaoEstagio)}
      />

      {visiveis.length === 0 ? (
        <EmptyState message="Nada por aqui." hint="A próxima Rodada de Negócios muda isso." />
      ) : (
        <div className="flex flex-col gap-3">
          {visiveis.map((indicacao) => (
            <IndicacaoCard
              key={indicacao.id}
              indicacao={indicacao}
              categoria={profile.categoria}
              onFechar={() => handleFechar(indicacao)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

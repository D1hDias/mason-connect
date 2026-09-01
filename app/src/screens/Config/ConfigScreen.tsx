import {
  Badge,
  Button,
  EmptyState,
  List,
  ListRow,
  SectionTitle,
  type BadgeVariant,
} from 'mason-connect-design-system';
import { screensMeta } from '../../shell/screens-meta';
import { PLANO_VALORES } from '../../data/nucleos';
import { auditoria } from '../../data/auditoria';
import { profile, type ProfileCategoria } from '../../data/profile';
import { useConfirmModal, useToast } from '../../shell/overlays/AppOverlaysProvider';

const meta = screensMeta['/config'];

interface Plano {
  key: string;
  nome: string;
  detalhe: string;
}

/**
 * Planos de mensalidade — reusa `PLANO_VALORES` de `nucleos.ts` (RN-06),
 * não hardcoda os valores de novo. Formatação e textos literais de
 * `Fase2Gestao.dc.html:576-578`.
 */
const PLANOS: Plano[] = [
  {
    key: 'g',
    nome: 'Gratuito',
    detalhe: `R$ ${PLANO_VALORES.isento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} · exige justificativa (RN-29)`,
  },
  {
    key: 'm',
    nome: 'Mensal',
    detalhe: `R$ ${PLANO_VALORES.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por competência`,
  },
  {
    key: 'a',
    nome: 'Anual',
    detalhe: `R$ ${PLANO_VALORES.anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} · equivale a R$ ${PLANO_VALORES.anual / 12}/mês`,
  },
];

interface Regra {
  key: number;
  nome: string;
  codigo: string;
  badgeVariant: BadgeVariant;
  badgeLabel: string;
}

/** 5 regras parametrizáveis literais (`Fase2Gestao.dc.html:589-593`). */
const REGRAS: Regra[] = [
  { key: 1, nome: 'Limite de faltas consecutivas', codigo: 'RN-08b', badgeVariant: 'neutral', badgeLabel: '3 reuniões' },
  { key: 2, nome: 'SLA de 1º contato da indicação', codigo: 'RN-23', badgeVariant: 'neutral', badgeLabel: '7 dias' },
  { key: 3, nome: 'Convidados por membro por reunião', codigo: 'RN-21', badgeVariant: 'neutral', badgeLabel: '2' },
  { key: 4, nome: 'Antecedência para falta justificada', codigo: 'RN-19', badgeVariant: 'neutral', badgeLabel: '24 horas' },
  { key: 5, nome: 'Política de comissão', codigo: 'RN-09', badgeVariant: 'warning', badgeLabel: 'Pendente de ratificação' },
];

/**
 * Gate de perfil (`podeConfig`, `Fase2Gestao.dc.html:186,574`): só o perfil
 * `'gestor'` edita os parâmetros do grupo. Exportada para teste isolado com
 * os 3 valores possíveis de `ProfileCategoria`.
 */
export function canEditConfig(categoria: ProfileCategoria): boolean {
  return categoria === 'gestor';
}

/**
 * Tela "Configurações do Gestor" (Task 14). Ground truth:
 * `Fase2Gestao.dc.html:185-218` + dados em `:574-598`.
 *
 * O subtítulo do `SectionTitle` usa `meta.mobileSubtitle` nos dois branches
 * (liberado e bloqueado) — decisão já tomada nas Tasks 12/13, não os dois
 * textos distintos do protótipo ("Somente o Gestor edita..."/"Acesso
 * restrito").
 *
 * "Editar" em um plano abre o modal de confirmação e, ao confirmar, só
 * dispara o toast — sem mutação real de nenhum valor exibido (achado #15,
 * mesmo padrão de "Registrar indicação"/"Registrar ocorrência" de outras
 * telas).
 */
export function ConfigScreen() {
  const { confirm } = useConfirmModal();
  const { showToast } = useToast();

  const podeConfig = canEditConfig(profile.categoria);

  function handleEditarPlano(plano: Plano) {
    confirm({
      titulo: `Editar o plano ${plano.nome}?`,
      corpo: 'A alteração passa a valer na próxima competência. Mensalidades já lançadas não mudam.',
      nota: 'A mudança de valor gera entrada na trilha de auditoria.',
      acao: 'Abrir edição',
      onConfirm: () => showToast(`Plano ${plano.nome} aberto para edição.`),
    });
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-8 md:py-7">
      <div className="md:hidden">
        <SectionTitle subtitle={meta.mobileSubtitle}>{meta.title}</SectionTitle>
      </div>

      {podeConfig ? (
        <>
          <List header="Planos de mensalidade">
            {PLANOS.map((plano) => (
              <ListRow
                key={plano.key}
                title={plano.nome}
                subtitle={plano.detalhe}
                trailing={
                  <Button variant="secondary" onClick={() => handleEditarPlano(plano)}>
                    Editar
                  </Button>
                }
              />
            ))}
          </List>

          <List header="Regras parametrizáveis">
            {REGRAS.map((regra) => (
              <ListRow
                key={regra.key}
                title={regra.nome}
                subtitle={<span className="mc-num">{regra.codigo}</span>}
                trailing={<Badge variant={regra.badgeVariant}>{regra.badgeLabel}</Badge>}
              />
            ))}
          </List>

          <List header="Trilha de auditoria">
            {auditoria.map((entry) => (
              <ListRow
                key={entry.key}
                title={entry.acao}
                subtitle={<span className="mc-num">{entry.quando}</span>}
              />
            ))}
          </List>

          <p className="m-0 text-xs leading-relaxed text-brand-bronze">
            Registros imutáveis e append-only (RN-33). Toda alteração de valor gera nova entrada.
          </p>
        </>
      ) : (
        <EmptyState
          message="Somente o perfil Gestor edita os parâmetros do grupo."
          hint="Fale com a gestão do núcleo se precisar de uma alteração."
        />
      )}
    </div>
  );
}

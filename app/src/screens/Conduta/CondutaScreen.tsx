import { useState } from 'react';
import { Badge, Button, Card, EmptyState, Input, List, SectionTitle, Select, Stat } from 'mason-connect-design-system';
import { screensMeta } from '../../shell/screens-meta';
import { members } from '../../data/members';
import { ocorrencias, tiposConduta, type Ocorrencia } from '../../data/conduta';
import { profile, type ProfileCategoria } from '../../data/profile';
import { useConfirmModal, useToast } from '../../shell/overlays/AppOverlaysProvider';

const meta = screensMeta['/conduta'];

const MEMBRO_OPTIONS = members
  .filter((member) => member.status === 'ativo')
  .map((member) => ({ label: member.name, value: member.name }));

/**
 * Gate de perfil (`podeConduta`, `Fase2Gestao.dc.html:220,617-623`): só o
 * perfil `'gestor'` vê ocorrências de conduta — sigiloso por decisão de
 * governança. Função própria e não um alias de `canEditConfig` (Task 14):
 * ver e editar são permissões distintas, mesmo coincidindo em valor hoje
 * (só existe um perfil com as duas). Exportada para teste isolado com os 3
 * valores possíveis de `ProfileCategoria`.
 */
export function canViewConduta(categoria: ProfileCategoria): boolean {
  return categoria === 'gestor';
}

/** Uma linha de `List` "Ocorrências registradas" — 3 linhas empilhadas (`:238-246`), não cabe no `title`/`subtitle` de 2 linhas de `ListRow`. */
function OcorrenciaRow({ ocorrencia, className }: { ocorrencia: Ocorrencia; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 px-5 py-3.5 ${className ?? ''}`}>
      <div className="flex items-center justify-between gap-2.5">
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="font-semibold">{ocorrencia.membro}</span>
          <span className="text-xs text-brand-bronze">{ocorrencia.tipo}</span>
        </span>
        <span className="flex-none">
          <Badge variant={ocorrencia.seloTom}>{ocorrencia.seloTexto}</Badge>
        </span>
      </div>
      <p className="m-0 text-sm leading-relaxed">{ocorrencia.descricao}</p>
      <span className="mc-num text-xs text-brand-bronze">{ocorrencia.rodape}</span>
    </div>
  );
}

/**
 * Tela "Ocorrências de Conduta" (Task 15, última tela individual do plano).
 * Ground truth: `Fase2Gestao.dc.html:220-262` + ação em `:617-623`.
 *
 * O subtítulo do `SectionTitle` usa `meta.mobileSubtitle` nos dois branches
 * (liberado e bloqueado), renderizado UMA vez acima do `if` — decisão já
 * tomada nas Tasks 12/13/14, não os dois textos distintos do protótipo
 * ("Registro sigiloso · visível apenas à gestão do núcleo"/"Acesso
 * restrito").
 *
 * "Registrar" nunca insere item novo em `ocorrencias`: confirmar só
 * dispara o toast, sem mutação real (achado #15, mesmo padrão de
 * "Registrar indicação"/"Editar plano").
 */
export function CondutaScreen() {
  const [membro, setMembro] = useState(MEMBRO_OPTIONS[0]?.value ?? '');
  const [tipo, setTipo] = useState(tiposConduta[0]?.value ?? '');
  const [descricao, setDescricao] = useState('');
  const { confirm } = useConfirmModal();
  const { showToast } = useToast();

  const podeConduta = canViewConduta(profile.categoria);

  function handleRegistrar() {
    confirm({
      titulo: 'Registrar ocorrência de conduta?',
      corpo: 'O registro é sigiloso e visível apenas à gestão. Três ocorrências validadas abrem processo de revisão de permanência.',
      nota: 'Registra autor, data e hora (RN-32 · RF-36).',
      acao: 'Registrar ocorrência',
      onConfirm: () => showToast('Ocorrência registrada em sigilo.'),
    });
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-8 md:py-7">
      <div className="md:hidden">
        <SectionTitle subtitle={meta.mobileSubtitle}>{meta.title}</SectionTitle>
      </div>

      {podeConduta ? (
        <>
          <Card>
            <div className="flex items-start gap-3">
              <span
                className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-brand-ebony text-brand-gold"
                aria-hidden="true"
              >
                ⚿
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-sm font-semibold">Documento confidencial</span>
                <span className="text-xs leading-relaxed text-brand-bronze">
                  Não compartilhe fora da gestão. Três ocorrências validadas abrem processo de revisão de permanência
                  (RN-32).
                </span>
              </span>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Registros no ano" value="5" hint="3 validados" tone="default" />
            <Stat label="Em revisão" value="1" hint="atingiu 3 validadas" tone="default" />
          </div>

          <List header="Ocorrências registradas">
            {ocorrencias.map((ocorrencia) => (
              <OcorrenciaRow key={ocorrencia.key} ocorrencia={ocorrencia} />
            ))}
          </List>

          <Card>
            <p className="mb-4 font-heading text-lg font-bold text-brand-brown">Registrar ocorrência</p>
            <div className="flex flex-col gap-3">
              <Select
                label="Membro"
                options={MEMBRO_OPTIONS}
                value={membro}
                onChange={(event) => setMembro(event.target.value)}
              />
              <Select
                label="Tipo de ocorrência"
                options={tiposConduta}
                value={tipo}
                onChange={(event) => setTipo(event.target.value)}
              />
              <Input
                label="Descrição"
                placeholder="O que aconteceu, com data e contexto"
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
              />
            </div>
            <div className="mt-4">
              <Button variant="primary" fullWidth onClick={handleRegistrar}>
                Registrar
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <EmptyState
          message="Este registro é visível apenas ao perfil Gestor."
          hint="Ocorrências de conduta são sigilosas por decisão de governança."
        />
      )}
    </div>
  );
}

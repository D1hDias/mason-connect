/**
 * "Quadro de membros" (Membros). Desktop é a fonte canônica com 6 membros;
 * o protótipo mobile mostra apenas 5 (omite "Renata Vieira", marcada
 * `desktopOnly`) e usa nomes abreviados só para exibição — o dado
 * armazenado aqui sempre traz o nome completo, e a abreviação é aplicada
 * em tempo de tela via `abbreviateName()` (ver `surface.ts`).
 */

/**
 * A UI atual (`FilterTabs` em Membros) só usa `'ativo'` e `'pendente'`.
 * `'suspenso'` e `'desligado'` fazem parte do modelo de dados real do PRD e
 * existem aqui para não remodelar o tipo quando ganharem tela própria.
 */
export type MemberStatus = 'pendente' | 'ativo' | 'suspenso' | 'desligado';

export interface Member {
  name: string;
  role: string;
  status: MemberStatus;
  desktopOnly?: boolean;
  faltas?: number;
}

export const members: Member[] = [
  { name: 'Leonardo Almeida', role: 'Consultoria Empresarial · Plano Anual', status: 'ativo', faltas: 0 },
  { name: 'Jackson Pereira', role: 'Seguros · Plano Mensal', status: 'pendente', faltas: 1 },
  { name: 'Camila Rocha', role: 'Arquitetura · Plano Anual', status: 'ativo', faltas: 0 },
  { name: 'Eduardo Matos', role: 'Contabilidade · Plano Mensal', status: 'ativo', faltas: 2 },
  { name: 'Davi Lopes', role: 'Tecnologia · Plano Anual', status: 'pendente', faltas: 0 },
  {
    name: 'Renata Vieira',
    role: 'Direito Tributário · Plano Anual',
    status: 'ativo',
    desktopOnly: true,
    faltas: 0,
  },
];

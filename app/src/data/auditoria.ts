/**
 * "Auditoria" (Fase 2 Gestão). Histórico de ações de gestão e fechamentos.
 * Fonte: Fase2Gestao.dc.html, linhas 595-599.
 */

export interface AuditoriaEntry {
  key: number;
  acao: string;
  quando: string;
}

export const auditoria: AuditoriaEntry[] = [
  { key: 1, acao: 'Leonardo A. aprovou o cadastro de Rafael T.', quando: 'Hoje, 10h12' },
  { key: 2, acao: 'Eduardo M. confirmou fechamento de negócio', quando: 'Ontem, 21h47' },
  { key: 3, acao: 'Harrison M. lançou despesa de coffee break', quando: '30/06, 09h05' },
];

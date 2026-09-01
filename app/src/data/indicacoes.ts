/**
 * "Indicações" (Fase 2 Gestão). Protótipo de dados com 5 entradas de indicações
 * em diferentes estágios do pipeline de fechamento.
 * Fonte: Fase2Gestao.dc.html, linhas 361-369 (indicacoesDef).
 */

export type IndicacaoEstagio = 'registrada' | 'contato' | 'andamento' | 'fechado' | 'perdido';

export interface Indicacao {
  id: number;
  indicador: string;
  destinatario: string;
  descricao: string;
  estagio: IndicacaoEstagio;
  dias: number;
  valor: number | null;
  motivo?: string;
}

export const indicacoes: Indicacao[] = [
  {
    id: 1,
    indicador: 'Davi Lopes',
    destinatario: 'Camila Rocha',
    descricao: 'Reforma do escritório do cliente Vega — projeto e execução.',
    estagio: 'registrada',
    dias: 9,
    valor: null,
  },
  {
    id: 2,
    indicador: 'Você',
    destinatario: 'Eduardo Matos',
    descricao: 'Abertura de filial: contabilidade e enquadramento tributário.',
    estagio: 'contato',
    dias: 6,
    valor: null,
  },
  {
    id: 3,
    indicador: 'Leonardo Almeida',
    destinatario: 'Davi Lopes',
    descricao: 'Migração do ERP de uma rede com 4 lojas.',
    estagio: 'andamento',
    dias: 14,
    valor: null,
  },
  {
    id: 4,
    indicador: 'Camila Rocha',
    destinatario: 'Renata Vieira',
    descricao: 'Recuperação de crédito tributário de 3 exercícios.',
    estagio: 'fechado',
    dias: 31,
    valor: 42000,
  },
  {
    id: 5,
    indicador: 'Jackson Pereira',
    destinatario: 'Leonardo Almeida',
    descricao: 'Diagnóstico de gestão para transportadora familiar.',
    estagio: 'perdido',
    dias: 22,
    valor: null,
    motivo: 'Motivo da perda: cliente adiou o projeto para o próximo exercício.',
  },
];

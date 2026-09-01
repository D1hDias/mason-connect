/**
 * "Conduta" (Fase 2 Gestão). Tipos de condutas indevidas e ocorrências registradas.
 * Fonte: Fase2Gestao.dc.html, linhas 603-610 (tiposConduta) e 611-615 (ocorrencias).
 */

export interface TipoConduta {
  label: string;
  value: string;
}

export type SeloTom = 'critical' | 'neutral' | 'warning';

export interface Ocorrencia {
  key: number;
  membro: string;
  tipo: string;
  descricao: string;
  rodape: string;
  seloTom: SeloTom;
  seloTexto: string;
}

export const tiposConduta: TipoConduta[] = [
  { label: 'Networking por interesse imediato', value: 'interesse' },
  { label: 'Falsidade relacional', value: 'falsidade' },
  { label: 'Promessas vazias', value: 'promessas' },
  { label: 'Exposição desnecessária', value: 'exposicao' },
  { label: 'Pressão agressiva', value: 'pressao' },
  { label: 'Manipulação emocional', value: 'manipulacao' },
];

export const ocorrencias: Ocorrencia[] = [
  {
    key: 1,
    membro: 'Jackson Pereira',
    tipo: 'Pressão agressiva',
    descricao: 'Abordou dois convidados da Rodada de 03/06 com proposta comercial imediata, após orientação em contrário.',
    rodape: 'Validada por Leonardo A. · 04/06/2026',
    seloTom: 'critical',
    seloTexto: '3ª validada',
  },
  {
    key: 2,
    membro: 'Jackson Pereira',
    tipo: 'Networking por interesse imediato',
    descricao: 'Solicitou indicação de carteira de clientes a dois membros na primeira semana de convivência.',
    rodape: 'Validada por Leonardo A. · 12/05/2026',
    seloTom: 'neutral',
    seloTexto: 'Validada',
  },
  {
    key: 3,
    membro: 'Marcos Vinícius',
    tipo: 'Promessas vazias',
    descricao: 'Comprometeu-se a apresentar dois convidados por três reuniões seguidas, sem cumprir.',
    rodape: 'Em apuração · registrada em 21/07/2026',
    seloTom: 'warning',
    seloTexto: 'Em apuração',
  },
  {
    key: 4,
    membro: 'Renata Vieira',
    tipo: 'Exposição desnecessária',
    descricao: 'Compartilhou valor de negócio fechado de terceiros em grupo externo ao núcleo.',
    rodape: 'Arquivada após conversa fraterna · 08/04/2026',
    seloTom: 'neutral',
    seloTexto: 'Arquivada',
  },
];

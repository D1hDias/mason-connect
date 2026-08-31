/**
 * "Extrato do caixa" (Financeiro). Desktop é a fonte canônica com 4 linhas;
 * "Aluguel da sede" só existe em DesktopApp.dc.html e é marcada
 * `desktopOnly` — o protótipo mobile mostra apenas as três primeiras.
 *
 * Achado do plano: o valor de "Mensalidades 07/2026" é R$ 14.300 (igual ao
 * desktop) nas duas superfícies. O protótipo MobileApp.dc.html mostra
 * literalmente "+ R$ 650" para essa linha — um valor desatualizado do
 * protótipo, não o dado canônico — por isso não é replicado aqui.
 *
 * Os valores são armazenados como número positivo (`amount`) + sinal
 * (`kind`); a formatação de moeda (incluindo o caractere `−`, U+2212, para
 * negativos) é responsabilidade de quem consome o dado.
 */

/** Sem multa/juros nos textos. */
export type MensalidadeStatus = 'aberta' | 'paga' | 'em_atraso';

export type FinanceEntryKind = 'receita' | 'despesa';

export interface FinanceEntry {
  title: string;
  subtitle: string;
  /** Sempre positivo; `kind` define o sinal na exibição. */
  amount: number;
  kind: FinanceEntryKind;
  /** Presente apenas na linha de mensalidades. */
  mensalidadeStatus?: MensalidadeStatus;
  desktopOnly?: boolean;
}

export const financeEntries: FinanceEntry[] = [
  {
    title: 'Mensalidades 07/2026',
    subtitle: 'Mensalidade · 22 pagantes',
    amount: 14300,
    kind: 'receita',
    mensalidadeStatus: 'paga',
  },
  {
    title: 'Coffee break — junho',
    subtitle: 'Coworking · Café da Praça',
    amount: 380,
    kind: 'despesa',
  },
  {
    title: 'Taxa de adesão',
    subtitle: 'Novo membro · Camila R.',
    amount: 900,
    kind: 'receita',
  },
  {
    title: 'Aluguel da sede',
    subtitle: 'Custo fixo · julho',
    amount: 2400,
    kind: 'despesa',
    desktopOnly: true,
  },
];

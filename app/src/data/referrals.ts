/**
 * "Indicações por membro" (trimestre corrente) — Painel (desktop) e
 * Financeiro (mobile) reusam este mesmo dataset em cards diferentes, nunca
 * os dois ao mesmo tempo na mesma superfície. Desktop é a fonte canônica: o
 * protótipo mobile omite "Renata" (6 barras no desktop, 5 no mobile), por
 * isso é marcada `desktopOnly`.
 */

export interface ReferralEntry {
  label: string;
  value: number;
  desktopOnly?: boolean;
}

export const referrals: ReferralEntry[] = [
  { label: 'Davi', value: 7 },
  { label: 'Camila', value: 6 },
  { label: 'Eduardo', value: 5 },
  { label: 'Leonardo', value: 4 },
  { label: 'Renata', value: 3, desktopOnly: true },
  { label: 'Jackson', value: 2 },
];

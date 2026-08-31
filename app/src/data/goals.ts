/**
 * "Metas do trimestre" (Painel). Extraído de DesktopApp.dc.html /
 * MobileApp.dc.html `renderVals()` — os três `ProgressBar` são idênticos nos
 * dois protótipos, sem itens `desktopOnly`.
 */

/** Mesmos valores aceitos por `ProgressBarTone` do design system. */
export type GoalTone = 'accent' | 'success';

export interface Goal {
  label: string;
  current: number;
  target: number;
  /** 0 a 1. */
  percent: number;
  tone: GoalTone;
}

export const goals: Goal[] = [
  { label: 'Indicações qualificadas', current: 41, target: 50, percent: 0.82, tone: 'accent' },
  { label: 'Reuniões um-a-um', current: 68, target: 72, percent: 0.94, tone: 'success' },
  { label: 'Novos membros', current: 3, target: 8, percent: 0.37, tone: 'accent' },
];

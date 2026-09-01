/**
 * "Onboarding" (Fase 2 Acesso). Membros em processo de integração com duração de cada fase.
 * Fonte: Fase2Acesso.dc.html, linhas 198-203.
 */

export interface OnboardingEntry {
  nome: string;
  dias: number;
  etapa: string;
}

export const emOnboarding: OnboardingEntry[] = [
  { nome: 'Rafael Teixeira', dias: 8, etapa: 'Pilares pendentes' },
  { nome: 'Camila Rocha', dias: 12, etapa: '1-a-1 pendente' },
  { nome: 'Davi Lopes', dias: 21, etapa: '1-a-1 pendente' },
  { nome: 'Marcos Vinícius', dias: 34, etapa: '1-a-1 pendente' },
];

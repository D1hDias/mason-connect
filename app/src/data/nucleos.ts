/**
 * Núcleos disponíveis no seletor de Perfil (`Select` "Núcleo"). Extraído de
 * `renderVals().nucleoOptions`, idêntico nos dois protótipos: RJ, SP, BH.
 */

export interface NucleoOption {
  label: string;
  value: string;
}

export const nucleos: NucleoOption[] = [
  { label: 'Núcleo Rio de Janeiro', value: 'rj' },
  { label: 'Núcleo São Paulo', value: 'sp' },
  { label: 'Núcleo Belo Horizonte', value: 'bh' },
];

/**
 * RN-06 — valores de plano cobrados por membro. Não aparecem literalmente
 * no protótipo (que só mostra a etiqueta "Plano Anual"/"Plano Mensal"), mas
 * o modelo de dados real do PRD define os três valores abaixo.
 */
export type PlanoTipo = 'isento' | 'mensal' | 'anual';

export const PLANO_VALORES: Record<PlanoTipo, number> = {
  isento: 0,
  mensal: 130,
  anual: 1248,
};

import { PLANO_VALORES, type PlanoTipo } from './nucleos';
import type { MemberStatus } from './members';

/**
 * Perfil de Leonardo Almeida (Perfil). Idêntico nos dois protótipos:
 * "Consultoria Empresarial", "Plano Anual", membro desde março de 2023,
 * 31 indicações feitas, 94% de presença no ano.
 */

export interface Profile {
  name: string;
  cadeira: string;
  status: MemberStatus;
  planoTipo: PlanoTipo;
  /** RN-06 — ver `PLANO_VALORES` em `nucleos.ts`. */
  planoValor: number;
  memberSince: string;
  indicacoesFeitas: number;
  presencaAnoPercent: number;
  nucleo: string;
}

export const profile: Profile = {
  name: 'Leonardo Almeida',
  cadeira: 'Consultoria Empresarial',
  status: 'ativo',
  planoTipo: 'anual',
  planoValor: PLANO_VALORES.anual,
  memberSince: 'março de 2023',
  indicacoesFeitas: 31,
  presencaAnoPercent: 94,
  nucleo: 'Núcleo Rio de Janeiro',
};

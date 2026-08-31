/**
 * Helpers genéricos reusados pelos hooks de tela para adaptar os datasets
 * canônicos (fonte: desktop) à superfície atual (mobile ou desktop).
 */

/**
 * Filtra itens marcados `desktopOnly` quando a superfície atual não é
 * desktop. Reusado por qualquer dataset que siga a convenção
 * `{ desktopOnly?: boolean }` (encontros, indicações, membros, extrato).
 */
export function filterForSurface<T extends { desktopOnly?: boolean }>(
  items: T[],
  isDesktop: boolean
): T[] {
  return isDesktop ? items : items.filter((item) => !item.desktopOnly);
}

/**
 * Abrevia um nome completo para o formato usado em Membros no mobile, ex.
 * "Leonardo Almeida" → "Leonardo A.". Nomes sem sobrenome são retornados
 * sem alteração.
 */
export function abbreviateName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return parts.join(' ');
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0];
  return `${firstName} ${lastInitial}.`;
}

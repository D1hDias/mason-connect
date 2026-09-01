/**
 * Official Mason Connect brand colors, sourced from
 * Documentos/Identidade visual MASON/mason-connect-tokens.json.
 * The prototype's `cream` (#F5EFE3) is superseded by the official
 * token value (#F7F1E4) — see design doc §6.
 */
export const brandColors = {
  brown: '#855023',
  gold: '#CAAA67',
  cream: '#F7F1E4',
  ebony: '#2B1D0A',
  bronze: '#9C8C6E',
} as const;

/** Dark "deck" palette, for presentation decks. Not consumed by any v1 component (spec §3). */
export const deckColors = {
  navy: '#1A1F2E',
  navy2: '#243352',
  goldDeck: '#B8952A',
  goldDeck2: '#C9A84C',
  creamDeck: '#F5EDD6',
} as const;

export const semanticColors = {
  bg: brandColors.cream,
  surface: '#FFFFFF',
  text: brandColors.ebony,
  textMuted: brandColors.bronze,
  primary: brandColors.brown,
  primaryHover: '#6E4116',
  accent: brandColors.gold,
  border: '#E3D9C4',
  gridLine: '#EFE8DA',
} as const;

/**
 * Status tint colors used throughout the prototype's badges and status rows
 * (Reuniao, Indicacoes, Membros). Not present in the official token file —
 * formalized here from the prototype's inline values, consolidated into
 * five reusable semantic variants (spec §7 preamble). Screen-specific one-off
 * tints (e.g. the "andamento" Kanban column) are intentionally not preserved;
 * those get decided when the actual screens are composed later.
 */
export const statusColors = {
  success: { bg: '#E4EBD9', fg: '#4E7A3A' },
  warning: { bg: '#F3E4C8', fg: '#B07A1F' },
  critical: { bg: '#F6E3D9', fg: '#9E3B22' },
  neutral: { bg: brandColors.cream, fg: '#6B4A2B' },
  accent: { bg: '#F0E6CF', fg: '#8A6A3F' },
} as const;

/**
 * Finance/monetary tint colors for displaying positive (gains) and negative (losses)
 * values in financial contexts (e.g. ListRow trailing values, financial reports).
 * Distinct namespace (`finance-*` not `status-*`) because hex values diverge from
 * status tokens and because status tints should only be applied via component props,
 * never directly to free-form text.
 */
export const financeColors = {
  positive: '#2F6B3D',
  negative: '#8A2B2B',
} as const;

/**
 * Presence state colors for displaying attendance status (Chip component, Fase2Gestao.dc.html:12).
 * Four semantic states: presente, falta, justificada, representado.
 * Each state has background and foreground color pairs.
 */
export const presenceColors = {
  presente: { bg: '#e4ebd9', fg: '#2f6b3d' },
  falta: { bg: '#f6e3d9', fg: '#8a2b2b' },
  justificada: { bg: '#f3e4c8', fg: '#8a6a1f' },
  representado: { bg: '#f0e6cf', fg: '#8a6a3f' },
} as const;

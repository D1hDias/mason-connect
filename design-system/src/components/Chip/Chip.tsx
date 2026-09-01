export type ChipEstado = 'presente' | 'falta' | 'justificada' | 'representado';

export interface ChipProps {
  estado: ChipEstado;
}

export const PRESENCE_LABELS: Record<ChipEstado, string> = {
  presente: 'Presente',
  falta: 'Falta',
  justificada: 'Justificada',
  representado: 'Representado',
};

const ESTADO_CLASSES: Record<ChipEstado, string> = {
  presente: 'bg-presence-presente-bg text-presence-presente-fg',
  falta: 'bg-presence-falta-bg text-presence-falta-fg',
  justificada: 'bg-presence-justificada-bg text-presence-justificada-fg',
  representado: 'bg-presence-representado-bg text-presence-representado-fg',
};

/** Attendance status chip (presence indicator). Presentational component. */
export function Chip({ estado }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${ESTADO_CLASSES[estado]}`}
    >
      {PRESENCE_LABELS[estado]}
    </span>
  );
}

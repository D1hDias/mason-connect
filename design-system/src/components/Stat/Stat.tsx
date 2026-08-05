import { Card } from '../Card/Card';

export type StatTone = 'default' | 'success' | 'accent';

export interface StatProps {
  label: string;
  value: string;
  hint?: string;
  tone?: StatTone;
}

const TONE_CLASSES: Record<StatTone, string> = {
  default: 'text-brand-brown',
  success: 'text-status-success-fg',
  accent: 'text-brand-gold',
};

/** KPI tile — e.g. "Gerado no trimestre", "Presença média". */
export function Stat({ label, value, hint, tone = 'default' }: StatProps) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-widest font-semibold text-brand-bronze">{label}</p>
      <p className={`font-heading text-3xl font-bold mt-1 ${TONE_CLASSES[tone]}`}>{value}</p>
      {hint && <p className="text-xs mt-1 text-brand-bronze">{hint}</p>}
    </Card>
  );
}

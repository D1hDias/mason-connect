export type ProgressBarTone = 'accent' | 'success';

export interface ProgressBarProps {
  label: string;
  value: number;
  /** 0 to 1. */
  percent: number;
  tone?: ProgressBarTone;
}

const TONE_CLASSES: Record<ProgressBarTone, string> = {
  accent: 'bg-brand-gold',
  success: 'bg-status-success-fg',
};

/** Labeled funnel bar — "Funil do semestre" in Relatórios. */
export function ProgressBar({ label, value, percent, tone = 'accent' }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, percent));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <b className="font-heading">{value}</b>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-3 rounded-full bg-brand-cream"
      >
        <div className={`h-3 rounded-full ${TONE_CLASSES[tone]}`} style={{ width: `${clamped * 100}%` }} />
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'critical' | 'neutral' | 'accent';

export interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-status-success-bg text-status-success-fg',
  warning: 'bg-status-warning-bg text-status-warning-fg',
  critical: 'bg-status-critical-bg text-status-critical-fg',
  neutral: 'bg-status-neutral-bg text-status-neutral-fg',
  accent: 'bg-status-accent-bg text-status-accent-fg',
};

/** Status pill, e.g. "Ativo", "SLA vencido", "Presente". */
export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}

import type { ReactNode } from 'react';

export interface NavTabProps {
  label: string;
  icon?: ReactNode;
  active: boolean;
  onClick: () => void;
}

/** One tab inside `BottomNav`. Active tab is highlighted in brand gold. */
export function NavTab({ label, icon, active, onClick }: NavTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 h-full min-h-[44px] text-xs font-semibold ${
        active ? 'text-brand-gold' : 'text-brand-cream'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

import type { ReactNode } from 'react';

export interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
}

/** Screen title with the brand's gold underline accent. */
export function SectionTitle({ children, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-5">
      <h1 className="font-heading text-3xl font-bold text-brand-brown">{children}</h1>
      {subtitle && <p className="text-sm mt-1 text-brand-bronze">{subtitle}</p>}
      <div className="h-0.5 w-16 mt-3 rounded bg-brand-gold" />
    </div>
  );
}

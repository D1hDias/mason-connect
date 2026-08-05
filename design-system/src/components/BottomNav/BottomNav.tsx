import type { ReactNode } from 'react';

export interface BottomNavProps {
  children: ReactNode;
}

/** Fixed bottom tab bar — the mobile-first replacement for the prototype's sidebar. */
export function BottomNav({ children }: BottomNavProps) {
  return <nav className="flex items-stretch h-16 min-h-[44px] bg-brand-brown">{children}</nav>;
}

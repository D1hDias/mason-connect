import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Whether the card has internal padding. Defaults to true. */
  padded?: boolean;
  children: ReactNode;
}

/** Elevated surface container used to group content across every screen. */
export function Card({ padded = true, className, children, ...rest }: CardProps) {
  return (
    <div {...rest} className={cx('bg-surface rounded-xl shadow', padded && 'p-5', className)}>
      {children}
    </div>
  );
}

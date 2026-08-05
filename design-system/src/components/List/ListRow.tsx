import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface ListRowProps {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  /** Applied by `List` for zebra striping; not meant to be set directly. */
  className?: string;
}

/** One zebra-striped row inside a `List`. Striping is applied by `List`. */
export function ListRow({ leading, title, subtitle, trailing, className }: ListRowProps) {
  return (
    <div className={cx('flex items-center justify-between px-5 py-3.5 min-h-[44px] gap-3', className)}>
      {leading}
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {subtitle && <p className="text-xs text-brand-bronze">{subtitle}</p>}
      </div>
      {trailing && <div className="flex items-center gap-3">{trailing}</div>}
    </div>
  );
}

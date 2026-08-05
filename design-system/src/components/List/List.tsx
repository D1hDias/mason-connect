import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { ListRowProps } from './ListRow';

export interface ListProps {
  /** Optional title banner rendered above the rows, e.g. "Extrato do caixa". */
  header?: string;
  children: ReactNode;
}

/** Card-like container that zebra-stripes its `ListRow` children automatically. */
export function List({ header, children }: ListProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<ListRowProps>[];
  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow">
      {header && <div className="px-5 py-3 font-semibold text-white bg-brand-brown">{header}</div>}
      {rows.map((row, index) =>
        cloneElement(row, {
          key: row.key ?? index,
          className: cx(row.props.className, index % 2 === 1 && 'bg-brand-cream'),
        })
      )}
    </div>
  );
}

import type { SelectHTMLAttributes } from 'react';
import { useId } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'id' | 'style'> {
  label: string;
  options: SelectOption[];
}

/** Labeled dropdown — e.g. the login screen's profile selector. */
export function Select({ label, options, ...rest }: SelectProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-wide font-semibold text-brand-bronze">
        {label}
      </label>
      <select
        id={id}
        {...rest}
        className="w-full h-11 min-h-[44px] mt-1 px-3 rounded-lg outline-none border border-border bg-surface"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

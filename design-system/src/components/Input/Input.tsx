import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id' | 'style'> {
  label: string;
}

/** Labeled text field — login and "nova indicação" forms. */
export function Input({ label, ...rest }: InputProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-wide font-semibold text-brand-bronze">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className="w-full h-11 min-h-[44px] mt-1 px-3 rounded-lg outline-none border border-border bg-surface"
      />
    </div>
  );
}

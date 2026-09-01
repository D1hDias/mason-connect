import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'> {
  /** Visual style. `primary` is solid brand-brown; `secondary` is outlined. */
  variant?: ButtonVariant;
  /** If true, button takes full width of its container. */
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand-brown text-white hover:bg-[var(--mc-primary-hover)]',
  secondary: 'bg-transparent text-brand-brown border-[1.5px] border-brand-gold',
  danger: 'bg-transparent text-status-critical-fg border-[1.5px] border-status-critical-fg/35',
};

/** Primary and secondary call-to-action button, mobile touch target (min 44px tall). */
export function Button({ variant = 'primary', fullWidth, disabled, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled}
      className={cx(
        'inline-flex items-center justify-center h-11 min-h-[44px] px-5 rounded-lg text-sm font-semibold',
        VARIANT_CLASSES[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        fullWidth && 'w-full'
      )}
    >
      {children}
    </button>
  );
}

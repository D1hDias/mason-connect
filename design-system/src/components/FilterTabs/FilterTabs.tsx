import { cx } from '../../utils/cx';

export interface FilterTabsOption {
  label: string;
  value: string;
}

export interface FilterTabsProps {
  options: FilterTabsOption[];
  value: string;
  onChange: (value: string) => void;
}

/** Pill toggle group — e.g. "todos/pendentes" filter, or status categories. */
export function FilterTabs({ options, value, onChange }: FilterTabsProps) {
  return (
    <div role="group" className="flex gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              'px-4 h-11 min-h-[44px] rounded-lg text-sm font-semibold',
              active ? 'bg-brand-brown text-white' : 'border-[1.5px] border-brand-gold text-brand-brown'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

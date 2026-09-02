export interface ToastProps {
  /** The message text to display. */
  message: string;
}

/**
 * A simple feedback card: icon + message on dark background.
 * No internal timer, no positioning — the consuming app controls
 * visibility and placement.
 */
export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-lg bg-brand-ebony px-4 py-4 text-brand-cream shadow-lg"
    >
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-ebony">
        ✓
      </span>
      <span className="flex-1 text-sm leading-relaxed">{message}</span>
    </div>
  );
}

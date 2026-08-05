export interface EmptyStateProps {
  message: string;
  hint?: string;
}

/** "Nada por aqui..." placeholder for empty lists/columns. */
export function EmptyState({ message, hint }: EmptyStateProps) {
  return (
    <div className="text-center py-4">
      <p className="text-xs italic text-brand-bronze">{message}</p>
      {hint && <p className="text-xs text-brand-bronze mt-1">{hint}</p>}
    </div>
  );
}

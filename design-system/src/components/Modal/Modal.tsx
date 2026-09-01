import type { ReactNode } from 'react';

export interface ModalProps {
  /** Whether the modal is visible. When false, Modal renders nothing. */
  open: boolean;
  /**
   * Called by the consumer to close the modal. Modal never calls this
   * itself — the scrim intentionally does not close on click. Wire a
   * Cancel/close button inside `children` to this callback.
   */
  onClose: () => void;
  children: ReactNode;
}

/**
 * Generic overlay container: a scrim covering the viewport with a centered
 * card. Title, body, inputs, and buttons are entirely the consumer's
 * responsibility — Modal only handles positioning and the scrim.
 *
 * Uses `position: fixed; inset: 0` rather than a portal — nothing in the
 * consuming app creates a CSS transform or other containing block that
 * would break `fixed` positioning, so a portal isn't needed.
 */
export function Modal({ open, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-lg">{children}</div>
    </div>
  );
}

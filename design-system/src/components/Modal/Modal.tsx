import { useEffect, type ReactNode } from 'react';

export interface ModalProps {
  /** Whether the modal is visible. When false, Modal renders nothing. */
  open: boolean;
  /**
   * Called by the consumer to close the modal. Modal calls this itself when
   * the user presses Escape while open. The scrim intentionally does NOT
   * close on click — wire a Cancel/close button inside `children` to this
   * callback too.
   */
  onClose: () => void;
  children: ReactNode;
}

/**
 * Generic overlay container: a scrim covering the viewport with a centered
 * card. Title, body, inputs, and buttons are entirely the consumer's
 * responsibility — Modal only handles positioning, the scrim, and basic
 * dialog semantics/keyboard behavior.
 *
 * Uses `position: fixed; inset: 0` rather than a portal — nothing in the
 * consuming app creates a CSS transform or other containing block that
 * would break `fixed` positioning, so a portal isn't needed.
 *
 * Pressing Escape while open calls `onClose`. Clicking the scrim still does
 * NOT close the modal — that's deliberate (see `onClose` doc above).
 */
export function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
    >
      <div className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-lg">{children}</div>
    </div>
  );
}

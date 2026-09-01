import { useCallback, useEffect, useRef, useState } from 'react';

/** Mirrors `AppOverlaysProvider`'s `showToast()` timing (Task 7, `:9`). */
const TOAST_DURATION_MS = 4000;

/**
 * Same `setState`+`setTimeout` toast logic as `useToast()`
 * (`shell/overlays/AppOverlaysProvider.tsx`), but standalone — the 3 `Acesso`
 * screens render outside `AppShell`, so they have no `AppOverlaysProvider`
 * (and therefore no shared `Drawer`/`ConfirmModalHost`/`ToastHost`) to hang
 * off of. `showToast` clears any pending timeout before scheduling a new
 * one, so an earlier toast can't hide a more recent one early; the same
 * timeout is cleared on unmount.
 */
export function useLocalToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      timeoutRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  return { toastMessage, showToast };
}

import { Toast } from 'mason-connect-design-system';
import { useAppOverlaysContext } from './context';

/**
 * Internal host, mounted once by `AppOverlaysProvider` — not part of the
 * public overlays API (consumers use `useToast().showToast(message)`).
 * `bottom-20` (80px) on mobile clears the 64px `MobileBottomNav`; `md:bottom-6`
 * (24px) on desktop, which has no bottom nav. `z-[60]` sits above `Modal`'s
 * fixed `z-50` — matches the prototype's toast-above-modal stacking
 * (`Fase2Gestao.dc.html:15-19`) using the standard Tailwind scale.
 */
export function ToastHost() {
  const { toastMessage } = useAppOverlaysContext('ToastHost');

  if (!toastMessage) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-20 z-[60] md:bottom-6">
      <Toast message={toastMessage} />
    </div>
  );
}

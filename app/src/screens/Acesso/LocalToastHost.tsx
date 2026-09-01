import { Toast } from 'mason-connect-design-system';

/**
 * Renders `useLocalToast()`'s current message via the design-system `Toast`.
 * Unlike the shared `ToastHost` (which sits above a `BottomNav` on mobile),
 * these 3 screens have no bottom nav, so it's always 24px off the bottom on
 * every surface.
 */
export function LocalToastHost({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-6 z-50">
      <Toast message={message} />
    </div>
  );
}

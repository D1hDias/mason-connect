import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppOverlaysContext, useAppOverlaysContext, type AppOverlaysContextValue, type ConfirmConfig } from './context';
import { Drawer } from './Drawer';
import { ConfirmModalHost } from './ConfirmModalHost';
import { ToastHost } from './ToastHost';

export type { ConfirmConfig };

/** How long a toast stays visible before auto-hiding — mirrors the prototype's `notificar()` (`:341-345`/`:161-165`). */
const TOAST_DURATION_MS = 4000;

/**
 * Mounted once in `AppShell.tsx`. Renders `children` unchanged, and mounts
 * the three overlay hosts (`Drawer`, `ConfirmModalHost`, `ToastHost`) as
 * additional children of the same `<Context.Provider>` — that provider is
 * not a DOM node, so this doesn't add a wrapper element around the app's
 * content column.
 *
 * Replicates two prototype interactions (`:341-346`/`:626-633`):
 * `confirm()` opens the modal AND closes the drawer if it's open;
 * `showToast()` shows the toast AND closes any open modal. `showToast`
 * also clears a pending toast timeout before scheduling a new one, so an
 * earlier toast can't hide a more recent one early.
 */
export function AppOverlaysProvider({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ConfirmConfig | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    },
    [],
  );

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const closeModal = useCallback(() => setModalConfig(null), []);

  const confirm = useCallback((cfg: ConfirmConfig) => {
    setModalConfig(cfg);
    setDrawerOpen(false);
  }, []);

  const showToast = useCallback((message: string) => {
    setModalConfig(null);
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  const value: AppOverlaysContextValue = {
    drawerOpen,
    openDrawer,
    closeDrawer,
    modalConfig,
    confirm,
    closeModal,
    toastMessage,
    showToast,
  };

  return (
    <AppOverlaysContext.Provider value={value}>
      {children}
      <Drawer />
      <ConfirmModalHost />
      <ToastHost />
    </AppOverlaysContext.Provider>
  );
}

/** `{ open, openDrawer, closeDrawer }` for the mobile menu drawer. */
export function useDrawer() {
  const { drawerOpen, openDrawer, closeDrawer } = useAppOverlaysContext('useDrawer');
  return { open: drawerOpen, openDrawer, closeDrawer };
}

/** `{ confirm }` — call `confirm(cfg)` to open the shared confirmation modal. */
export function useConfirmModal() {
  const { confirm } = useAppOverlaysContext('useConfirmModal');
  return { confirm };
}

/** `{ showToast }` — call `showToast(message)` to show the shared toast for 4s. */
export function useToast() {
  const { showToast } = useAppOverlaysContext('useToast');
  return { showToast };
}

import { createContext, useContext } from 'react';

/**
 * Config for `useConfirmModal().confirm(cfg)` — mirrors the prototype's
 * `confirmar(cfg)` (`Fase2Gestao.dc.html:341-346`). `pedeMotivo` toggles an
 * optional "Motivo" `Input` in the modal body; the field is uncontrolled
 * (documented no-op — nothing reads its value, see `ConfirmModalHost`).
 */
export interface ConfirmConfig {
  titulo: string;
  corpo: string;
  nota: string;
  acao: string;
  pedeMotivo?: boolean;
  onConfirm: () => void;
}

/**
 * Low-level shape shared by the provider and its overlay hosts (`Drawer`,
 * `ConfirmModalHost`, `ToastHost`). Kept in its own module (no components)
 * so those hosts can read/close overlay state without importing
 * `AppOverlaysProvider.tsx` — which imports them — and creating a cycle.
 */
export interface AppOverlaysContextValue {
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  modalConfig: ConfirmConfig | null;
  confirm: (cfg: ConfirmConfig) => void;
  closeModal: () => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

export const AppOverlaysContext = createContext<AppOverlaysContextValue | undefined>(undefined);

/** Shared `useContext` + missing-provider check used by every public/internal hook below. */
export function useAppOverlaysContext(hookName: string): AppOverlaysContextValue {
  const ctx = useContext(AppOverlaysContext);
  if (!ctx) {
    throw new Error(`${hookName} must be used within an AppOverlaysProvider`);
  }
  return ctx;
}

import { Modal, Input, Button } from 'mason-connect-design-system';
import { useAppOverlaysContext } from './context';

/**
 * Internal host, mounted once by `AppOverlaysProvider` — not part of the
 * public overlays API (consumers use `useConfirmModal().confirm(cfg)`).
 * Composes `Modal` (Task 3) with the title/body/note/buttons described by
 * the current `ConfirmConfig`. Layout follows the prototype's confirm
 * modal (`Fase2Gestao.dc.html:295-312`).
 *
 * The optional "Motivo" `Input` (shown when `pedeMotivo` is true) is
 * uncontrolled — a documented no-op. Nothing in this task reads its value;
 * it exists only to match the prototype's field, ready for a future task
 * to wire up an actual audit-trail payload.
 */
export function ConfirmModalHost() {
  const { modalConfig, closeModal } = useAppOverlaysContext('ConfirmModalHost');

  const handleClose = () => closeModal();

  const handleConfirm = () => {
    modalConfig?.onConfirm();
    closeModal();
  };

  return (
    <Modal open={!!modalConfig} onClose={handleClose}>
      {modalConfig && (
        <div className="flex flex-col gap-4">
          <p className="font-heading text-lg font-bold text-brand-brown">{modalConfig.titulo}</p>
          <p className="text-sm text-brand-brown">{modalConfig.corpo}</p>
          {modalConfig.pedeMotivo && (
            <Input label="Motivo (opcional)" placeholder="Registrado na trilha de auditoria" />
          )}
          <p className="text-xs text-brand-bronze">{modalConfig.nota}</p>
          <div className="flex flex-col gap-2">
            <Button variant="primary" fullWidth onClick={handleConfirm}>
              {modalConfig.acao}
            </Button>
            <Button variant="secondary" fullWidth onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta: Meta<typeof Modal> = { title: 'Components/Modal', component: Modal };
export default meta;
type Story = StoryObj<typeof Modal>;

/**
 * Modal is a generic container — title, body, and buttons are composed by
 * the consumer, same as this confirmation dialog from the prototype.
 */
export const ConfirmationDialog: Story = {
  args: {
    open: true,
    onClose: () => {},
    children: (
      <>
        <p className="mb-2 font-heading text-xl font-bold text-brand-brown">Confirmar recusa?</p>
        <p className="mb-4 text-sm text-brand-ebony">
          Esta ação será registrada na trilha de auditoria e não pode ser desfeita.
        </p>
        <div className="flex flex-col gap-2.5">
          <Button variant="primary" fullWidth>
            Confirmar
          </Button>
          <Button variant="secondary" fullWidth>
            Cancelar
          </Button>
        </div>
      </>
    ),
  },
};

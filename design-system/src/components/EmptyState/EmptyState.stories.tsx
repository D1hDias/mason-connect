import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = { title: 'Components/EmptyState', component: EmptyState };
export default meta;
type Story = StoryObj<typeof EmptyState>;

/** Coluna vazia do quadro de Indicações. */
export const Default: Story = {
  args: { message: 'Nada por aqui. A próxima Rodada de Negócios muda isso.' },
};

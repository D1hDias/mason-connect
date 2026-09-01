import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = { title: 'Components/Toast', component: Toast };
export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = { args: { message: 'Operação concluída com sucesso' } };
export const LongMessage: Story = { args: { message: 'Seu cadastro foi aprovado e agora você pode registrar indicações e negócios' } };

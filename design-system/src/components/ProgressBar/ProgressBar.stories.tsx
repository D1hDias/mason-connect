import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = { title: 'Components/ProgressBar', component: ProgressBar };
export default meta;
type Story = StoryObj<typeof ProgressBar>;

/** Uma etapa do funil do semestre em Relatórios. */
export const FunnelStep: Story = {
  args: { label: 'Em contato ou andamento', value: 14, percent: 0.56, tone: 'accent' },
};
export const Success: Story = {
  args: { label: 'Negócios fechados', value: 9, percent: 0.36, tone: 'success' },
};

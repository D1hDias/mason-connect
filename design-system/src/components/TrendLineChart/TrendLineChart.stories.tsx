import type { Meta, StoryObj } from '@storybook/react';
import { TrendLineChart } from './TrendLineChart';

const meta: Meta<typeof TrendLineChart> = { title: 'Components/TrendLineChart', component: TrendLineChart };
export default meta;
type Story = StoryObj<typeof TrendLineChart>;

/** "Valor gerado pelo grupo (R$ mil)" no Painel. */
export const GroupValueTrend: Story = {
  args: {
    data: [
      { label: 'Fev', value: 38 },
      { label: 'Mar', value: 55 },
      { label: 'Abr', value: 47 },
      { label: 'Mai', value: 92 },
      { label: 'Jun', value: 118 },
      { label: 'Jul', value: 127 },
    ],
    valueFormatter: (v) => `R$ ${v} mil`,
  },
};

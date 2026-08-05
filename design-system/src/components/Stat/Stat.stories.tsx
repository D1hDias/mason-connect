import type { Meta, StoryObj } from '@storybook/react';
import { Stat } from './Stat';

const meta: Meta<typeof Stat> = { title: 'Components/Stat', component: Stat };
export default meta;
type Story = StoryObj<typeof Stat>;

/** KPI "Presença média" do Painel. */
export const Success: Story = {
  args: { label: 'Presença média', value: '87%', hint: 'reuniões oficiais · últimos 90 dias', tone: 'success' },
};
/** KPI "Gerado no trimestre" do Painel. */
export const Default: Story = {
  args: { label: 'Gerado no trimestre', value: 'R$ 337 mil', hint: 'negócios fechados · agregado do grupo' },
};

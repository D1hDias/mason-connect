import type { Meta, StoryObj } from '@storybook/react';
import { CategoryBarChart } from './CategoryBarChart';

const meta: Meta<typeof CategoryBarChart> = { title: 'Components/CategoryBarChart', component: CategoryBarChart };
export default meta;
type Story = StoryObj<typeof CategoryBarChart>;

/** "Indicações por membro (semestre)" em Relatórios. */
export const ReferralsByMember: Story = {
  args: {
    data: [
      { label: 'Davi', value: 7 },
      { label: 'Luetil', value: 6 },
      { label: 'Eduardo', value: 5 },
    ],
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = { title: 'Components/Input', component: Input };
export default meta;
type Story = StoryObj<typeof Input>;

/** Campo "Destinatário" do formulário de nova indicação. */
export const Default: Story = {
  args: { label: 'Destinatário', placeholder: 'Irmão ou empresa' },
};

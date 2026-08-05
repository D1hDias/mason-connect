import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = { title: 'Components/Card', component: Card };
export default meta;
type Story = StoryObj<typeof Card>;

export const Padded: Story = { args: { children: 'Conteúdo do cartão', padded: true } };
export const Unpadded: Story = { args: { children: 'Conteúdo do cartão', padded: false } };

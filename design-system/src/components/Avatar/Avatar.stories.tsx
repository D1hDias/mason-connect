import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = { title: 'Components/Avatar', component: Avatar };
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Active: Story = { args: { name: 'Leonardo A.', tone: 'active' } };
export const Pending: Story = { args: { name: 'Jackson P.', tone: 'pending' } };

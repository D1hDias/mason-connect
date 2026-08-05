import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = { title: 'Components/Badge', component: Badge };
export default meta;
type Story = StoryObj<typeof Badge>;

/** Badge "Ativo" da lista de Membros. */
export const Active: Story = { args: { variant: 'success', children: 'Ativo' } };
/** Badge de alerta de SLA das Indicações. */
export const Warning: Story = { args: { variant: 'warning', children: 'SLA 1d' } };
/** Badge "2 faltas seguidas" de Membros. */
export const Critical: Story = { args: { variant: 'critical', children: '2 faltas seguidas' } };
/** Badge "Registrada" das Indicações. */
export const Neutral: Story = { args: { variant: 'neutral', children: 'Registrada' } };
/** Badge "Representado" da Reunião. */
export const Accent: Story = { args: { variant: 'accent', children: 'Representado' } };

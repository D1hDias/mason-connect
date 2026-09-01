import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = { title: 'Components/Chip', component: Chip };
export default meta;
type Story = StoryObj<typeof Chip>;

/** Attendance status "Presente" (present). */
export const Presente: Story = { args: { estado: 'presente' } };
/** Attendance status "Falta" (absent). */
export const Falta: Story = { args: { estado: 'falta' } };
/** Attendance status "Justificada" (justified absence). */
export const Justificada: Story = { args: { estado: 'justificada' } };
/** Attendance status "Representado" (represented). */
export const Representado: Story = { args: { estado: 'representado' } };

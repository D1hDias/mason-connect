import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = { title: 'Components/Select', component: Select };
export default meta;
type Story = StoryObj<typeof Select>;

/** Seletor de perfil da tela de login. */
export const ProfilePicker: Story = {
  args: {
    label: 'Entrar como',
    value: 'gestor',
    options: [
      { label: 'Gestor', value: 'gestor' },
      { label: 'Administrativo', value: 'administrativo' },
      { label: 'Empresário', value: 'empresario' },
    ],
  },
};

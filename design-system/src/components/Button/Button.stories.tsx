import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

/** "Entrar no sistema" — botão primário da tela de login do protótipo. */
export const Primary: Story = {
  args: { variant: 'primary', children: 'Entrar no sistema' },
};

/** "Cancelar" — botão secundário do formulário de nova indicação. */
export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancelar' },
};

/** "Recusar cadastro" — botão danger para ações críticas. */
export const Danger: Story = {
  args: { variant: 'danger', children: 'Recusar cadastro' },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Entrar no sistema', disabled: true },
};

export const FullWidth: Story = {
  args: { variant: 'primary', children: 'Ação em tela cheia', fullWidth: true },
};

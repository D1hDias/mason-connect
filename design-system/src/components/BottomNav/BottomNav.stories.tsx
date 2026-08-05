import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BottomNav } from './BottomNav';
import { NavTab } from './NavTab';

const meta: Meta<typeof BottomNav> = { title: 'Components/BottomNav', component: BottomNav };
export default meta;
type Story = StoryObj<typeof BottomNav>;

const TABS = ['Painel', 'Membros', 'Indicações', 'Relatórios'];

/** Substitui a sidebar do protótipo pela navegação primária mobile. */
export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('Painel');
    return (
      <BottomNav>
        {TABS.map((label) => (
          <NavTab key={label} label={label} active={active === label} onClick={() => setActive(label)} />
        ))}
      </BottomNav>
    );
  },
};

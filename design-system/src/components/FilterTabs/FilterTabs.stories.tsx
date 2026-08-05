import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterTabs } from './FilterTabs';

const meta: Meta<typeof FilterTabs> = { title: 'Components/FilterTabs', component: FilterTabs };
export default meta;
type Story = StoryObj<typeof FilterTabs>;

/** Filtro "todos/pendentes" da tela de Membros. */
export const MembersFilter: Story = {
  render: () => {
    const [value, setValue] = useState('todos');
    return (
      <FilterTabs
        options={[
          { label: 'Todos', value: 'todos' },
          { label: 'Pendentes', value: 'pendentes' },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

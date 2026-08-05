import type { Meta, StoryObj } from '@storybook/react';
import { List } from './List';
import { ListRow } from './ListRow';
import { Avatar } from '../Avatar/Avatar';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof List> = { title: 'Components/List', component: List };
export default meta;
type Story = StoryObj<typeof List>;

/** Lista de Membros do protótipo. */
export const Members: Story = {
  render: () => (
    <List>
      <ListRow
        leading={<Avatar name="Leonardo A." />}
        title="Leonardo A."
        subtitle="Cadeira: Consultoria Empresarial · Plano Anual"
        trailing={<Badge variant="success">Ativo</Badge>}
      />
      <ListRow
        leading={<Avatar name="Jackson P." tone="pending" />}
        title="Jackson P."
        subtitle="Cadeira: Seguros · Plano Mensal"
        trailing={<Badge variant="neutral">Pendente</Badge>}
      />
    </List>
  ),
};

/** Extrato do caixa em Financeiro, com faixa de título. */
export const WithHeader: Story = {
  render: () => (
    <List header="Extrato do caixa">
      <ListRow title="Mensalidades competência 07/2026" subtitle="Mensalidade" trailing={<span>+ R$ 650</span>} />
      <ListRow title="Coffee break — Coworking de junho" subtitle="Coffee break" trailing={<span>− R$ 380</span>} />
    </List>
  ),
};

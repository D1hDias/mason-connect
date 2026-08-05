import type { Meta, StoryObj } from '@storybook/react';
import { SectionTitle } from './SectionTitle';

const meta: Meta<typeof SectionTitle> = { title: 'Components/SectionTitle', component: SectionTitle };
export default meta;
type Story = StoryObj<typeof SectionTitle>;

/** Título da tela de Painel no protótipo. */
export const WithSubtitle: Story = {
  args: { children: 'Painel da Gestão', subtitle: 'Terça-feira, 3 de julho de 2026 · Núcleo Rio de Janeiro' },
};
export const TitleOnly: Story = { args: { children: 'Membros e Cadeiras' } };

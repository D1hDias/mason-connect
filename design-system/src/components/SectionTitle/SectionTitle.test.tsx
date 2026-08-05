import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { SectionTitle } from './SectionTitle';

describe('SectionTitle', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the title as a heading', () => {
    render(<SectionTitle>Painel da Gestão</SectionTitle>);
    expect(screen.getByRole('heading', { name: 'Painel da Gestão' })).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    render(<SectionTitle subtitle="Núcleo Rio de Janeiro">Painel</SectionTitle>);
    expect(screen.getByText('Núcleo Rio de Janeiro')).toBeInTheDocument();
  });

  it('omits the subtitle paragraph when not provided', () => {
    render(<SectionTitle>Painel</SectionTitle>);
    expect(screen.queryByText('Núcleo Rio de Janeiro')).not.toBeInTheDocument();
  });
});

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ListRow } from './ListRow';

describe('ListRow', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders title, subtitle, leading and trailing content', () => {
    render(
      <ListRow
        leading={<span>AV</span>}
        title="Leonardo A."
        subtitle="Cadeira: Consultoria"
        trailing={<span>Ativo</span>}
      />
    );
    expect(screen.getByText('Leonardo A.')).toBeInTheDocument();
    expect(screen.getByText('Cadeira: Consultoria')).toBeInTheDocument();
    expect(screen.getByText('AV')).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });
});

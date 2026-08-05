import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the message', () => {
    render(<EmptyState message="Nada por aqui. A próxima Rodada de Negócios muda isso." />);
    expect(screen.getByText('Nada por aqui. A próxima Rodada de Negócios muda isso.')).toBeInTheDocument();
  });

  it('renders the hint when provided', () => {
    render(<EmptyState message="Nada por aqui." hint="Registre uma indicação para começar." />);
    expect(screen.getByText('Registre uma indicação para começar.')).toBeInTheDocument();
  });
});

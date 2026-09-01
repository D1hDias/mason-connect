import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the message', () => {
    render(<Toast message="Operação concluída com sucesso" />);
    expect(screen.getByText('Operação concluída com sucesso')).toBeInTheDocument();
  });
});

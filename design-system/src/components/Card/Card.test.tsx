import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<Card>conteúdo</Card>);
    expect(screen.getByText('conteúdo')).toBeInTheDocument();
  });

  it('is padded by default', () => {
    render(<Card>x</Card>);
    expect(screen.getByText('x')).toHaveClass('p-5');
  });

  it('omits padding when padded is false', () => {
    render(<Card padded={false}>x</Card>);
    expect(screen.getByText('x')).not.toHaveClass('p-5');
  });
});

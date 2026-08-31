import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<Button>Entrar</Button>);
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Entrar</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-brand-brown');
  });

  it('applies secondary variant classes when requested', () => {
    render(<Button variant="secondary">Cancelar</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-brand-gold');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Entrar</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Entrar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies w-full class when fullWidth is true', () => {
    render(<Button fullWidth>Entrar</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });
});

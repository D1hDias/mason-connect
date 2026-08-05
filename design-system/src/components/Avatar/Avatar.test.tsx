import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the first letter of the name, uppercased', () => {
    render(<Avatar name="leonardo" />);
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('is exposed to assistive tech with the full name', () => {
    render(<Avatar name="Leonardo A." />);
    expect(screen.getByRole('img', { name: 'Leonardo A.' })).toBeInTheDocument();
  });

  it('applies the pending tone class', () => {
    render(<Avatar name="Jackson P." tone="pending" />);
    expect(screen.getByRole('img')).toHaveClass('bg-brand-bronze');
  });
});

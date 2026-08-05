import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavTab } from './NavTab';

describe('NavTab', () => {
  afterEach(() => {
    cleanup();
  });

  it('marks the active tab with aria-current', () => {
    render(<NavTab label="Painel" active onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Painel' })).toHaveAttribute('aria-current', 'page');
  });

  it('omits aria-current when inactive', () => {
    render(<NavTab label="Painel" active={false} onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Painel' })).not.toHaveAttribute('aria-current');
  });

  it('calls onClick when tapped', async () => {
    const onClick = vi.fn();
    render(<NavTab label="Painel" active={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Painel' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

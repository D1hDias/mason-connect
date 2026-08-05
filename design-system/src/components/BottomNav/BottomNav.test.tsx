import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BottomNav } from './BottomNav';
import { NavTab } from './NavTab';

describe('BottomNav', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders as a navigation landmark containing its tabs', () => {
    render(
      <BottomNav>
        <NavTab label="Painel" active onClick={() => {}} />
        <NavTab label="Membros" active={false} onClick={() => {}} />
      </BottomNav>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Painel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Membros' })).toBeInTheDocument();
  });
});

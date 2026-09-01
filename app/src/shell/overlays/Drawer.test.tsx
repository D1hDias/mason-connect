import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AppOverlaysProvider, useDrawer } from './AppOverlaysProvider';
import { moduleItems } from '../screens-meta';

function LocationDisplay() {
  const { pathname } = useLocation();
  return <span data-testid="pathname">{pathname}</span>;
}

function OpenDrawerButton() {
  const { openDrawer } = useDrawer();
  return (
    <button type="button" onClick={openDrawer}>
      open-drawer
    </button>
  );
}

function renderWithDrawer(initialPath = '/painel') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppOverlaysProvider>
        <LocationDisplay />
        <OpenDrawerButton />
      </AppOverlaysProvider>
    </MemoryRouter>,
  );
}

describe('Drawer', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders nothing visible when closed', () => {
    renderWithDrawer();

    expect(screen.queryByTestId('drawer-scrim')).toBeNull();
    for (const item of moduleItems) {
      expect(screen.queryByRole('button', { name: item.label })).toBeNull();
    }
  });

  it('renders all 8 moduleItems when open', async () => {
    const user = userEvent.setup();
    renderWithDrawer();

    await user.click(screen.getByRole('button', { name: 'open-drawer' }));

    expect(screen.getByTestId('drawer-scrim')).toBeInTheDocument();
    for (const item of moduleItems) {
      expect(screen.getByRole('button', { name: item.label })).toBeInTheDocument();
    }
  });

  it('navigates and closes the drawer when an item is clicked', async () => {
    const user = userEvent.setup();
    renderWithDrawer('/painel');

    await user.click(screen.getByRole('button', { name: 'open-drawer' }));
    await user.click(screen.getByRole('button', { name: 'Financeiro' }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/financeiro');
    expect(screen.queryByTestId('drawer-scrim')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Financeiro' })).toBeNull();
  });

  it('marks the current route active with aria-current', async () => {
    const user = userEvent.setup();
    renderWithDrawer('/membros');

    await user.click(screen.getByRole('button', { name: 'open-drawer' }));

    expect(screen.getByRole('button', { name: 'Membros' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Painel' })).not.toHaveAttribute('aria-current');
  });

  it('closes the drawer when the scrim is clicked', async () => {
    const user = userEvent.setup();
    renderWithDrawer();

    await user.click(screen.getByRole('button', { name: 'open-drawer' }));
    expect(screen.getByTestId('drawer-scrim')).toBeInTheDocument();

    await user.click(screen.getByTestId('drawer-scrim'));
    expect(screen.queryByTestId('drawer-scrim')).toBeNull();
  });
});

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

afterEach(() => {
  cleanup();
});

function renderShell(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<AppShell />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AppShell', () => {
  it('renders both the mobile and desktop nav sets, each with the correct responsive visibility classes', () => {
    const { container } = renderShell('/painel');

    const mobileShell = container.querySelector('.md\\:hidden');
    const desktopShell = container.querySelector('.hidden.md\\:flex');

    expect(mobileShell).not.toBeNull();
    expect(desktopShell).not.toBeNull();

    // Mobile bottom nav tabs + desktop sidebar links: 4 labels, each appearing twice.
    for (const label of ['Painel', 'Membros', 'Financeiro', 'Perfil']) {
      expect(screen.getAllByRole('button', { name: label })).toHaveLength(2);
    }
  });

  it('reflects the active route in both nav sets', () => {
    renderShell('/membros');

    const activeButtons = screen.getAllByRole('button', { name: 'Membros' });
    expect(activeButtons).toHaveLength(2);
    for (const button of activeButtons) {
      expect(button).toHaveAttribute('aria-current', 'page');
    }

    const inactiveButtons = screen.getAllByRole('button', { name: 'Painel' });
    expect(inactiveButtons).toHaveLength(2);
    for (const button of inactiveButtons) {
      expect(button).not.toHaveAttribute('aria-current');
    }
  });

  it('renders 8 nav items in the desktop sidebar and 4 in the mobile bottom nav', () => {
    const { container } = renderShell('/painel');

    // The sidebar's own <nav> and the bottom nav's <div> (BottomNav from the
    // design-system) are the only nav-tab containers — narrower than the two
    // `.md:hidden`/`.hidden.md:flex` wrappers each breakpoint has (header vs.
    // bottom-nav, sidebar vs. topbar), so class selectors alone would grab
    // the wrong sibling.
    const desktopNav = container.querySelector('aside nav') as HTMLElement;
    const mobileNav = container.querySelector('.md\\:hidden nav') as HTMLElement;

    expect(within(mobileNav).getAllByRole('button')).toHaveLength(4);
    expect(within(desktopNav).getAllByRole('button')).toHaveLength(8);

    for (const label of ['Presença', 'Indicações', 'Config', 'Conduta']) {
      expect(within(desktopNav).getByRole('button', { name: label })).toBeInTheDocument();
      expect(within(mobileNav).queryByRole('button', { name: label })).toBeNull();
    }
  });

  it('updates the active nav item when the route changes', () => {
    renderShell('/financeiro');

    for (const button of screen.getAllByRole('button', { name: 'Financeiro' })) {
      expect(button).toHaveAttribute('aria-current', 'page');
    }
    for (const button of screen.getAllByRole('button', { name: 'Perfil' })) {
      expect(button).not.toHaveAttribute('aria-current');
    }
  });
});

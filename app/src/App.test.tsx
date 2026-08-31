import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

afterEach(() => {
  cleanup();
});

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

/**
 * Integration test mounting the REAL routing tree (`AppRoutes`) — the plan's
 * testing strategy required this and it was missing (final-review finding
 * #5). Written after the `AppShell` single-`<Outlet/>` rework (finding #1)
 * so it also exercises real screens inside the real shell, not just route
 * matching: nav-item clicks must swap the actually-rendered screen, and the
 * nav chrome must stay present regardless of which screen is showing —
 * exactly the kind of layout/nav regression that a route-matching-only test
 * would miss.
 */
describe('AppRoutes', () => {
  it('redirects "/" to /painel and renders the Painel screen', () => {
    renderApp('/');
    expect(screen.getByText('Valor gerado no núcleo')).toBeInTheDocument();
  });

  it('renders the distinguishing content of each of the 4 routes', () => {
    renderApp('/painel');
    expect(screen.getByText('Valor gerado no núcleo')).toBeInTheDocument();

    cleanup();
    renderApp('/membros');
    expect(screen.getByText('Cadeiras em aberto')).toBeInTheDocument();

    cleanup();
    renderApp('/financeiro');
    expect(screen.getByText('Cobrança do mês')).toBeInTheDocument();

    cleanup();
    renderApp('/perfil');
    // Rendered once per surface (mobile IdentityCard + desktop IdentityCard),
    // both always in the DOM — only CSS visibility differs between them.
    expect(screen.getAllByText('Cadeira: Consultoria Empresarial').length).toBeGreaterThan(0);
  });

  it('redirects an unmatched path to /painel instead of rendering blank', () => {
    renderApp('/rota-que-nao-existe');
    expect(screen.getByText('Valor gerado no núcleo')).toBeInTheDocument();
  });

  it('keeps the nav chrome present regardless of which screen is showing', () => {
    renderApp('/painel');
    // 4 labels × 2 nav sets (mobile bottom nav + desktop sidebar), always mounted.
    for (const label of ['Painel', 'Membros', 'Financeiro', 'Perfil']) {
      expect(screen.getAllByRole('button', { name: label })).toHaveLength(2);
    }
  });

  it('clicking a nav item swaps the rendered screen — single shared Outlet, not two desynced instances', async () => {
    const user = userEvent.setup();
    renderApp('/painel');

    expect(screen.getByText('Valor gerado no núcleo')).toBeInTheDocument();
    expect(screen.queryByText('Cadeiras em aberto')).not.toBeInTheDocument();

    // Two "Membros" buttons exist (mobile bottom nav + desktop sidebar) since
    // both nav sets are always mounted — click either, there is only one
    // shared screen instance to update now.
    const [membrosNav] = screen.getAllByRole('button', { name: 'Membros' });
    await user.click(membrosNav);

    expect(screen.getByText('Cadeiras em aberto')).toBeInTheDocument();
    expect(screen.queryByText('Valor gerado no núcleo')).not.toBeInTheDocument();

    // Nav chrome is still there after the swap.
    for (const label of ['Painel', 'Membros', 'Financeiro', 'Perfil']) {
      expect(screen.getAllByRole('button', { name: label })).toHaveLength(2);
    }
  });
});

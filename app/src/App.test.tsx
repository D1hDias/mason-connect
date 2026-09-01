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

/**
 * The 4 standalone routes (Task 10/11) sit outside `AppShell` in `routes.tsx`
 * — they get their own `AcessoLayout`/`OnboardingHeader`, never the shared
 * `BottomNav`/sidebar. Each screen's own test file mounts it in isolation
 * (a local `<Routes>` with just itself + the route it navigates to), so none
 * of them exercises the real routing tree and none asserts the shell is
 * actually absent — the gestão screens have an explicit "renders inside
 * AppShell, not standalone" counterpart (`PresencaScreen.test.tsx` etc.) but
 * these 4 didn't have the inverse. Filling that gap here, through the real
 * `AppRoutes`, the same way the gestão screens' route-integration tests do.
 */
describe('AppRoutes — standalone routes render without the AppShell', () => {
  it('/login has no BottomNav/sidebar chrome', () => {
    renderApp('/login');

    expect(screen.getByText('Entrar', { selector: 'p' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Painel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Membros' })).not.toBeInTheDocument();
  });

  it('/recuperar-senha has no BottomNav/sidebar chrome', () => {
    renderApp('/recuperar-senha');

    expect(screen.getByText('Recuperar senha', { selector: 'p' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Painel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Membros' })).not.toBeInTheDocument();
  });

  it('/redefinir-senha has no BottomNav/sidebar chrome', () => {
    renderApp('/redefinir-senha?token=abc123');

    expect(screen.getByText('Definir nova senha', { selector: 'p' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Painel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Membros' })).not.toBeInTheDocument();
  });

  it('/onboarding has no BottomNav/sidebar chrome', () => {
    renderApp('/onboarding');

    expect(screen.getByText('Onboarding do núcleo')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Painel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Membros' })).not.toBeInTheDocument();
  });
});

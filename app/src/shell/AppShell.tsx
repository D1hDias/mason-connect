import { Outlet } from 'react-router-dom';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopTopbar } from './DesktopTopbar';

/**
 * Dual-render por classes Tailwind (`md:hidden` / `hidden md:flex`,
 * breakpoint padrão 768px) em vez de um hook de `matchMedia` — evita mock
 * de ambiente extra e flicker de resize. Os dois conjuntos de navegação
 * (mobile + desktop) ficam sempre montados no DOM; só a visibilidade CSS
 * alterna por breakpoint. Cada lado tem seu próprio `<Outlet/>`.
 */
export function AppShell() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="flex min-h-screen flex-col md:hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>

      <div className="hidden min-h-screen md:flex">
        <DesktopSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DesktopTopbar />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

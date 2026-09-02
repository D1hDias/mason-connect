import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoSymbol from '../../assets/logo-symbol.png';
import { profile } from '../../data/profile';
import { navIcon } from '../nav-icons';
import { moduleItems } from '../screens-meta';
import { useAppOverlaysContext } from './context';

/**
 * Internal host, mounted once by `AppOverlaysProvider` — not part of the
 * public overlays API (consumers use `useDrawer()` to open/close it; the
 * mobile ☰ button in `MobileHeader` is the only opener). Returns `null`
 * when closed, same pattern as the design-system `Modal`.
 *
 * Header (logo + "Mason Connect" + `profile.nucleo`) and nav-item classes
 * are copied verbatim from `DesktopSidebar` — same visual treatment,
 * markup lives here too since this is app-owned chrome, not a
 * design-system component (see `DesktopSidebar`'s own doc comment).
 * Deliberately omits `DesktopSidebar`'s "Próximo encontro" footer card —
 * not specified for the drawer.
 *
 * `z-40` for both scrim and panel — below `Modal`'s fixed `z-50`, above
 * ordinary content, matching the prototype's relative stacking
 * (`Fase2Gestao.dc.html:15-19`) with the standard Tailwind scale.
 *
 * Deliberate difference from the prototype: there, some nav items only
 * showed a toast instead of navigating (a design-tool limitation) — here,
 * all 8 `moduleItems` navigate for real, no exceptions.
 *
 * Pressing Escape while open calls `closeDrawer()` (same pattern as the
 * design-system `Modal`'s Escape handling). Clicking the scrim also
 * closes it, via the existing `onClick={closeDrawer}` below.
 */
export function Drawer() {
  const { drawerOpen, closeDrawer } = useAppOverlaysContext('Drawer');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) {
    return null;
  }

  const goTo = (path: string) => {
    navigate(path);
    closeDrawer();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={closeDrawer} data-testid="drawer-scrim" />
      <div
        role="dialog"
        aria-label="Menu"
        className="fixed inset-y-0 left-0 z-40 flex w-[284px] flex-col gap-[26px] bg-brand-brown px-3.5 py-[22px]"
      >
        <div className="flex items-center gap-3 px-1">
          <span className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-cream">
            <img src={logoSymbol} alt="Mason Connect" className="h-8 w-8 object-contain" />
          </span>
          <span className="flex min-w-0 flex-col gap-px">
            <span className="whitespace-nowrap font-heading text-[17px] font-bold leading-tight text-brand-gold">
              Mason Connect
            </span>
            <span className="truncate text-[11px] text-brand-cream/70">{profile.nucleo}</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {moduleItems.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => goTo(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[48px] items-center gap-3 rounded-lg px-4 text-left text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-brand-cream text-brand-brown'
                    : 'text-brand-cream hover:bg-brand-cream/10'
                }`}
              >
                {navIcon(item.path)}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

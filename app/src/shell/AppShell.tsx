import { Outlet } from 'react-router-dom';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopTopbar } from './DesktopTopbar';
import { AppOverlaysProvider } from './overlays/AppOverlaysProvider';

/**
 * Single shared content column with ONE `<Outlet/>` — each screen mounts
 * exactly once regardless of viewport. Final whole-branch review found that
 * two separate `<Outlet/>`s (one per breakpoint) meant two independent
 * component instances per screen, each with its own `useState` — e.g. the
 * Membros filter tab or a Perfil input would desync between "mobile" and
 * "desktop" renders whenever the viewport crossed 768px, and every chart
 * mounted two `ResponsiveContainer`s (one permanently `display:none`).
 *
 * Chrome still dual-renders by Tailwind visibility classes (`md:hidden` /
 * `hidden md:flex`, breakpoint 768px) rather than a `matchMedia` hook —
 * avoids mock/flicker — but now as siblings wrapping the ONE content
 * column instead of each owning a full duplicated tree:
 *   - mobile: header above, bottom-nav below the shared `<main>`
 *   - desktop: sidebar beside, topbar above the shared `<main>`
 * The root is a single flex row throughout: on mobile the sidebar wrapper
 * is `display:none` (removed from flex layout entirely), so the content
 * column is the row's only participating item and naturally fills it.
 *
 * `h-[100dvh]` (not `min-h-screen`) on the root gives the shell a hard
 * height cap so only `<main>` scrolls, instead of the whole document.
 * `min-h-0` on both the flex column and `<main>` is required for that cap
 * to actually constrain a flex child taller than the viewport — a flex
 * item's default `min-height: auto` would otherwise let it grow past the
 * cap regardless of the fixed-height ancestor, which is what let
 * `MobileBottomNav`/`MobileHeader` scroll off-screen on tall content
 * (final-review finding: Painel/Financeiro measured ~400-500px off-screen
 * on first load).
 */
export function AppShell() {
  return (
    <AppOverlaysProvider>
      <div className="flex h-[100dvh] bg-brand-cream">
        <div className="hidden md:flex">
          <DesktopSidebar />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="md:hidden">
            <MobileHeader />
          </div>
          <div className="hidden md:flex">
            <DesktopTopbar />
          </div>

          <main className="min-h-0 flex-1 overflow-y-auto">
            <Outlet />
          </main>

          <div className="md:hidden">
            <MobileBottomNav />
          </div>
        </div>
      </div>
    </AppOverlaysProvider>
  );
}

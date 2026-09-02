import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNav, NavTab } from 'mason-connect-design-system';
import { navIcon } from './nav-icons';
import { navItems } from './screens-meta';

/**
 * Compõe `BottomNav`+`NavTab` do design-system: 4 abas ligadas à rota
 * atual (`useLocation`) e navegam via `useNavigate` — `NavTab` é um
 * `<button>` do design-system, não um link, então a ligação com o router
 * é feita por hook, não pelo componente `<NavLink>`. `pb-[env(safe-area-
 * inset-bottom)]` evita ficar atrás do home indicator quando instalado
 * como PWA.
 */
export function MobileBottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex-none bg-brand-brown pb-[env(safe-area-inset-bottom)]">
      <BottomNav>
        {navItems.map((item) => (
          <NavTab
            key={item.path}
            label={item.label}
            icon={navIcon(item.path)}
            active={pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </BottomNav>
    </div>
  );
}

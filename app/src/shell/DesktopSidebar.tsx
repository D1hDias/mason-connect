import { useLocation, useNavigate } from 'react-router-dom';
import logoSymbol from '../assets/logo-symbol.png';
import { meetings } from '../data/meetings';
import { profile } from '../data/profile';
import { navIcon } from './nav-icons';
import { moduleItems } from './screens-meta';

/**
 * Markup próprio do app (não é componente do design-system — achado #4):
 * 248px fixo, sempre expandida (sem toggle de colapsar — achado #6). O
 * card "Próximo encontro" no rodapé usa o primeiro item de `meetings.ts`
 * diretamente, sem duplicar o texto em outro lugar.
 *
 * Ícones de `nav-icons.tsx` no lugar da bolinha (`.mc-dot`) original —
 * `currentColor` acompanha a cor do texto (ativo/inativo) sem variante
 * própria. Texto inativo trocado de `text-brand-cream/80` pra `text-brand-
 * cream` cheio: a opacidade dava 4.42:1 de contraste sobre `bg-brand-brown`,
 * abaixo do mínimo AA de 4.5:1 pra texto normal — cheio sobe pra 5.89:1.
 */
export function DesktopSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [nextMeeting] = meetings;

  return (
    <aside className="flex w-[248px] flex-none flex-col gap-[26px] bg-brand-brown px-3.5 py-[22px]">
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
              onClick={() => navigate(item.path)}
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

      <div className="mt-auto flex flex-col gap-2 rounded-lg bg-brand-ebony/30 p-4">
        <span className="text-[11px] font-bold uppercase tracking-wide text-brand-gold">Próximo encontro</span>
        <span className="text-[13px] font-semibold leading-snug text-brand-cream">{nextMeeting.title}</span>
        <span className="mc-num text-xs text-brand-cream/70">{nextMeeting.dateLabel}</span>
      </div>
    </aside>
  );
}

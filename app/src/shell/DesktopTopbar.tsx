import { useLocation } from 'react-router-dom';
import { Avatar } from 'mason-connect-design-system';
import { screensMeta } from './screens-meta';

/**
 * Título/subtítulo vindos de `screens-meta` pela rota atual, campo de
 * busca visual sem `onChange` (não especificado no protótipo), avatar
 * fixo "Leonardo Almeida" (usuário logado no protótipo).
 */
export function DesktopTopbar() {
  const { pathname } = useLocation();
  const meta = screensMeta[pathname] ?? screensMeta['/painel'];

  return (
    <header className="flex h-[76px] flex-none items-center gap-5 border-b border-border bg-surface px-8">
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-heading text-lg font-bold leading-tight text-brand-brown">{meta.title}</span>
        <span className="text-xs text-brand-bronze">{meta.desktopSubtitle}</span>
      </span>
      <label className="flex h-[42px] min-w-[280px] items-center gap-2 rounded-lg border border-brand-brown/20 bg-brand-cream px-3.5 text-sm text-brand-bronze">
        <span aria-hidden="true">⌕</span>
        <input
          placeholder="Buscar membro, lançamento ou encontro"
          className="flex-1 border-0 bg-transparent text-brand-ebony outline-none placeholder:text-brand-bronze"
        />
      </label>
      <Avatar name="Leonardo Almeida" />
    </header>
  );
}

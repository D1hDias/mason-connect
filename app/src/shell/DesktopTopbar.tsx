import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Avatar } from 'mason-connect-design-system';
import { useToast } from './overlays/AppOverlaysProvider';
import { screensMeta } from './screens-meta';

/**
 * Título/subtítulo vindos de `screens-meta` pela rota atual, campo de busca
 * e avatar fixo "Leonardo Almeida" (usuário logado no protótipo).
 *
 * A busca ainda não filtra nada (não especificada no protótipo), mas é um
 * `input` controlado dentro de um `<form>`: digitar funciona e o submit
 * devolve um `Toast`. Antes era um campo puramente decorativo, sem `value`
 * nem `onChange` — visível no topo das 8 telas em desktop, ou seja, o
 * primeiro lugar onde alguém tenta interagir e não acontecia nada.
 */
export function DesktopTopbar() {
  const { pathname } = useLocation();
  const meta = screensMeta[pathname] ?? screensMeta['/painel'];
  const { showToast } = useToast();
  const [query, setQuery] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const termo = query.trim();
    if (!termo) {
      return;
    }
    showToast(`Busca por "${termo}" — a busca global entra na próxima versão.`);
  }

  return (
    <header className="flex h-[76px] flex-none items-center gap-5 border-b border-border bg-surface px-8">
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-heading text-lg font-bold leading-tight text-brand-brown">{meta.title}</span>
        <span className="text-xs text-brand-bronze">{meta.desktopSubtitle}</span>
      </span>
      <form onSubmit={handleSubmit} role="search">
        <label className="flex h-[42px] min-w-[280px] items-center gap-2 rounded-lg border border-brand-brown/20 bg-brand-cream px-3.5 text-sm text-brand-bronze">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar membro, lançamento ou encontro"
            aria-label="Buscar membro, lançamento ou encontro"
            className="flex-1 border-0 bg-transparent text-brand-ebony outline-none placeholder:text-brand-bronze"
          />
        </label>
      </form>
      <Avatar name="Leonardo Almeida" />
    </header>
  );
}

import type { ReactNode } from 'react';

/**
 * Ícone de linha por item de navegação (`navItems`/`moduleItems` em
 * `screens-meta.ts`), usado por `MobileBottomNav`, `DesktopSidebar` e
 * `Drawer`. `membros`/`presenca`/`indicacoes`/`config` são os mesmos paths
 * SVG do protótipo original (`design_handoff_mason_connect_app/design/
 * Fase2Gestao.dc.html`, método `icone()`) — nunca chegaram a ser portados
 * pro código, ficando só como bolinha (`.mc-dot`)/sem ícone (achado da Fase
 * 2). `painel`/`financeiro`/`perfil`/`conduta` são novos, desenhados aqui no
 * mesmo estilo (o protótipo nunca chegou a especificá-los — pendência
 * registrada em `HANDOFF-contexto-design.md`). `currentColor` herda a cor
 * ativa/inativa de quem renderiza (mesmo texto do botão), então não precisa
 * de variante própria por estado.
 */
const ICON_PATHS: Record<string, string[]> = {
  '/painel': ['M4 20v-6', 'M9 20v-11', 'M14 20v-7', 'M19 20v-3', 'M2 20h20'],
  '/membros': [
    'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20',
    'M10 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
    'M17.5 12.2a3 3 0 0 0 0-5.9',
    'M20 20v-1.4a3.2 3.2 0 0 0-2.2-3',
  ],
  '/financeiro': ['M3 7h18v10H3z', 'M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z', 'M6 9.5v5', 'M18 9.5v5'],
  '/perfil': ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M5 20a7 7 0 0 1 14 0'],
  '/presenca': [
    'M7 3v3',
    'M17 3v3',
    'M4 8h16',
    'M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8',
    'M9 14.2l2.2 2.2L15.5 12',
  ],
  '/indicacoes': ['M4 8h11', 'M12 5l3 3-3 3', 'M20 16H9', 'M12 13l-3 3 3 3'],
  '/config': [
    'M6 4v6',
    'M6 14v6',
    'M12 4v10',
    'M12 18v2',
    'M18 4v2',
    'M18 10v10',
    'M3.5 12h5',
    'M9.5 16h5',
    'M15.5 7h5',
  ],
  '/conduta': ['M12 3l7 3.5v5c0 5-3 8.5-7 9.5-4-1-7-4.5-7-9.5v-5Z', 'M12 8v5', 'M12 15.5h.01'],
};

/** Ícone de navegação para a rota `path`, ou `null` se nenhum estiver definido. */
export function navIcon(path: string): ReactNode {
  const paths = ICON_PATHS[path];
  if (!paths) {
    return null;
  }

  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

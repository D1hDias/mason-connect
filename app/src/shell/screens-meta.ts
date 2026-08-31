/**
 * Título/subtítulo por tela e por breakpoint (`DesktopTopbar`), e a lista de
 * abas de navegação compartilhada por `MobileBottomNav`/`DesktopSidebar`.
 *
 * Membros diverge de propósito entre mobile e desktop — o protótipo mobile
 * mostra só "24 membros ativos", o desktop acrescenta os cadastros
 * pendentes ("24 membros ativos · 2 cadastros pendentes"). Os dois textos
 * são preservados, não unificados. Perfil não tem subtítulo mobile (o
 * protótipo mobile não usa `SectionTitle` na tela de Perfil) — só desktop.
 */

export interface ScreenMeta {
  title: string;
  /** Ausente para telas cujo protótipo mobile não renderiza subtítulo (Perfil). */
  mobileSubtitle?: string;
  desktopSubtitle: string;
}

export const screensMeta: Record<string, ScreenMeta> = {
  '/painel': {
    title: 'Painel da Gestão',
    mobileSubtitle: 'Resumo de julho de 2026',
    desktopSubtitle: 'Resumo de julho de 2026',
  },
  '/membros': {
    title: 'Membros',
    mobileSubtitle: '24 membros ativos',
    desktopSubtitle: '24 membros ativos · 2 cadastros pendentes',
  },
  '/financeiro': {
    title: 'Financeiro',
    mobileSubtitle: 'Competência 07/2026',
    desktopSubtitle: 'Competência 07/2026',
  },
  '/perfil': {
    title: 'Meu perfil',
    desktopSubtitle: 'Dados cadastrais e preferências',
  },
};

export interface NavItem {
  path: string;
  label: string;
}

/** 4 abas, mesma ordem/rótulos nos dois protótipos. */
export const navItems: NavItem[] = [
  { path: '/painel', label: 'Painel' },
  { path: '/membros', label: 'Membros' },
  { path: '/financeiro', label: 'Financeiro' },
  { path: '/perfil', label: 'Perfil' },
];

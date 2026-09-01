import { useNavigate } from 'react-router-dom';
import logoSymbol from '../../assets/logo-symbol.png';
import { profile } from '../../data/profile';

/**
 * Header próprio da tela de Onboarding (`Fase2Acesso.dc.html:66-73`) — barra
 * marrom com logo + wordmark + `profile.nucleo` + botão "Sair". Deliberadamente
 * NÃO reutiliza `MobileHeader`/`DesktopTopbar`: aquelas assumem o contexto do
 * `AppShell` (breadcrumb de tela ativa, `DesktopSidebar` ao lado etc.) que
 * esta rota standalone não tem — mesma lógica de `AcessoLayout` não ser
 * reaproveitado aqui (o protótipo desta tela usa um header próprio,
 * diferente do card centralizado de login).
 *
 * "Sair" navega direto pra `/login`, sem confirmação e sem
 * `authClient.signOut()` — não há sessão real modelada nesta rota (fora de
 * escopo desta tarefa).
 */
export function OnboardingHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex flex-none items-center gap-3 bg-brand-brown px-5 py-3">
      <span className="flex h-[38px] w-[38px] flex-none items-center justify-center overflow-hidden rounded-full bg-brand-cream">
        <img src={logoSymbol} alt="Mason Connect" className="h-[30px] w-[30px] object-contain" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="font-heading text-[17px] font-bold leading-tight text-brand-gold">Mason Connect</span>
        <span className="truncate text-[11px] text-brand-cream/70">{profile.nucleo}</span>
      </span>
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="inline-flex min-h-[44px] flex-none items-center rounded-lg border border-brand-gold/50 px-3.5 text-xs font-semibold text-brand-gold"
      >
        Sair
      </button>
    </header>
  );
}

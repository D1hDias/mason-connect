import logoSymbol from '../assets/logo-symbol.png';
import { profile } from '../data/profile';

/**
 * Header marrom mobile: logo, "Mason Connect", nome do núcleo, botão ☰
 * decorativo (sem `onClick` — não especificado no protótipo, achado #6).
 * `pt-[...env(safe-area-inset-top)...]` evita ficar atrás do notch quando
 * instalado como PWA (Task 3 já configura `viewport-fit=cover`).
 */
export function MobileHeader() {
  return (
    <header className="flex flex-none items-center gap-3 bg-brand-brown px-5 pb-4 pt-[calc(env(safe-area-inset-top)_+_6px)]">
      <span className="flex h-[38px] w-[38px] flex-none items-center justify-center overflow-hidden rounded-full bg-brand-cream">
        <img src={logoSymbol} alt="Mason Connect" className="h-[30px] w-[30px] object-contain" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="font-heading text-[17px] font-bold leading-tight text-brand-gold">Mason Connect</span>
        <span className="truncate text-[11px] text-brand-cream/70">{profile.nucleo}</span>
      </span>
      <span
        aria-hidden="true"
        className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full border border-brand-gold/50 text-[15px] text-brand-gold"
      >
        ☰
      </span>
    </header>
  );
}

import type { ReactNode } from 'react';
import logoSymbol from '../../assets/logo-symbol.png';

/**
 * Shared chrome for the 3 real auth screens (Task 10, `Fase2Acesso.dc.html:15-26`):
 * full-bleed dark radial gradient, single responsive centered column
 * (`max-w-[420px] mx-auto` — no fixed 390×844px prototype bezel, that's tool
 * chrome, not product), circular 76px logo + "Mason Connect" wordmark +
 * tagline. `children` is the screen-specific `Card`.
 *
 * The gradient is built from the same `--mc-brown`/`--mc-ebony` tokens
 * `MobileHeader`/`Toast` already use elsewhere (not the prototype's raw
 * `#4a3418`, which isn't a design-system token) — same dark, warm feel, no
 * new hex introduced.
 */
export function AcessoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_90%_at_50%_0%,var(--mc-brown)_0%,var(--mc-ebony)_62%)] px-6 py-10">
      <div className="flex w-full max-w-[420px] flex-col gap-6">
        <div className="flex flex-col items-center gap-3.5">
          <span className="flex h-[76px] w-[76px] flex-none items-center justify-center overflow-hidden rounded-full bg-brand-cream shadow-lg">
            <img src={logoSymbol} alt="Mason Connect" className="h-[58px] w-[58px] object-contain" />
          </span>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <span className="font-heading text-[27px] font-bold leading-tight text-brand-gold">Mason Connect</span>
            <span className="max-w-[250px] text-[13px] leading-relaxed text-brand-cream/70">
              Da confiança entre Irmãos à prosperidade mensurável
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

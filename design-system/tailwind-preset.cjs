/**
 * Shared Tailwind preset for Mason Connect. Consuming apps extend this via
 * `presets: [require('mason-connect-design-system/tailwind-preset')]`.
 * Colors resolve through the CSS custom properties in tokens.css, so the
 * hex values stay single-sourced there.
 * `.cjs` extension: the package sets `"type": "module"` in package.json, so a
 * plain `.js` file using `module.exports` would throw `ReferenceError: module
 * is not defined in ES module scope`. `.cjs` always loads as CommonJS
 * regardless of that setting.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          // `rgb(var(--x-rgb) / <alpha-value>)`, não `var(--mc-x)` direto:
          // permite `text-brand-cream/70` etc. compor opacidade de verdade
          // (Tailwind substitui `<alpha-value>` por `1` sem modificador, ou
          // pela fração do `/NN` — precisa dos 3 canais separados em
          // `--mc-x-rgb`, ver comentário em tokens.css).
          brown: 'rgb(var(--mc-brown-rgb) / <alpha-value>)',
          gold: 'rgb(var(--mc-gold-rgb) / <alpha-value>)',
          cream: 'rgb(var(--mc-cream-rgb) / <alpha-value>)',
          ebony: 'rgb(var(--mc-ebony-rgb) / <alpha-value>)',
          bronze: 'rgb(var(--mc-bronze-rgb) / <alpha-value>)',
        },
        surface: 'var(--mc-surface)',
        border: 'var(--mc-border)',
        status: {
          'success-bg': 'var(--mc-status-success-bg)',
          'success-fg': 'var(--mc-status-success-fg)',
          'warning-bg': 'var(--mc-status-warning-bg)',
          'warning-fg': 'var(--mc-status-warning-fg)',
          'critical-bg': 'var(--mc-status-critical-bg)',
          'critical-fg': 'var(--mc-status-critical-fg)',
          'neutral-bg': 'var(--mc-status-neutral-bg)',
          'neutral-fg': 'var(--mc-status-neutral-fg)',
          'accent-bg': 'var(--mc-status-accent-bg)',
          'accent-fg': 'var(--mc-status-accent-fg)',
        },
        finance: {
          positive: 'var(--mc-finance-positive)',
          negative: 'var(--mc-finance-negative)',
        },
        presence: {
          'presente-bg': 'var(--mc-presence-presente-bg)',
          'presente-fg': 'var(--mc-presence-presente-fg)',
          'falta-bg': 'var(--mc-presence-falta-bg)',
          'falta-fg': 'var(--mc-presence-falta-fg)',
          'justificada-bg': 'var(--mc-presence-justificada-bg)',
          'justificada-fg': 'var(--mc-presence-justificada-fg)',
          'representado-bg': 'var(--mc-presence-representado-bg)',
          'representado-fg': 'var(--mc-presence-representado-fg)',
        },
      },
      fontFamily: {
        heading: ['Georgia', 'Times New Roman', 'serif'],
        body: ['Verdana', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '16px',
      },
      boxShadow: {
        DEFAULT: '0 2px 8px rgba(43,29,10,0.12)',
        lg: '0 8px 24px rgba(43,29,10,0.18)',
      },
    },
  },
};

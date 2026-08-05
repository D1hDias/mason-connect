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
          brown: 'var(--mc-brown)',
          gold: 'var(--mc-gold)',
          cream: 'var(--mc-cream)',
          ebony: 'var(--mc-ebony)',
          bronze: 'var(--mc-bronze)',
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

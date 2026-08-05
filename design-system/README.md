# Mason Connect Design System

Biblioteca de componentes React/TypeScript da identidade visual oficial do Mason Connect.
Ver `docs/superpowers/specs/2026-08-05-mason-connect-design-system-design.md` no
repositório principal para o desenho completo (escopo, decisões de tokens, e o
inventário de componentes com sua origem no protótipo).

## Desenvolvimento

```bash
npm install
npm test              # Vitest — roda toda a suíte
npm run storybook     # Storybook em http://localhost:6006
npm run build          # dist/ (ESM + CJS + .d.ts) e dist/styles.css
npm run build-storybook
```

## Uso

```tsx
import { Button, Card } from 'mason-connect-design-system';
import 'mason-connect-design-system/dist/styles.css';
```

Apps que usam Tailwind podem estender o mesmo preset de tema:

```js
// tailwind.config.js
module.exports = {
  presets: [require('mason-connect-design-system/tailwind-preset')],
};
```

## Status

v1 — fiel ao protótipo de alta fidelidade (`MC_BlocoC_08_Prototipo_Navegavel.jsx`),
com navegação e layout reprojetados para mobile-first. Fora de escopo: modais,
toasts, tabs genéricas, paginação, tema "deck" (ver spec §10).

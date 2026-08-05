# Mason Connect Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `design-system/`, a real, compilable React/TypeScript component library (with a publishable `dist/`) that formalizes the Mason Connect brand's official tokens and the UI vocabulary already validated in `MC_BlocoC_08_Prototipo_Navegavel.jsx`, ready to be consumed by the `/design-sync` skill.

**Architecture:** A single npm package at `design-system/` (root-level folder, no monorepo). Each component lives in its own folder (`src/components/<Name>/`) with its implementation, Vitest test, and Storybook story. Styling is Tailwind CSS configured to resolve exclusively through the brand's CSS custom properties (`src/tokens/tokens.css`), never arbitrary hex values, via a shared `tailwind-preset.js`. Build output is produced by `tsup` (JS/CJS/ESM + `.d.ts`) plus a separate Tailwind CLI pass that compiles `dist/styles.css`.

**Tech Stack:** React 18 + TypeScript (strict), Tailwind CSS 3, tsup (esbuild), Storybook 8 (`@storybook/react-vite`), Vitest + React Testing Library, recharts (bundled dependency for the two chart components).

**Not part of this plan:** running `/design-sync`, prototyping in claude.ai/design, or writing the product's PRD/app. Those happen later, in a separate session, once the user has finished exploring the prototype in claude.ai/design.

## Global Constraints

- Package name is exactly `mason-connect-design-system`, published at repo path `design-system/` (spec §4).
- No `McXxx` prefix on component names — the package is already the namespace (spec §4).
- Package manager is npm (spec §4).
- No component accepts raw `style`/`bg`/`fg` props — every color/state is a named semantic variant (spec §7 preamble).
- Every interactive element (`Button`, `Input`, `Select`, `ListRow`, `NavTab`, `FilterTabs`) has a minimum touch target of 44px (spec §8).
- No component assumes a lateral grid layout — content components render full-width/single-column by default (spec §8).
- `BottomNav`/`NavTab` replace the prototype's sidebar as the primary navigation pattern (spec §8).
- The official token value for `cream` is `#F7F1E4` — NOT the prototype's `#F5EFE3` (spec §6).
- Out of scope for v1: modals, toasts, generic tabs (beyond `FilterTabs`), pagination, dark "deck" theme components (spec §10).
- Full screen compositions from the prototype are Storybook-only reference stories, never exported components (spec §7).

---

### Task 1: Project scaffolding

**Files:**
- Create: `design-system/package.json`
- Create: `design-system/tsconfig.json`
- Create: `design-system/tsup.config.ts`
- Create: `design-system/vitest.config.ts`
- Create: `design-system/vitest.setup.ts`
- Create: `design-system/.gitignore`
- Create: `design-system/src/index.ts`
- Test: `design-system/src/index.test.ts`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `VERSION: string` (temporary export from `src/index.ts`, replaced in Task 18); the npm scripts `build`, `build:js`, `build:css`, `test`, `test:watch`, `storybook`, `build-storybook`; the Vitest environment (`jsdom` + `@testing-library/jest-dom` matchers + `ResizeObserver` mock) that every later test task relies on.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "mason-connect-design-system",
  "version": "0.1.0",
  "private": true,
  "description": "Biblioteca de componentes React/TypeScript da identidade visual oficial do Mason Connect.",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./dist/styles.css": "./dist/styles.css",
    "./tailwind-preset": "./tailwind-preset.js"
  },
  "files": ["dist", "tailwind-preset.js"],
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "build": "npm run build:js && npm run build:css",
    "build:js": "tsup",
    "build:css": "tailwindcss -i ./src/styles.css -o ./dist/styles.css --minify",
    "test": "vitest run",
    "test:watch": "vitest",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "peerDependencies": {
    "react": ">=18.2.0",
    "react-dom": ">=18.2.0"
  },
  "dependencies": {
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@storybook/addon-essentials": "^8.0.0",
    "@storybook/react": "^8.0.0",
    "@storybook/react-vite": "^8.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "storybook": "^8.0.0",
    "tailwindcss": "^3.4.0",
    "tsup": "^8.0.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vitest": "^1.5.0"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src", "tailwind.config.ts", "tsup.config.ts", "vitest.config.ts"]
}
```

- [ ] **Step 3: Write `tsup.config.ts`**

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});
```

- [ ] **Step 4: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: false,
  },
});
```

- [ ] **Step 5: Write `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';

// Recharts' ResponsiveContainer needs ResizeObserver, which jsdom does not implement.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error -- jsdom has no ResizeObserver
global.ResizeObserver = global.ResizeObserver ?? ResizeObserverMock;
```

- [ ] **Step 6: Write `.gitignore`**

```
node_modules
dist
storybook-static
*.tsbuildinfo
```

- [ ] **Step 7: Write a minimal `src/index.ts`**

```ts
export const VERSION = '0.1.0';
```

- [ ] **Step 8: Write the failing test**

```ts
// design-system/src/index.test.ts
import { describe, it, expect } from 'vitest';
import { VERSION } from './index';

describe('package scaffolding', () => {
  it('exposes a version constant', () => {
    expect(VERSION).toBe('0.1.0');
  });
});
```

- [ ] **Step 9: Install dependencies and run the test**

Run: `cd design-system && npm install && npm test`
Expected: PASS (1 test).

- [ ] **Step 10: Verify the JS build works end to end**

Run: `npm run build:js`
Expected: exits 0; `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts` are created.

- [ ] **Step 11: Commit**

```bash
git add design-system/package.json design-system/tsconfig.json design-system/tsup.config.ts \
  design-system/vitest.config.ts design-system/vitest.setup.ts design-system/.gitignore \
  design-system/src/index.ts design-system/src/index.test.ts design-system/package-lock.json
git commit -m "chore(design-system): scaffold package, build and test tooling"
```

---

### Task 2: Design tokens, `cx` utility, and the Tailwind pipeline

**Files:**
- Create: `design-system/src/tokens/colors.ts`
- Create: `design-system/src/tokens/typography.ts`
- Create: `design-system/src/tokens/spacing.ts`
- Create: `design-system/src/tokens/index.ts`
- Create: `design-system/src/tokens/tokens.css`
- Create: `design-system/src/tokens/colors.test.ts`
- Create: `design-system/src/utils/cx.ts`
- Create: `design-system/src/utils/cx.test.ts`
- Create: `design-system/src/styles.css`
- Create: `design-system/tailwind-preset.js`
- Create: `design-system/tailwind.config.ts`
- Create: `design-system/postcss.config.js`

**Interfaces:**
- Consumes: nothing beyond Task 1's scaffolding.
- Produces: `brandColors`, `deckColors`, `semanticColors`, `statusColors` (from `src/tokens/colors.ts`); `fontFamilies` (from `src/tokens/typography.ts`); `space`, `radius`, `shadow` (from `src/tokens/spacing.ts`); `cx(...values: ClassValue[]): string` (from `src/utils/cx.ts`) — used by every interactive component from Task 3 onward; the Tailwind utility classes `bg-brand-*`, `text-brand-*`, `bg-status-*-bg`, `text-status-*-fg`, `bg-surface`, `border-border`, `font-heading`, `font-body` — used by every component task from Task 3 onward.

- [ ] **Step 1: Write the failing token tests**

```ts
// design-system/src/tokens/colors.test.ts
import { describe, it, expect } from 'vitest';
import { brandColors, statusColors } from './colors';

describe('brandColors', () => {
  it('matches the official Mason Connect brand palette', () => {
    expect(brandColors.brown).toBe('#855023');
    expect(brandColors.gold).toBe('#CAAA67');
    // The prototype used #F5EFE3 for cream; the official token value wins (design doc §6).
    expect(brandColors.cream).toBe('#F7F1E4');
  });
});

describe('statusColors', () => {
  it('defines all five semantic status variants', () => {
    expect(Object.keys(statusColors).sort()).toEqual(
      ['accent', 'critical', 'neutral', 'success', 'warning'].sort()
    );
  });
});
```

```ts
// design-system/src/utils/cx.test.ts
import { describe, it, expect } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins truthy values with a space', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c');
  });

  it('drops falsy values', () => {
    expect(cx('a', false, undefined, null, 'b')).toBe('a b');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './colors'` and `Cannot find module './cx'`.

- [ ] **Step 3: Implement the token modules**

```ts
// design-system/src/tokens/colors.ts

/**
 * Official Mason Connect brand colors, sourced from
 * Documentos/Identidade visual MASON/mason-connect-tokens.json.
 * The prototype's `cream` (#F5EFE3) is superseded by the official
 * token value (#F7F1E4) — see design doc §6.
 */
export const brandColors = {
  brown: '#855023',
  gold: '#CAAA67',
  cream: '#F7F1E4',
  ebony: '#2B1D0A',
  bronze: '#9C8C6E',
} as const;

/** Dark "deck" palette, for presentation decks. Not consumed by any v1 component (spec §3). */
export const deckColors = {
  navy: '#1A1F2E',
  navy2: '#243352',
  goldDeck: '#B8952A',
  goldDeck2: '#C9A84C',
  creamDeck: '#F5EDD6',
} as const;

export const semanticColors = {
  bg: brandColors.cream,
  surface: '#FFFFFF',
  text: brandColors.ebony,
  textMuted: brandColors.bronze,
  primary: brandColors.brown,
  primaryHover: '#6E4116',
  accent: brandColors.gold,
  border: '#E3D9C4',
} as const;

/**
 * Status tint colors used throughout the prototype's badges and status rows
 * (Reuniao, Indicacoes, Membros). Not present in the official token file —
 * formalized here from the prototype's inline values, consolidated into
 * five reusable semantic variants (spec §7 preamble). Screen-specific one-off
 * tints (e.g. the "andamento" Kanban column) are intentionally not preserved;
 * those get decided when the actual screens are composed later.
 */
export const statusColors = {
  success: { bg: '#E4EBD9', fg: '#4E7A3A' },
  warning: { bg: '#F3E4C8', fg: '#B07A1F' },
  critical: { bg: '#F6E3D9', fg: '#9E3B22' },
  neutral: { bg: brandColors.cream, fg: '#6B4A2B' },
  accent: { bg: '#F0E6CF', fg: '#8A6A3F' },
} as const;
```

```ts
// design-system/src/tokens/typography.ts
export const fontFamilies = {
  heading: "Georgia, 'Times New Roman', serif",
  body: "Verdana, 'Segoe UI', Arial, sans-serif",
  deck: "Calibri, 'Segoe UI', Arial, sans-serif",
} as const;
```

```ts
// design-system/src/tokens/spacing.ts
export const space = {
  1: '4px', 2: '8px', 3: '12px', 4: '16px',
  6: '24px', 8: '32px', 12: '48px', 16: '64px',
} as const;

export const radius = {
  sm: '4px', base: '8px', lg: '16px',
} as const;

export const shadow = {
  base: '0 2px 8px rgba(43,29,10,0.12)',
  lg: '0 8px 24px rgba(43,29,10,0.18)',
} as const;
```

```ts
// design-system/src/tokens/index.ts
export * from './colors';
export * from './typography';
export * from './spacing';
```

```ts
// design-system/src/utils/cx.ts
export type ClassValue = string | false | null | undefined;

/** Joins truthy class name fragments with a single space. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS (all tests, including Task 1's).

- [ ] **Step 5: Write the raw CSS custom properties**

```css
/* design-system/src/tokens/tokens.css */
:root {
  --mc-brown: #855023;
  --mc-gold: #CAAA67;
  --mc-cream: #F7F1E4;
  --mc-ebony: #2B1D0A;
  --mc-bronze: #9C8C6E;

  --mc-navy: #1A1F2E;
  --mc-navy-2: #243352;
  --mc-deck-gold: #B8952A;
  --mc-deck-gold-2: #C9A84C;
  --mc-deck-cream: #F5EDD6;

  --mc-bg: var(--mc-cream);
  --mc-surface: #FFFFFF;
  --mc-text: var(--mc-ebony);
  --mc-text-muted: var(--mc-bronze);
  --mc-primary: var(--mc-brown);
  --mc-primary-hover: #6E4116;
  --mc-accent: var(--mc-gold);
  --mc-border: #E3D9C4;

  --mc-bg-dark: var(--mc-navy);
  --mc-surface-dark: var(--mc-navy-2);
  --mc-text-dark: var(--mc-deck-cream);
  --mc-accent-dark: var(--mc-deck-gold-2);

  --mc-font-heading: Georgia, 'Times New Roman', serif;
  --mc-font-body: Verdana, 'Segoe UI', Arial, sans-serif;
  --mc-font-deck: Calibri, 'Segoe UI', Arial, sans-serif;

  --mc-space-1: 4px; --mc-space-2: 8px; --mc-space-3: 12px;
  --mc-space-4: 16px; --mc-space-6: 24px; --mc-space-8: 32px;
  --mc-space-12: 48px; --mc-space-16: 64px;

  --mc-radius-sm: 4px;
  --mc-radius: 8px;
  --mc-radius-lg: 16px;
  --mc-shadow: 0 2px 8px rgba(43, 29, 10, 0.12);
  --mc-shadow-lg: 0 8px 24px rgba(43, 29, 10, 0.18);

  --mc-status-success-bg: #E4EBD9; --mc-status-success-fg: #4E7A3A;
  --mc-status-warning-bg: #F3E4C8; --mc-status-warning-fg: #B07A1F;
  --mc-status-critical-bg: #F6E3D9; --mc-status-critical-fg: #9E3B22;
  --mc-status-neutral-bg: var(--mc-cream); --mc-status-neutral-fg: #6B4A2B;
  --mc-status-accent-bg: #F0E6CF; --mc-status-accent-fg: #8A6A3F;
}
```

- [ ] **Step 6: Write the shared Tailwind preset**

```js
// design-system/tailwind-preset.js
/**
 * Shared Tailwind preset for Mason Connect. Consuming apps extend this via
 * `presets: [require('mason-connect-design-system/tailwind-preset')]`.
 * Colors resolve through the CSS custom properties in tokens.css, so the
 * hex values stay single-sourced there.
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
```

- [ ] **Step 7: Write the package's own Tailwind config, PostCSS config, and CSS entry point**

```ts
// design-system/tailwind.config.ts
import type { Config } from 'tailwindcss';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const preset = require('./tailwind-preset.js');

const config: Config = {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}'],
};

export default config;
```

```js
// design-system/postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

```css
/* design-system/src/styles.css */
@import './tokens/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Verify the CSS build compiles the tokens**

Run: `npm run build:css && grep -q -- '--mc-brown: #855023' dist/styles.css`
Expected: exits 0 (the compiled stylesheet contains the brand token).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/tokens design-system/src/utils design-system/src/styles.css \
  design-system/tailwind-preset.js design-system/tailwind.config.ts design-system/postcss.config.js
git commit -m "feat(design-system): add design tokens, cx utility, and Tailwind pipeline"
```

---

### Task 3: `Button`

**Files:**
- Create: `design-system/src/components/Button/Button.tsx`
- Create: `design-system/src/components/Button/Button.stories.tsx`
- Create: `design-system/src/components/Button/Button.test.tsx`
- Create: `design-system/src/components/Button/index.ts`

**Interfaces:**
- Consumes: `cx` from `../../utils/cx` (Task 2).
- Produces: `Button(props: ButtonProps): JSX.Element`, `ButtonVariant = 'primary' | 'secondary'`, `ButtonProps` — re-exported from `./index.ts`, consumed by Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/Button/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Entrar</Button>);
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Entrar</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-brand-brown');
  });

  it('applies secondary variant classes when requested', () => {
    render(<Button variant="secondary">Cancelar</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-brand-gold');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Entrar</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Entrar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Button`
Expected: FAIL — `Cannot find module './Button'`.

- [ ] **Step 3: Implement `Button`**

```tsx
// design-system/src/components/Button/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Visual style. `primary` is solid brand-brown; `secondary` is outlined. */
  variant?: ButtonVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand-brown text-white hover:bg-[var(--mc-primary-hover)]',
  secondary: 'bg-transparent text-brand-brown border-[1.5px] border-brand-gold',
};

/** Primary and secondary call-to-action button, mobile touch target (min 44px tall). */
export function Button({ variant = 'primary', disabled, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={cx(
        'inline-flex items-center justify-center h-11 min-h-[44px] px-5 rounded-lg text-sm font-semibold',
        VARIANT_CLASSES[variant],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}
```

```ts
// design-system/src/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant } from './Button';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- Button`
Expected: PASS (5 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

/** "Entrar no sistema" — botão primário da tela de login do protótipo. */
export const Primary: Story = {
  args: { variant: 'primary', children: 'Entrar no sistema' },
};

/** "Cancelar" — botão secundário do formulário de nova indicação. */
export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancelar' },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Entrar no sistema', disabled: true },
};
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/Button
git commit -m "feat(design-system): add Button component"
```

---

### Task 4: Storybook configuration

**Files:**
- Create: `design-system/.storybook/main.ts`
- Create: `design-system/.storybook/preview.ts`

**Interfaces:**
- Consumes: `src/styles.css` (Task 2), `Button.stories.tsx` (Task 3) as the first story to verify against.
- Produces: a working `npm run storybook` / `npm run build-storybook` pipeline that every later component task's `.stories.tsx` file plugs into automatically (glob-based discovery, no per-story registration needed).

- [ ] **Step 1: Write the Storybook main config**

```ts
// design-system/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

- [ ] **Step 2: Write the Storybook preview config**

```ts
// design-system/.storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'cream',
      values: [
        { name: 'cream', value: '#F7F1E4' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
  },
};

export default preview;
```

- [ ] **Step 3: Verify Storybook builds and discovers the Button story**

Run: `npm run build-storybook`
Expected: exits 0; `storybook-static/index.html` is created; the build log lists `Components/Button` among the discovered stories.

- [ ] **Step 4: Commit**

```bash
git add design-system/.storybook
git commit -m "chore(design-system): configure Storybook"
```

---

### Task 5: `Badge`

**Files:**
- Create: `design-system/src/components/Badge/Badge.tsx`
- Create: `design-system/src/components/Badge/Badge.stories.tsx`
- Create: `design-system/src/components/Badge/Badge.test.tsx`
- Create: `design-system/src/components/Badge/index.ts`

**Interfaces:**
- Consumes: nothing beyond React itself.
- Produces: `Badge(props: BadgeProps): JSX.Element`, `BadgeVariant = 'success' | 'warning' | 'critical' | 'neutral' | 'accent'`, `BadgeProps` — consumed by Task 13's `List` story and Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/Badge/Badge.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge variant="success">Ativo</Badge>);
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it.each([
    ['success', 'bg-status-success-bg'],
    ['warning', 'bg-status-warning-bg'],
    ['critical', 'bg-status-critical-bg'],
    ['neutral', 'bg-status-neutral-bg'],
    ['accent', 'bg-status-accent-bg'],
  ] as const)('applies %s variant classes', (variant, expectedClass) => {
    render(<Badge variant={variant}>x</Badge>);
    expect(screen.getByText('x')).toHaveClass(expectedClass);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Badge`
Expected: FAIL — `Cannot find module './Badge'`.

- [ ] **Step 3: Implement `Badge`**

```tsx
// design-system/src/components/Badge/Badge.tsx
import type { ReactNode } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'critical' | 'neutral' | 'accent';

export interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-status-success-bg text-status-success-fg',
  warning: 'bg-status-warning-bg text-status-warning-fg',
  critical: 'bg-status-critical-bg text-status-critical-fg',
  neutral: 'bg-status-neutral-bg text-status-neutral-fg',
  accent: 'bg-status-accent-bg text-status-accent-fg',
};

/** Status pill, e.g. "Ativo", "SLA vencido", "Presente". */
export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}
```

```ts
// design-system/src/components/Badge/index.ts
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- Badge`
Expected: PASS (6 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/Badge/Badge.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = { title: 'Components/Badge', component: Badge };
export default meta;
type Story = StoryObj<typeof Badge>;

/** Badge "Ativo" da lista de Membros. */
export const Active: Story = { args: { variant: 'success', children: 'Ativo' } };
/** Badge de alerta de SLA das Indicações. */
export const Warning: Story = { args: { variant: 'warning', children: 'SLA 1d' } };
/** Badge "2 faltas seguidas" de Membros. */
export const Critical: Story = { args: { variant: 'critical', children: '2 faltas seguidas' } };
/** Badge "Registrada" das Indicações. */
export const Neutral: Story = { args: { variant: 'neutral', children: 'Registrada' } };
/** Badge "Representado" da Reunião. */
export const Accent: Story = { args: { variant: 'accent', children: 'Representado' } };
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/Badge
git commit -m "feat(design-system): add Badge component"
```

---

### Task 6: `Card`

**Files:**
- Create: `design-system/src/components/Card/Card.tsx`
- Create: `design-system/src/components/Card/Card.stories.tsx`
- Create: `design-system/src/components/Card/Card.test.tsx`
- Create: `design-system/src/components/Card/index.ts`

**Interfaces:**
- Consumes: `cx` from `../../utils/cx` (Task 2).
- Produces: `Card(props: CardProps): JSX.Element`, `CardProps` — consumed by Task 8's `Stat`, and Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/Card/Card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>conteúdo</Card>);
    expect(screen.getByText('conteúdo')).toBeInTheDocument();
  });

  it('is padded by default', () => {
    render(<Card>x</Card>);
    expect(screen.getByText('x')).toHaveClass('p-5');
  });

  it('omits padding when padded is false', () => {
    render(<Card padded={false}>x</Card>);
    expect(screen.getByText('x')).not.toHaveClass('p-5');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Card`
Expected: FAIL — `Cannot find module './Card'`.

- [ ] **Step 3: Implement `Card`**

```tsx
// design-system/src/components/Card/Card.tsx
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the card has internal padding. Defaults to true. */
  padded?: boolean;
  children: ReactNode;
}

/** Elevated surface container used to group content across every screen. */
export function Card({ padded = true, className, children, ...rest }: CardProps) {
  return (
    <div {...rest} className={cx('bg-surface rounded-xl shadow', padded && 'p-5', className)}>
      {children}
    </div>
  );
}
```

```ts
// design-system/src/components/Card/index.ts
export { Card } from './Card';
export type { CardProps } from './Card';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- Card`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/Card/Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = { title: 'Components/Card', component: Card };
export default meta;
type Story = StoryObj<typeof Card>;

export const Padded: Story = { args: { children: 'Conteúdo do cartão', padded: true } };
export const Unpadded: Story = { args: { children: 'Conteúdo do cartão', padded: false } };
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/Card
git commit -m "feat(design-system): add Card component"
```

---

### Task 7: `SectionTitle`

**Files:**
- Create: `design-system/src/components/SectionTitle/SectionTitle.tsx`
- Create: `design-system/src/components/SectionTitle/SectionTitle.stories.tsx`
- Create: `design-system/src/components/SectionTitle/SectionTitle.test.tsx`
- Create: `design-system/src/components/SectionTitle/index.ts`

**Interfaces:**
- Consumes: nothing beyond React itself.
- Produces: `SectionTitle(props: SectionTitleProps): JSX.Element`, `SectionTitleProps` — consumed by Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/SectionTitle/SectionTitle.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionTitle } from './SectionTitle';

describe('SectionTitle', () => {
  it('renders the title as a heading', () => {
    render(<SectionTitle>Painel da Gestão</SectionTitle>);
    expect(screen.getByRole('heading', { name: 'Painel da Gestão' })).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    render(<SectionTitle subtitle="Núcleo Rio de Janeiro">Painel</SectionTitle>);
    expect(screen.getByText('Núcleo Rio de Janeiro')).toBeInTheDocument();
  });

  it('omits the subtitle paragraph when not provided', () => {
    render(<SectionTitle>Painel</SectionTitle>);
    expect(screen.queryByText('Núcleo Rio de Janeiro')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- SectionTitle`
Expected: FAIL — `Cannot find module './SectionTitle'`.

- [ ] **Step 3: Implement `SectionTitle`**

```tsx
// design-system/src/components/SectionTitle/SectionTitle.tsx
import type { ReactNode } from 'react';

export interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
}

/** Screen title with the brand's gold underline accent. */
export function SectionTitle({ children, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-5">
      <h1 className="font-heading text-3xl font-bold text-brand-brown">{children}</h1>
      {subtitle && <p className="text-sm mt-1 text-brand-bronze">{subtitle}</p>}
      <div className="h-0.5 w-16 mt-3 rounded bg-brand-gold" />
    </div>
  );
}
```

```ts
// design-system/src/components/SectionTitle/index.ts
export { SectionTitle } from './SectionTitle';
export type { SectionTitleProps } from './SectionTitle';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- SectionTitle`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/SectionTitle/SectionTitle.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SectionTitle } from './SectionTitle';

const meta: Meta<typeof SectionTitle> = { title: 'Components/SectionTitle', component: SectionTitle };
export default meta;
type Story = StoryObj<typeof SectionTitle>;

/** Título da tela de Painel no protótipo. */
export const WithSubtitle: Story = {
  args: { children: 'Painel da Gestão', subtitle: 'Terça-feira, 3 de julho de 2026 · Núcleo Rio de Janeiro' },
};
export const TitleOnly: Story = { args: { children: 'Membros e Cadeiras' } };
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/SectionTitle
git commit -m "feat(design-system): add SectionTitle component"
```

---

### Task 8: `Stat`

**Files:**
- Create: `design-system/src/components/Stat/Stat.tsx`
- Create: `design-system/src/components/Stat/Stat.stories.tsx`
- Create: `design-system/src/components/Stat/Stat.test.tsx`
- Create: `design-system/src/components/Stat/index.ts`

**Interfaces:**
- Consumes: `Card` from `../Card/Card` (Task 6).
- Produces: `Stat(props: StatProps): JSX.Element`, `StatTone = 'default' | 'success' | 'accent'`, `StatProps` — consumed by Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/Stat/Stat.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stat } from './Stat';

describe('Stat', () => {
  it('renders label and value', () => {
    render(<Stat label="Presença média" value="87%" />);
    expect(screen.getByText('Presença média')).toBeInTheDocument();
    expect(screen.getByText('87%')).toBeInTheDocument();
  });

  it('renders the hint when provided', () => {
    render(<Stat label="x" value="1" hint="últimos 90 dias" />);
    expect(screen.getByText('últimos 90 dias')).toBeInTheDocument();
  });

  it('applies the tone color class to the value', () => {
    render(<Stat label="x" value="87%" tone="success" />);
    expect(screen.getByText('87%')).toHaveClass('text-status-success-fg');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Stat`
Expected: FAIL — `Cannot find module './Stat'`.

- [ ] **Step 3: Implement `Stat`**

```tsx
// design-system/src/components/Stat/Stat.tsx
import { Card } from '../Card/Card';

export type StatTone = 'default' | 'success' | 'accent';

export interface StatProps {
  label: string;
  value: string;
  hint?: string;
  tone?: StatTone;
}

const TONE_CLASSES: Record<StatTone, string> = {
  default: 'text-brand-brown',
  success: 'text-status-success-fg',
  accent: 'text-brand-gold',
};

/** KPI tile — e.g. "Gerado no trimestre", "Presença média". */
export function Stat({ label, value, hint, tone = 'default' }: StatProps) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-widest font-semibold text-brand-bronze">{label}</p>
      <p className={`font-heading text-3xl font-bold mt-1 ${TONE_CLASSES[tone]}`}>{value}</p>
      {hint && <p className="text-xs mt-1 text-brand-bronze">{hint}</p>}
    </Card>
  );
}
```

```ts
// design-system/src/components/Stat/index.ts
export { Stat } from './Stat';
export type { StatProps, StatTone } from './Stat';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- Stat`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/Stat/Stat.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Stat } from './Stat';

const meta: Meta<typeof Stat> = { title: 'Components/Stat', component: Stat };
export default meta;
type Story = StoryObj<typeof Stat>;

/** KPI "Presença média" do Painel. */
export const Success: Story = {
  args: { label: 'Presença média', value: '87%', hint: 'reuniões oficiais · últimos 90 dias', tone: 'success' },
};
/** KPI "Gerado no trimestre" do Painel. */
export const Default: Story = {
  args: { label: 'Gerado no trimestre', value: 'R$ 337 mil', hint: 'negócios fechados · agregado do grupo' },
};
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/Stat
git commit -m "feat(design-system): add Stat component"
```

---

### Task 9: `Avatar`

**Files:**
- Create: `design-system/src/components/Avatar/Avatar.tsx`
- Create: `design-system/src/components/Avatar/Avatar.stories.tsx`
- Create: `design-system/src/components/Avatar/Avatar.test.tsx`
- Create: `design-system/src/components/Avatar/index.ts`

**Interfaces:**
- Consumes: nothing beyond React itself.
- Produces: `Avatar(props: AvatarProps): JSX.Element`, `AvatarTone = 'active' | 'pending'`, `AvatarProps` — consumed by Task 13's `List` story and Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/Avatar/Avatar.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders the first letter of the name, uppercased', () => {
    render(<Avatar name="leonardo" />);
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('is exposed to assistive tech with the full name', () => {
    render(<Avatar name="Leonardo A." />);
    expect(screen.getByRole('img', { name: 'Leonardo A.' })).toBeInTheDocument();
  });

  it('applies the pending tone class', () => {
    render(<Avatar name="Jackson P." tone="pending" />);
    expect(screen.getByRole('img')).toHaveClass('bg-brand-bronze');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Avatar`
Expected: FAIL — `Cannot find module './Avatar'`.

- [ ] **Step 3: Implement `Avatar`**

```tsx
// design-system/src/components/Avatar/Avatar.tsx
export type AvatarTone = 'active' | 'pending';

export interface AvatarProps {
  /** Full name; the first character is used as the initial shown. */
  name: string;
  tone?: AvatarTone;
}

const TONE_CLASSES: Record<AvatarTone, string> = {
  active: 'bg-brand-brown',
  pending: 'bg-brand-bronze',
};

/** Circular initial avatar — member list rows and the login mark. */
export function Avatar({ name, tone = 'active' }: AvatarProps) {
  return (
    <div
      role="img"
      aria-label={name}
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white font-heading ${TONE_CLASSES[tone]}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
```

```ts
// design-system/src/components/Avatar/index.ts
export { Avatar } from './Avatar';
export type { AvatarProps, AvatarTone } from './Avatar';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- Avatar`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/Avatar/Avatar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = { title: 'Components/Avatar', component: Avatar };
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Active: Story = { args: { name: 'Leonardo A.', tone: 'active' } };
export const Pending: Story = { args: { name: 'Jackson P.', tone: 'pending' } };
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/Avatar
git commit -m "feat(design-system): add Avatar component"
```

---

### Task 10: `Input`

**Files:**
- Create: `design-system/src/components/Input/Input.tsx`
- Create: `design-system/src/components/Input/Input.stories.tsx`
- Create: `design-system/src/components/Input/Input.test.tsx`
- Create: `design-system/src/components/Input/index.ts`

**Interfaces:**
- Consumes: nothing beyond React itself (uses the built-in `useId` hook).
- Produces: `Input(props: InputProps): JSX.Element`, `InputProps` — consumed by Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/Input/Input.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the field', () => {
    render(<Input label="Destinatário" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Destinatário')).toBeInTheDocument();
  });

  it('calls onChange when typed into', async () => {
    const onChange = vi.fn();
    render(<Input label="Destinatário" value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Destinatário'), 'a');
    expect(onChange).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Input`
Expected: FAIL — `Cannot find module './Input'`.

- [ ] **Step 3: Implement `Input`**

```tsx
// design-system/src/components/Input/Input.tsx
import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> {
  label: string;
}

/** Labeled text field — login and "nova indicação" forms. */
export function Input({ label, ...rest }: InputProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-wide font-semibold text-brand-bronze">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className="w-full h-11 min-h-[44px] mt-1 px-3 rounded-lg outline-none border border-border bg-surface"
      />
    </div>
  );
}
```

```ts
// design-system/src/components/Input/index.ts
export { Input } from './Input';
export type { InputProps } from './Input';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- Input`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/Input/Input.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = { title: 'Components/Input', component: Input };
export default meta;
type Story = StoryObj<typeof Input>;

/** Campo "Destinatário" do formulário de nova indicação. */
export const Default: Story = {
  args: { label: 'Destinatário', placeholder: 'Irmão ou empresa' },
};
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/Input
git commit -m "feat(design-system): add Input component"
```

---

### Task 11: `Select`

**Files:**
- Create: `design-system/src/components/Select/Select.tsx`
- Create: `design-system/src/components/Select/Select.stories.tsx`
- Create: `design-system/src/components/Select/Select.test.tsx`
- Create: `design-system/src/components/Select/index.ts`

**Interfaces:**
- Consumes: nothing beyond React itself (uses the built-in `useId` hook).
- Produces: `Select(props: SelectProps): JSX.Element`, `SelectOption`, `SelectProps` — consumed by Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/Select/Select.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const OPTIONS = [
  { label: 'Gestor', value: 'gestor' },
  { label: 'Administrativo', value: 'administrativo' },
];

describe('Select', () => {
  it('renders every option', () => {
    render(<Select label="Entrar como" value="gestor" onChange={() => {}} options={OPTIONS} />);
    expect(screen.getByRole('option', { name: 'Gestor' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Administrativo' })).toBeInTheDocument();
  });

  it('calls onChange when a new option is picked', async () => {
    const onChange = vi.fn();
    render(<Select label="Entrar como" value="gestor" onChange={onChange} options={OPTIONS} />);
    await userEvent.selectOptions(screen.getByLabelText('Entrar como'), 'administrativo');
    expect(onChange).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Select`
Expected: FAIL — `Cannot find module './Select'`.

- [ ] **Step 3: Implement `Select`**

```tsx
// design-system/src/components/Select/Select.tsx
import type { SelectHTMLAttributes } from 'react';
import { useId } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'id'> {
  label: string;
  options: SelectOption[];
}

/** Labeled dropdown — e.g. the login screen's profile selector. */
export function Select({ label, options, ...rest }: SelectProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-wide font-semibold text-brand-bronze">
        {label}
      </label>
      <select
        id={id}
        {...rest}
        className="w-full h-11 min-h-[44px] mt-1 px-3 rounded-lg outline-none border border-border bg-surface"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

```ts
// design-system/src/components/Select/index.ts
export { Select } from './Select';
export type { SelectOption, SelectProps } from './Select';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- Select`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/Select/Select.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = { title: 'Components/Select', component: Select };
export default meta;
type Story = StoryObj<typeof Select>;

/** Seletor de perfil da tela de login. */
export const ProfilePicker: Story = {
  args: {
    label: 'Entrar como',
    value: 'gestor',
    options: [
      { label: 'Gestor', value: 'gestor' },
      { label: 'Administrativo', value: 'administrativo' },
      { label: 'Empresário', value: 'empresario' },
    ],
  },
};
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/Select
git commit -m "feat(design-system): add Select component"
```

---

### Task 12: `FilterTabs`

**Files:**
- Create: `design-system/src/components/FilterTabs/FilterTabs.tsx`
- Create: `design-system/src/components/FilterTabs/FilterTabs.stories.tsx`
- Create: `design-system/src/components/FilterTabs/FilterTabs.test.tsx`
- Create: `design-system/src/components/FilterTabs/index.ts`

**Interfaces:**
- Consumes: `cx` from `../../utils/cx` (Task 2).
- Produces: `FilterTabs(props: FilterTabsProps): JSX.Element`, `FilterTabsOption`, `FilterTabsProps` — consumed by Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/FilterTabs/FilterTabs.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterTabs } from './FilterTabs';

const OPTIONS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Pendentes', value: 'pendentes' },
];

describe('FilterTabs', () => {
  it('marks the active option as selected', () => {
    render(<FilterTabs options={OPTIONS} value="todos" onChange={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Todos' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Pendentes' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange with the clicked option value', async () => {
    const onChange = vi.fn();
    render(<FilterTabs options={OPTIONS} value="todos" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Pendentes' }));
    expect(onChange).toHaveBeenCalledWith('pendentes');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- FilterTabs`
Expected: FAIL — `Cannot find module './FilterTabs'`.

- [ ] **Step 3: Implement `FilterTabs`**

```tsx
// design-system/src/components/FilterTabs/FilterTabs.tsx
import { cx } from '../../utils/cx';

export interface FilterTabsOption {
  label: string;
  value: string;
}

export interface FilterTabsProps {
  options: FilterTabsOption[];
  value: string;
  onChange: (value: string) => void;
}

/** Pill toggle group — e.g. "todos/pendentes" filter, or status categories. */
export function FilterTabs({ options, value, onChange }: FilterTabsProps) {
  return (
    <div role="tablist" className="flex gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cx(
              'px-4 h-11 min-h-[44px] rounded-lg text-sm font-semibold',
              active ? 'bg-brand-brown text-white' : 'border-[1.5px] border-brand-gold text-brand-brown'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
```

```ts
// design-system/src/components/FilterTabs/index.ts
export { FilterTabs } from './FilterTabs';
export type { FilterTabsOption, FilterTabsProps } from './FilterTabs';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- FilterTabs`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/FilterTabs/FilterTabs.stories.tsx
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterTabs } from './FilterTabs';

const meta: Meta<typeof FilterTabs> = { title: 'Components/FilterTabs', component: FilterTabs };
export default meta;
type Story = StoryObj<typeof FilterTabs>;

/** Filtro "todos/pendentes" da tela de Membros. */
export const MembersFilter: Story = {
  render: () => {
    const [value, setValue] = useState('todos');
    return (
      <FilterTabs
        options={[
          { label: 'Todos', value: 'todos' },
          { label: 'Pendentes', value: 'pendentes' },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/FilterTabs
git commit -m "feat(design-system): add FilterTabs component"
```

---

### Task 13: `List` and `ListRow`

**Files:**
- Create: `design-system/src/components/List/ListRow.tsx`
- Create: `design-system/src/components/List/ListRow.test.tsx`
- Create: `design-system/src/components/List/List.tsx`
- Create: `design-system/src/components/List/List.test.tsx`
- Create: `design-system/src/components/List/List.stories.tsx`
- Create: `design-system/src/components/List/index.ts`

**Interfaces:**
- Consumes: `cx` from `../../utils/cx` (Task 2); `Avatar` from `../Avatar/Avatar` (Task 9) and `Badge` from `../Badge/Badge` (Task 5) — story only.
- Produces: `ListRow(props: ListRowProps): JSX.Element`, `ListRowProps`, `List(props: ListProps): JSX.Element`, `ListProps` — consumed by Task 18's barrel export.

- [ ] **Step 1: Write the failing `ListRow` test**

```tsx
// design-system/src/components/List/ListRow.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ListRow } from './ListRow';

describe('ListRow', () => {
  it('renders title, subtitle, leading and trailing content', () => {
    render(
      <ListRow
        leading={<span>AV</span>}
        title="Leonardo A."
        subtitle="Cadeira: Consultoria"
        trailing={<span>Ativo</span>}
      />
    );
    expect(screen.getByText('Leonardo A.')).toBeInTheDocument();
    expect(screen.getByText('Cadeira: Consultoria')).toBeInTheDocument();
    expect(screen.getByText('AV')).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- ListRow`
Expected: FAIL — `Cannot find module './ListRow'`.

- [ ] **Step 3: Implement `ListRow`**

```tsx
// design-system/src/components/List/ListRow.tsx
import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface ListRowProps {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  /** Applied by `List` for zebra striping; not meant to be set directly. */
  className?: string;
}

/** One zebra-striped row inside a `List`. Striping is applied by `List`. */
export function ListRow({ leading, title, subtitle, trailing, className }: ListRowProps) {
  return (
    <div className={cx('flex items-center justify-between px-5 py-3.5 min-h-[44px]', className)}>
      <div className="flex items-center gap-3">
        {leading}
        <div>
          <p className="font-semibold">{title}</p>
          {subtitle && <p className="text-xs text-brand-bronze">{subtitle}</p>}
        </div>
      </div>
      {trailing && <div className="flex items-center gap-3">{trailing}</div>}
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- ListRow`
Expected: PASS (1 test).

- [ ] **Step 5: Write the failing `List` test**

```tsx
// design-system/src/components/List/List.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { List } from './List';
import { ListRow } from './ListRow';

describe('List', () => {
  it('renders the header banner when provided', () => {
    render(
      <List header="Extrato do caixa">
        <ListRow title="Mensalidade" />
      </List>
    );
    expect(screen.getByText('Extrato do caixa')).toBeInTheDocument();
  });

  it('renders every row', () => {
    render(
      <List>
        <ListRow title="Leonardo A." />
        <ListRow title="Luetil S." />
      </List>
    );
    expect(screen.getByText('Leonardo A.')).toBeInTheDocument();
    expect(screen.getByText('Luetil S.')).toBeInTheDocument();
  });

  it('applies the zebra background class to odd rows only', () => {
    render(
      <List>
        <ListRow title="Row 0" />
        <ListRow title="Row 1" />
      </List>
    );
    expect(screen.getByText('Row 0').closest('div.flex')).not.toHaveClass('bg-brand-cream');
    expect(screen.getByText('Row 1').closest('div.flex')).toHaveClass('bg-brand-cream');
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- List.test`
Expected: FAIL — `Cannot find module './List'`.

- [ ] **Step 7: Implement `List`**

```tsx
// design-system/src/components/List/List.tsx
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { ListRowProps } from './ListRow';

export interface ListProps {
  /** Optional title banner rendered above the rows, e.g. "Extrato do caixa". */
  header?: string;
  children: ReactNode;
}

/** Card-like container that zebra-stripes its `ListRow` children automatically. */
export function List({ header, children }: ListProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<ListRowProps>[];
  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow">
      {header && <div className="px-5 py-3 font-semibold text-white bg-brand-brown">{header}</div>}
      {rows.map((row, index) =>
        cloneElement(row, {
          key: row.key ?? index,
          className: cx(row.props.className, index % 2 === 1 && 'bg-brand-cream'),
        })
      )}
    </div>
  );
}
```

```ts
// design-system/src/components/List/index.ts
export { List } from './List';
export type { ListProps } from './List';
export { ListRow } from './ListRow';
export type { ListRowProps } from './ListRow';
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test -- List`
Expected: PASS (4 tests total — `List.test.tsx` and `ListRow.test.tsx`).

- [ ] **Step 9: Write the story**

```tsx
// design-system/src/components/List/List.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { List } from './List';
import { ListRow } from './ListRow';
import { Avatar } from '../Avatar/Avatar';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof List> = { title: 'Components/List', component: List };
export default meta;
type Story = StoryObj<typeof List>;

/** Lista de Membros do protótipo. */
export const Members: Story = {
  render: () => (
    <List>
      <ListRow
        leading={<Avatar name="Leonardo A." />}
        title="Leonardo A."
        subtitle="Cadeira: Consultoria Empresarial · Plano Anual"
        trailing={<Badge variant="success">Ativo</Badge>}
      />
      <ListRow
        leading={<Avatar name="Jackson P." tone="pending" />}
        title="Jackson P."
        subtitle="Cadeira: Seguros · Plano Mensal"
        trailing={<Badge variant="neutral">Pendente</Badge>}
      />
    </List>
  ),
};

/** Extrato do caixa em Financeiro, com faixa de título. */
export const WithHeader: Story = {
  render: () => (
    <List header="Extrato do caixa">
      <ListRow title="Mensalidades competência 07/2026" subtitle="Mensalidade" trailing={<span>+ R$ 650</span>} />
      <ListRow title="Coffee break — Coworking de junho" subtitle="Coffee break" trailing={<span>− R$ 380</span>} />
    </List>
  ),
};
```

- [ ] **Step 10: Commit**

```bash
git add design-system/src/components/List
git commit -m "feat(design-system): add List and ListRow components"
```

---

### Task 14: `ProgressBar`

**Files:**
- Create: `design-system/src/components/ProgressBar/ProgressBar.tsx`
- Create: `design-system/src/components/ProgressBar/ProgressBar.stories.tsx`
- Create: `design-system/src/components/ProgressBar/ProgressBar.test.tsx`
- Create: `design-system/src/components/ProgressBar/index.ts`

**Interfaces:**
- Consumes: nothing beyond React itself.
- Produces: `ProgressBar(props: ProgressBarProps): JSX.Element`, `ProgressBarTone = 'accent' | 'success'`, `ProgressBarProps` — consumed by Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/ProgressBar/ProgressBar.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders label and value', () => {
    render(<ProgressBar label="Negócios fechados" value={9} percent={0.36} />);
    expect(screen.getByText('Negócios fechados')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('exposes the percentage to assistive tech', () => {
    render(<ProgressBar label="Negócios fechados" value={9} percent={0.36} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '36');
  });

  it('clamps out-of-range percentages', () => {
    render(<ProgressBar label="x" value={1} percent={1.5} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- ProgressBar`
Expected: FAIL — `Cannot find module './ProgressBar'`.

- [ ] **Step 3: Implement `ProgressBar`**

```tsx
// design-system/src/components/ProgressBar/ProgressBar.tsx
export type ProgressBarTone = 'accent' | 'success';

export interface ProgressBarProps {
  label: string;
  value: number;
  /** 0 to 1. */
  percent: number;
  tone?: ProgressBarTone;
}

const TONE_CLASSES: Record<ProgressBarTone, string> = {
  accent: 'bg-brand-gold',
  success: 'bg-status-success-fg',
};

/** Labeled funnel bar — "Funil do semestre" in Relatórios. */
export function ProgressBar({ label, value, percent, tone = 'accent' }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, percent));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <b className="font-heading">{value}</b>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-3 rounded-full bg-brand-cream"
      >
        <div className={`h-3 rounded-full ${TONE_CLASSES[tone]}`} style={{ width: `${clamped * 100}%` }} />
      </div>
    </div>
  );
}
```

```ts
// design-system/src/components/ProgressBar/index.ts
export { ProgressBar } from './ProgressBar';
export type { ProgressBarProps, ProgressBarTone } from './ProgressBar';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- ProgressBar`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/ProgressBar/ProgressBar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = { title: 'Components/ProgressBar', component: ProgressBar };
export default meta;
type Story = StoryObj<typeof ProgressBar>;

/** Uma etapa do funil do semestre em Relatórios. */
export const FunnelStep: Story = {
  args: { label: 'Em contato ou andamento', value: 14, percent: 0.56, tone: 'accent' },
};
export const Success: Story = {
  args: { label: 'Negócios fechados', value: 9, percent: 0.36, tone: 'success' },
};
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/ProgressBar
git commit -m "feat(design-system): add ProgressBar component"
```

---

### Task 15: `EmptyState`

**Files:**
- Create: `design-system/src/components/EmptyState/EmptyState.tsx`
- Create: `design-system/src/components/EmptyState/EmptyState.stories.tsx`
- Create: `design-system/src/components/EmptyState/EmptyState.test.tsx`
- Create: `design-system/src/components/EmptyState/index.ts`

**Interfaces:**
- Consumes: nothing beyond React itself.
- Produces: `EmptyState(props: EmptyStateProps): JSX.Element`, `EmptyStateProps` — consumed by Task 18's barrel export.

- [ ] **Step 1: Write the failing test**

```tsx
// design-system/src/components/EmptyState/EmptyState.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the message', () => {
    render(<EmptyState message="Nada por aqui. A próxima Rodada de Negócios muda isso." />);
    expect(screen.getByText('Nada por aqui. A próxima Rodada de Negócios muda isso.')).toBeInTheDocument();
  });

  it('renders the hint when provided', () => {
    render(<EmptyState message="Nada por aqui." hint="Registre uma indicação para começar." />);
    expect(screen.getByText('Registre uma indicação para começar.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- EmptyState`
Expected: FAIL — `Cannot find module './EmptyState'`.

- [ ] **Step 3: Implement `EmptyState`**

```tsx
// design-system/src/components/EmptyState/EmptyState.tsx
export interface EmptyStateProps {
  message: string;
  hint?: string;
}

/** "Nada por aqui..." placeholder for empty lists/columns. */
export function EmptyState({ message, hint }: EmptyStateProps) {
  return (
    <div className="text-center py-4">
      <p className="text-xs italic text-brand-bronze">{message}</p>
      {hint && <p className="text-xs text-brand-bronze mt-1">{hint}</p>}
    </div>
  );
}
```

```ts
// design-system/src/components/EmptyState/index.ts
export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- EmptyState`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the story**

```tsx
// design-system/src/components/EmptyState/EmptyState.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = { title: 'Components/EmptyState', component: EmptyState };
export default meta;
type Story = StoryObj<typeof EmptyState>;

/** Coluna vazia do quadro de Indicações. */
export const Default: Story = {
  args: { message: 'Nada por aqui. A próxima Rodada de Negócios muda isso.' },
};
```

- [ ] **Step 6: Commit**

```bash
git add design-system/src/components/EmptyState
git commit -m "feat(design-system): add EmptyState component"
```

---

### Task 16: `BottomNav` and `NavTab`

**Files:**
- Create: `design-system/src/components/BottomNav/NavTab.tsx`
- Create: `design-system/src/components/BottomNav/NavTab.test.tsx`
- Create: `design-system/src/components/BottomNav/BottomNav.tsx`
- Create: `design-system/src/components/BottomNav/BottomNav.test.tsx`
- Create: `design-system/src/components/BottomNav/BottomNav.stories.tsx`
- Create: `design-system/src/components/BottomNav/index.ts`

**Interfaces:**
- Consumes: nothing beyond React itself.
- Produces: `NavTab(props: NavTabProps): JSX.Element`, `NavTabProps`, `BottomNav(props: BottomNavProps): JSX.Element`, `BottomNavProps` — consumed by Task 18's barrel export. This replaces the prototype's sidebar (spec §8) as the primary navigation component.

- [ ] **Step 1: Write the failing `NavTab` test**

```tsx
// design-system/src/components/BottomNav/NavTab.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavTab } from './NavTab';

describe('NavTab', () => {
  it('marks the active tab with aria-current', () => {
    render(<NavTab label="Painel" active onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Painel' })).toHaveAttribute('aria-current', 'page');
  });

  it('omits aria-current when inactive', () => {
    render(<NavTab label="Painel" active={false} onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Painel' })).not.toHaveAttribute('aria-current');
  });

  it('calls onClick when tapped', async () => {
    const onClick = vi.fn();
    render(<NavTab label="Painel" active={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Painel' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- NavTab`
Expected: FAIL — `Cannot find module './NavTab'`.

- [ ] **Step 3: Implement `NavTab`**

```tsx
// design-system/src/components/BottomNav/NavTab.tsx
import type { ReactNode } from 'react';

export interface NavTabProps {
  label: string;
  icon?: ReactNode;
  active: boolean;
  onClick: () => void;
}

/** One tab inside `BottomNav`. Active tab is highlighted in brand gold. */
export function NavTab({ label, icon, active, onClick }: NavTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 h-full min-h-[44px] text-xs font-semibold ${
        active ? 'text-brand-gold' : 'text-brand-cream'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- NavTab`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the failing `BottomNav` test**

```tsx
// design-system/src/components/BottomNav/BottomNav.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottomNav } from './BottomNav';
import { NavTab } from './NavTab';

describe('BottomNav', () => {
  it('renders as a navigation landmark containing its tabs', () => {
    render(
      <BottomNav>
        <NavTab label="Painel" active onClick={() => {}} />
        <NavTab label="Membros" active={false} onClick={() => {}} />
      </BottomNav>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Painel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Membros' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- BottomNav.test`
Expected: FAIL — `Cannot find module './BottomNav'`.

- [ ] **Step 7: Implement `BottomNav`**

```tsx
// design-system/src/components/BottomNav/BottomNav.tsx
import type { ReactNode } from 'react';

export interface BottomNavProps {
  children: ReactNode;
}

/** Fixed bottom tab bar — the mobile-first replacement for the prototype's sidebar. */
export function BottomNav({ children }: BottomNavProps) {
  return <nav className="flex items-stretch h-16 min-h-[44px] bg-brand-brown">{children}</nav>;
}
```

```ts
// design-system/src/components/BottomNav/index.ts
export { BottomNav } from './BottomNav';
export type { BottomNavProps } from './BottomNav';
export { NavTab } from './NavTab';
export type { NavTabProps } from './NavTab';
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test -- BottomNav`
Expected: PASS (4 tests total — `BottomNav.test.tsx` and `NavTab.test.tsx`).

- [ ] **Step 9: Write the story**

```tsx
// design-system/src/components/BottomNav/BottomNav.stories.tsx
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BottomNav } from './BottomNav';
import { NavTab } from './NavTab';

const meta: Meta<typeof BottomNav> = { title: 'Components/BottomNav', component: BottomNav };
export default meta;
type Story = StoryObj<typeof BottomNav>;

const TABS = ['Painel', 'Membros', 'Indicações', 'Relatórios'];

/** Substitui a sidebar do protótipo pela navegação primária mobile. */
export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('Painel');
    return (
      <BottomNav>
        {TABS.map((label) => (
          <NavTab key={label} label={label} active={active === label} onClick={() => setActive(label)} />
        ))}
      </BottomNav>
    );
  },
};
```

- [ ] **Step 10: Commit**

```bash
git add design-system/src/components/BottomNav
git commit -m "feat(design-system): add BottomNav and NavTab components"
```

---

### Task 17: `TrendLineChart` and `CategoryBarChart`

**Files:**
- Create: `design-system/src/components/TrendLineChart/TrendLineChart.tsx`
- Create: `design-system/src/components/TrendLineChart/TrendLineChart.stories.tsx`
- Create: `design-system/src/components/TrendLineChart/TrendLineChart.test.tsx`
- Create: `design-system/src/components/TrendLineChart/index.ts`
- Create: `design-system/src/components/CategoryBarChart/CategoryBarChart.tsx`
- Create: `design-system/src/components/CategoryBarChart/CategoryBarChart.stories.tsx`
- Create: `design-system/src/components/CategoryBarChart/CategoryBarChart.test.tsx`
- Create: `design-system/src/components/CategoryBarChart/index.ts`

**Interfaces:**
- Consumes: `recharts` (Task 1 dependency); the `ResizeObserver` mock from `vitest.setup.ts` (Task 1).
- Produces: `TrendLineChart(props: TrendLineChartProps): JSX.Element`, `TrendLineChartDatum`, `TrendLineChartProps`, `CategoryBarChart(props: CategoryBarChartProps): JSX.Element`, `CategoryBarChartDatum`, `CategoryBarChartProps` — consumed by Task 18's barrel export.

- [ ] **Step 1: Write the failing `TrendLineChart` test**

```tsx
// design-system/src/components/TrendLineChart/TrendLineChart.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TrendLineChart } from './TrendLineChart';

const DATA = [
  { label: 'Fev', value: 38 },
  { label: 'Mar', value: 55 },
];

beforeEach(() => {
  // recharts' ResponsiveContainer only renders its SVG once it measures a non-zero size.
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(210);
});

describe('TrendLineChart', () => {
  it('renders an SVG line chart for the given data', () => {
    const { container } = render(<TrendLineChart data={DATA} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(DATA.length);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- TrendLineChart`
Expected: FAIL — `Cannot find module './TrendLineChart'`.

- [ ] **Step 3: Implement `TrendLineChart`**

```tsx
// design-system/src/components/TrendLineChart/TrendLineChart.tsx
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface TrendLineChartDatum {
  label: string;
  value: number;
}

export interface TrendLineChartProps {
  data: TrendLineChartDatum[];
  /** Formats the tooltip value, e.g. `(v) => `R$ ${v} mil``. */
  valueFormatter?: (value: number) => string;
}

/** Themed line chart — "Valor gerado pelo grupo" trend in the Painel screen. */
export function TrendLineChart({ data, valueFormatter }: TrendLineChartProps) {
  return (
    <div style={{ height: 210 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#EFE8DA" vertical={false} />
          <XAxis dataKey="label" stroke="#9C8C6E" fontSize={12} tickLine={false} />
          <YAxis stroke="#9C8C6E" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip formatter={valueFormatter ? (value: number) => valueFormatter(value) : undefined} />
          <Line type="monotone" dataKey="value" stroke="#855023" strokeWidth={3} dot={{ fill: '#CAAA67', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

```ts
// design-system/src/components/TrendLineChart/index.ts
export { TrendLineChart } from './TrendLineChart';
export type { TrendLineChartDatum, TrendLineChartProps } from './TrendLineChart';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- TrendLineChart`
Expected: PASS (1 test).

- [ ] **Step 5: Write the `TrendLineChart` story**

```tsx
// design-system/src/components/TrendLineChart/TrendLineChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TrendLineChart } from './TrendLineChart';

const meta: Meta<typeof TrendLineChart> = { title: 'Components/TrendLineChart', component: TrendLineChart };
export default meta;
type Story = StoryObj<typeof TrendLineChart>;

/** "Valor gerado pelo grupo (R$ mil)" no Painel. */
export const GroupValueTrend: Story = {
  args: {
    data: [
      { label: 'Fev', value: 38 },
      { label: 'Mar', value: 55 },
      { label: 'Abr', value: 47 },
      { label: 'Mai', value: 92 },
      { label: 'Jun', value: 118 },
      { label: 'Jul', value: 127 },
    ],
    valueFormatter: (v) => `R$ ${v} mil`,
  },
};
```

- [ ] **Step 6: Write the failing `CategoryBarChart` test**

```tsx
// design-system/src/components/CategoryBarChart/CategoryBarChart.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { CategoryBarChart } from './CategoryBarChart';

const DATA = [
  { label: 'Davi', value: 7 },
  { label: 'Luetil', value: 6 },
];

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(230);
});

describe('CategoryBarChart', () => {
  it('renders an SVG bar chart with one bar per datum', () => {
    const { container } = render(<CategoryBarChart data={DATA} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(DATA.length);
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npm test -- CategoryBarChart`
Expected: FAIL — `Cannot find module './CategoryBarChart'`.

- [ ] **Step 8: Implement `CategoryBarChart`**

```tsx
// design-system/src/components/CategoryBarChart/CategoryBarChart.tsx
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface CategoryBarChartDatum {
  label: string;
  value: number;
}

export interface CategoryBarChartProps {
  data: CategoryBarChartDatum[];
  valueFormatter?: (value: number) => string;
}

/** Themed bar chart — "Indicações por membro" in Relatórios. */
export function CategoryBarChart({ data, valueFormatter }: CategoryBarChartProps) {
  return (
    <div style={{ height: 230 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
          <CartesianGrid stroke="#EFE8DA" vertical={false} />
          <XAxis dataKey="label" stroke="#9C8C6E" fontSize={12} tickLine={false} />
          <YAxis stroke="#9C8C6E" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip formatter={valueFormatter ? (value: number) => valueFormatter(value) : undefined} />
          <Bar dataKey="value" fill="#855023" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

```ts
// design-system/src/components/CategoryBarChart/index.ts
export { CategoryBarChart } from './CategoryBarChart';
export type { CategoryBarChartDatum, CategoryBarChartProps } from './CategoryBarChart';
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `npm test -- CategoryBarChart`
Expected: PASS (1 test).

- [ ] **Step 10: Write the `CategoryBarChart` story**

```tsx
// design-system/src/components/CategoryBarChart/CategoryBarChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CategoryBarChart } from './CategoryBarChart';

const meta: Meta<typeof CategoryBarChart> = { title: 'Components/CategoryBarChart', component: CategoryBarChart };
export default meta;
type Story = StoryObj<typeof CategoryBarChart>;

/** "Indicações por membro (semestre)" em Relatórios. */
export const ReferralsByMember: Story = {
  args: {
    data: [
      { label: 'Davi', value: 7 },
      { label: 'Luetil', value: 6 },
      { label: 'Eduardo', value: 5 },
    ],
  },
};
```

- [ ] **Step 11: Commit**

```bash
git add design-system/src/components/TrendLineChart design-system/src/components/CategoryBarChart
git commit -m "feat(design-system): add TrendLineChart and CategoryBarChart components"
```

---

### Task 18: Public barrel export

**Files:**
- Modify: `design-system/src/index.ts`
- Modify: `design-system/src/index.test.ts`

**Interfaces:**
- Consumes: every component and token export from Tasks 2–17 (`brandColors`, `deckColors`, `semanticColors`, `statusColors`, `fontFamilies`, `space`, `radius`, `shadow`, `Button`, `Badge`, `Card`, `SectionTitle`, `Stat`, `Avatar`, `Input`, `Select`, `FilterTabs`, `List`, `ListRow`, `ProgressBar`, `EmptyState`, `BottomNav`, `NavTab`, `TrendLineChart`, `CategoryBarChart`).
- Produces: the package's complete public API surface (`import { X } from 'mason-connect-design-system'`), consumed downstream by whatever runs `/design-sync` later.

- [ ] **Step 1: Write the failing test**

```ts
// design-system/src/index.test.ts
import { describe, it, expect } from 'vitest';
import * as DesignSystem from './index';

describe('public API', () => {
  it('exports every v1 component', () => {
    const expectedExports = [
      'Button', 'Badge', 'Card', 'SectionTitle', 'Stat', 'Avatar',
      'Input', 'Select', 'FilterTabs', 'List', 'ListRow', 'ProgressBar',
      'EmptyState', 'BottomNav', 'NavTab', 'TrendLineChart', 'CategoryBarChart',
    ];
    for (const name of expectedExports) {
      expect(DesignSystem).toHaveProperty(name);
    }
  });

  it('exports the brand color tokens', () => {
    expect(DesignSystem.brandColors.brown).toBe('#855023');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- index.test`
Expected: FAIL — `DesignSystem` only has `VERSION`, none of the expected component names are present.

- [ ] **Step 3: Rewrite `src/index.ts` as the full barrel export**

```ts
// design-system/src/index.ts
export * from './tokens';

export * from './components/Button';
export * from './components/Badge';
export * from './components/Card';
export * from './components/SectionTitle';
export * from './components/Stat';
export * from './components/Avatar';
export * from './components/Input';
export * from './components/Select';
export * from './components/FilterTabs';
export * from './components/List';
export * from './components/ProgressBar';
export * from './components/EmptyState';
export * from './components/BottomNav';
export * from './components/TrendLineChart';
export * from './components/CategoryBarChart';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- index.test`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full test suite and the full build**

Run: `npm test && npm run build`
Expected: every test file passes; `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, and `dist/styles.css` are all created; `dist/index.d.ts` includes type declarations for every component listed in Step 1.

- [ ] **Step 6: Commit**

```bash
git add design-system/src/index.ts design-system/src/index.test.ts
git commit -m "feat(design-system): export the full public API from the package entry point"
```

---

### Task 19: README and final verification

**Files:**
- Create: `design-system/README.md`

**Interfaces:**
- Consumes: nothing new — this task only documents and verifies what Tasks 1–18 produced.
- Produces: nothing new for other tasks to consume; this is the plan's terminal task.

- [ ] **Step 1: Write the README**

```md
# Mason Connect Design System

Biblioteca de componentes React/TypeScript da identidade visual oficial do Mason Connect.
Ver `docs/superpowers/specs/2026-08-05-mason-connect-design-system-design.md` no
repositório principal para o desenho completo (escopo, decisões de tokens, e o
inventário de componentes com sua origem no protótipo).

## Desenvolvimento

\`\`\`bash
npm install
npm test              # Vitest — roda toda a suíte
npm run storybook     # Storybook em http://localhost:6006
npm run build          # dist/ (ESM + CJS + .d.ts) e dist/styles.css
npm run build-storybook
\`\`\`

## Uso

\`\`\`tsx
import { Button, Card } from 'mason-connect-design-system';
import 'mason-connect-design-system/dist/styles.css';
\`\`\`

Apps que usam Tailwind podem estender o mesmo preset de tema:

\`\`\`js
// tailwind.config.js
module.exports = {
  presets: [require('mason-connect-design-system/tailwind-preset')],
};
\`\`\`

## Status

v1 — fiel ao protótipo de alta fidelidade (`MC_BlocoC_08_Prototipo_Navegavel.jsx`),
com navegação e layout reprojetados para mobile-first. Fora de escopo: modais,
toasts, tabs genéricas, paginação, tema "deck" (ver spec §10).
```

- [ ] **Step 2: Run the complete verification pass**

Run: `npm test && npm run build && npm run build-storybook`
Expected: all three commands exit 0 — full test suite passes, `dist/` contains the complete package build, `storybook-static/` contains the built Storybook with all 17 components' stories.

- [ ] **Step 3: Commit**

```bash
git add design-system/README.md
git commit -m "docs(design-system): add README"
```

---

## After this plan

Once all 19 tasks are done and verified, the next step (not part of this plan, per the user's explicit sequencing) is running the `/design-sync` skill pointed at `design-system/` to sync the real components into a claude.ai/design project — see spec §1 and §11.

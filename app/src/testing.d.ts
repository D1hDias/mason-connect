// Ambient types for `@testing-library/jest-dom`'s vitest matchers
// (toHaveAttribute, toBeInTheDocument, ...), loaded at runtime via the
// `import '@testing-library/jest-dom/vitest'` in `vitest.setup.ts`. That
// file only belongs to the `tsconfig.node.json` project (like
// `vite.config.ts`), so its module augmentation isn't visible to `*.test.tsx`
// files under `src`, which compile under the separate `tsconfig.json`
// project — this reference makes the matcher types visible there too.
/// <reference types="@testing-library/jest-dom/vitest" />

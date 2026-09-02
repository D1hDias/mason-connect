import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth React client, wired to the Better Auth server built in Task 9
 * (`server/`, `VITE_AUTH_URL` — `http://localhost:8787` locally, see
 * `app/.env`/`app/.env.example`). Used only by the 3 real auth screens
 * (`screens/Acesso/`), which sit outside `AppShell` — the rest of the app
 * still has no session gate (achado #20 do plano, fora de escopo aqui).
 *
 * Fails fast if `VITE_AUTH_URL` is missing: without this check, a fresh
 * clone with no `app/.env` would silently pass `undefined` as `baseURL`,
 * and every auth request would hit the Vite dev server itself instead of
 * the real backend — a confusing failure far from its cause.
 */
const baseURL = import.meta.env.VITE_AUTH_URL;
if (!baseURL) {
  throw new Error(
    'VITE_AUTH_URL não está definida. Copie app/.env.example para app/.env e preencha os valores (veja server/README.md para subir o backend).',
  );
}

export const authClient = createAuthClient({ baseURL });

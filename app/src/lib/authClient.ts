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
const configuredBaseURL = import.meta.env.VITE_AUTH_URL;

/**
 * Só derruba o boot em DEV. Este módulo é importado *estaticamente* pela
 * cadeia `routes.tsx → screens/Acesso → LoginScreen → authClient`, então um
 * `throw` no topo aqui não quebra só `/login`: quebra as 8 telas, com tela
 * branca antes do primeiro paint. Como `app/.env` é gitignored, qualquer
 * build de CI/deploy sem a env var configurada compilava sem erro e
 * entregava um bundle morto — inaceitável para um deploy estático (demo),
 * onde as telas de gestão nem dependem de backend.
 *
 * Em DEV o fail-fast continua valendo (um clone novo sem `.env` precisa de
 * um erro alto e imediato). Em produção, cai para a própria origem: as 3
 * telas de auth passam a falhar de forma tratada (mensagem legível na
 * própria tela, ver `LoginScreen`) em vez de derrubar a aplicação inteira.
 */
if (!configuredBaseURL && import.meta.env.DEV) {
  throw new Error(
    'VITE_AUTH_URL não está definida. Copie app/.env.example para app/.env e preencha os valores (veja server/README.md para subir o backend).',
  );
}

const baseURL = configuredBaseURL || window.location.origin;

export const authClient = createAuthClient({ baseURL });

import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth React client, wired to the Better Auth server built in Task 9
 * (`server/`, `VITE_AUTH_URL` — `http://localhost:8787` locally, see
 * `app/.env`/`app/.env.example`). Used only by the 3 real auth screens
 * (`screens/Acesso/`), which sit outside `AppShell` — the rest of the app
 * still has no session gate (achado #20 do plano, fora de escopo aqui).
 */
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL,
});

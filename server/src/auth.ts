import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";
import { sendEmail } from "./email.js";

const corsOrigin = process.env.CORS_ORIGIN;

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  // Explicit, not left to Better Auth's `NODE_ENV === 'production'`
  // defaults: without `NODE_ENV=production` set (the natural
  // `node dist/index.js` entrypoint doesn't set it — use `npm run start`,
  // which does), the lib falls back to a known-public secret and disables
  // sign-in rate limiting. Both are set explicitly here so they never
  // depend on that ambiguous fallback.
  secret: process.env.BETTER_AUTH_SECRET,
  rateLimit: { enabled: true },
  emailAndPassword: {
    enabled: true,
    // No public sign-up flow: accounts are provisioned by an admin
    // (seed script for dev/test). See task brief finding #19.
    disableSignUp: true,
    sendResetPassword: async ({ user, url }) => {
      // Fire-and-forget on purpose (no `await`): this is Better Auth's
      // documented mitigation against timing attacks that could let an
      // attacker infer whether an email address exists in the system by
      // measuring response time.
      // Result deliberately not awaited (see comment above), but it IS
      // observed: the Resend SDK returns `{ data, error }` in-band on API
      // failures (invalid key, unverified domain, etc.) rather than
      // rejecting the promise, so without this `.then()` those failures
      // would be totally silent.
      void sendEmail({
        to: user.email,
        subject: "Redefinir senha — Mason Connect",
        html: `<p>Clique no link abaixo para redefinir sua senha no Mason Connect:</p><p><a href="${url}">${url}</a></p><p>Se você não solicitou isso, ignore este e-mail.</p>`,
      }).then(
        ({ error }) => {
          if (error) console.error("[auth] falha ao enviar e-mail de redefinição de senha:", error);
        },
        (err) => console.error("[auth] envio de e-mail de redefinição de senha lançou exceção:", err),
      );
    },
  },
  trustedOrigins: corsOrigin ? [corsOrigin] : [],
});

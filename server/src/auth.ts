import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";
import { sendEmail } from "./email.js";

const corsOrigin = process.env.CORS_ORIGIN;

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
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
      void sendEmail({
        to: user.email,
        subject: "Redefinir senha — Mason Connect",
        html: `<p>Clique no link abaixo para redefinir sua senha no Mason Connect:</p><p><a href="${url}">${url}</a></p><p>Se você não solicitou isso, ignore este e-mail.</p>`,
      });
    },
  },
  trustedOrigins: corsOrigin ? [corsOrigin] : [],
});

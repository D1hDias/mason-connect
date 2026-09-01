import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./index.js";
import * as schema from "./schema.js";

// Dev/test-only seed: creates a single test user through Better Auth's real
// sign-up API so the password goes through the library's actual hashing
// logic (never a raw SQL INSERT).
//
// The app's own `auth` instance (src/auth.ts) has `disableSignUp: true` —
// there is no public sign-up flow (see task brief finding #19), and that
// flag blocks `signUpEmail` for ANY caller, including a direct
// `auth.api.signUpEmail(...)` call from this process. So this script builds
// a separate, seed-only Better Auth instance against the same
// database/adapter with sign-up temporarily allowed, purely to run the real
// sign-up code path once. It is never used to serve requests.
//
// These are fixed, obviously-fake credentials for local development only —
// never real credentials.
const TEST_USER = {
  email: "teste@masonconnect.local",
  password: "TesteSenh@123",
  name: "Usuário de Teste",
};

const seedAuth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
  },
});

async function seed() {
  const result = await seedAuth.api.signUpEmail({
    body: {
      email: TEST_USER.email,
      password: TEST_USER.password,
      name: TEST_USER.name,
    },
  });

  console.log("Seed user created:", result.user.email);
  console.log(`Login with: ${TEST_USER.email} / ${TEST_USER.password}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});

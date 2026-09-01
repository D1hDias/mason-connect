import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // These tests hit a real local Postgres and run the real Better Auth
    // sign-up/sign-in flow (hashing, DB round-trips), so give them more
    // room than the default unit-test timeout.
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});

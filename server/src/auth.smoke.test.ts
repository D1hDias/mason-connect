import { randomUUID } from "node:crypto";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Mock the email module BEFORE importing anything that transitively imports
// it (src/auth.ts -> src/email.ts), so the `requestPasswordReset` test below
// never attempts a real Resend API call (we have no real API key in this
// environment). vitest hoists vi.mock calls above imports automatically.
const { sendEmailMock } = vi.hoisted(() => ({
  // Resolves with the same `{ data, error }` shape the real Resend SDK
  // returns (sendResetPassword in auth.ts destructures `error` off the
  // resolved value to log delivery failures — see finding #3).
  sendEmailMock: vi.fn().mockResolvedValue({ data: { id: "stub-email-id" }, error: null }),
}));
vi.mock("./email.js", () => ({
  sendEmail: sendEmailMock,
}));

// This is a real end-to-end smoke test: it starts the actual Express app
// (the same `createApp()` used by `npm run dev`) on an ephemeral port and
// talks to it over real HTTP, against the real local Postgres started via
// `docker compose up -d` (see server/README.md). Nothing here is mocked
// except the outbound Resend email call above.
import { createApp } from "./index.js";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db, pool } from "./db/index.js";
import * as schema from "./db/schema.js";
import { eq } from "drizzle-orm";

let server: Server;
let baseUrl: string;

// A unique test user per run, so repeated `npm test -w server` runs don't
// collide on the unique email constraint. Cleaned up in afterAll.
const testEmail = `smoke-test-${randomUUID()}@masonconnect.local`;
const testPassword = "SmokeTest@12345";

// The app's real `auth` instance (src/auth.ts) has `disableSignUp: true` —
// there is no public sign-up (task brief finding #19). To create the test
// user through Better Auth's real sign-up/hashing logic anyway (never a raw
// SQL INSERT), this test uses the same seed-only pattern as
// src/db/seed.ts: a separate Better Auth instance, same DB/adapter, with
// sign-up temporarily allowed.
const seedAuth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true, disableSignUp: false },
});

function extractCookieHeader(response: Response): string {
  const setCookies = response.headers.getSetCookie();
  return setCookies.map((cookie) => cookie.split(";")[0]).join("; ");
}

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = createApp().listen(0, () => resolve());
  });
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("Failed to determine test server address");
  }
  baseUrl = `http://127.0.0.1:${address.port}`;

  await seedAuth.api.signUpEmail({
    body: { email: testEmail, password: testPassword, name: "Smoke Test User" },
  });
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

  // Clean up the test user (and cascaded account/session rows) so repeated
  // local test runs don't accumulate rows.
  const [createdUser] = await db.select().from(schema.user).where(eq(schema.user.email, testEmail));
  if (createdUser) {
    await db.delete(schema.user).where(eq(schema.user.id, createdUser.id));
  }

  await pool.end();
});

describe("auth server smoke test (real Postgres, real Better Auth)", () => {
  it("signs in with the seeded user's real credentials", async () => {
    const response = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { user: { email: string } };
    expect(body.user.email).toBe(testEmail);
    expect(response.headers.getSetCookie().length).toBeGreaterThan(0);
  });

  it("rejects sign-in with the wrong password", async () => {
    const response = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: "definitely-wrong" }),
    });

    expect(response.status).toBe(401);
  });

  it("establishes a valid session after sign-in, then signs out and invalidates it", async () => {
    const signInResponse = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    expect(signInResponse.status).toBe(200);
    const cookieHeader = extractCookieHeader(signInResponse);
    expect(cookieHeader).not.toBe("");

    // Valid session while signed in.
    const sessionResponse = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: { Cookie: cookieHeader },
    });
    expect(sessionResponse.status).toBe(200);
    const sessionBody = (await sessionResponse.json()) as {
      user: { email: string } | null;
      session: { token: string } | null;
    };
    expect(sessionBody.user?.email).toBe(testEmail);
    expect(sessionBody.session).not.toBeNull();

    // Sign out.
    const signOutResponse = await fetch(`${baseUrl}/api/auth/sign-out`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
    });
    expect(signOutResponse.status).toBe(200);

    // Session must no longer be valid.
    const postSignOutSessionResponse = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: { Cookie: cookieHeader },
    });
    expect(postSignOutSessionResponse.status).toBe(200);
    // Better Auth returns a bare `null` body (not `{ session: null, ... }`)
    // when there is no valid session.
    const postSignOutBody = (await postSignOutSessionResponse.json()) as { session: unknown } | null;
    expect(postSignOutBody === null || postSignOutBody.session === null).toBe(true);
  });

  it("rejects public sign-up (no public sign-up flow — finding #19)", async () => {
    const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `should-not-be-created-${randomUUID()}@masonconnect.local`,
        password: "whatever12345",
        name: "Should Not Exist",
      }),
    });

    expect(response.status).toBe(400);
  });

  it("requests a password reset without waiting on real email delivery (sendEmail stubbed)", async () => {
    // This exercises Better Auth's requestPasswordReset flow end-to-end
    // through the real server and real DB, EXCEPT for the actual outbound
    // Resend call, which is stubbed via the vi.mock at the top of this
    // file (we have no real RESEND_API_KEY in this environment). Real
    // email delivery is manual verification, out of scope here — see
    // server/README.md.
    sendEmailMock.mockClear();

    const response = await fetch(`${baseUrl}/api/auth/request-password-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, redirectTo: "http://localhost:5173/reset-password" }),
    });

    expect(response.status).toBe(200);

    // sendResetPassword fires the email with `void` (fire-and-forget, per
    // Better Auth's timing-attack mitigation), so give the microtask queue
    // a tick before asserting it was called.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock.mock.calls[0]?.[0]).toMatchObject({ to: testEmail });
  });
});

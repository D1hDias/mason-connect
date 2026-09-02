import { Resend } from "resend";

// resend.dev is Resend's built-in test sending domain — it works without a
// verified custom domain, which is fine for local dev but must be swapped
// for a verified Mason Connect domain before this ships to production.
const FROM_ADDRESS = "Mason Connect <onboarding@resend.dev>";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  // Instantiated lazily, inside the function, rather than at module scope:
  // the Resend SDK's constructor throws immediately when `RESEND_API_KEY`
  // is unset, which would crash the whole server at import time (as soon as
  // auth.ts/index.ts import this module) instead of failing only when an
  // email is actually sent.
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
  });
}

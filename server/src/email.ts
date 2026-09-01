import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
  });
}

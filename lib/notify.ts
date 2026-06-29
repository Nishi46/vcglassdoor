import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function notifyModerator(
  reviewId: string,
  partnerLabel: string
): Promise<void> {
  const to = process.env.MODERATOR_EMAIL;
  if (!to) return;

  const from =
    process.env.RESEND_FROM ?? "VCGlassdoor <noreply@vcglassdoor.com>";

  await resend.emails.send({
    from,
    to,
    subject: `New review pending: ${partnerLabel}`,
    text: [
      `A new founder review was submitted and is awaiting moderation.`,
      ``,
      `Partner: ${partnerLabel}`,
      `Airtable record ID: ${reviewId}`,
      ``,
      `Open your Airtable Reviews table to approve or reject this submission.`,
    ].join("\n"),
  });
}

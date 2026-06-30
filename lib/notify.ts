import { Resend } from "resend";

export async function notifyModerator(
  reviewId: string,
  partnerLabel: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.MODERATOR_EMAIL;
  if (!apiKey || !to) return;

  const resend = new Resend(apiKey);
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

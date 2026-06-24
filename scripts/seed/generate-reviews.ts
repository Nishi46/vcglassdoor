/**
 * Uses Claude to generate a synthetic founder review for a VC partner,
 * based on their AI-extracted public signals.
 * Run: npx tsx --env-file=.env.local scripts/seed/test-generate-reviews.ts
 */
import Anthropic from "@anthropic-ai/sdk";
import type { Review } from "../../lib/airtable";

export interface Signal {
  type: "green" | "red" | "neutral";
  text: string;
  source: string;
}

export type SyntheticReview = Omit<Review, "id" | "ai_generated">;

const client = new Anthropic();

const RELATIONSHIPS = [
  "Pitched (no deal)",
  "Portfolio founder",
  "Received term sheet",
] as const;

export async function generateReview(
  partnerName: string,
  firmName: string,
  signals: Signal[],
  aiConfidence: number,
  index: number = 0
): Promise<SyntheticReview> {
  const relationship = RELATIONSHIPS[index % RELATIONSHIPS.length];
  const year = index % 2 === 0 ? 2024 : 2025;
  const lowConfidence = aiConfidence < 0.3;

  if (lowConfidence || signals.length === 0) {
    // Conservative flat review when we have little signal
    return {
      relationship,
      year,
      rating_overall: 3,
      rating_responsiveness: 3,
      rating_behavior: 3,
      rating_founder_friendly: 3,
      rating_term_sheet_match: 3,
      review_text:
        "Had a standard interaction during fundraising. Communication was professional and timely. Nothing stood out as exceptional or problematic — a fairly typical process.",
      green_flags: "Professional communication\nTimely responses",
      red_flags: "",
    };
  }

  const greenSignals = signals.filter((s) => s.type === "green").map((s) => `• ${s.text}`).join("\n");
  const redSignals = signals.filter((s) => s.type === "red").map((s) => `• ${s.text}`).join("\n");
  const neutralSignals = signals.filter((s) => s.type === "neutral").map((s) => `• ${s.text}`).join("\n");

  const signalBlock = [
    greenSignals && `Positive signals:\n${greenSignals}`,
    redSignals && `Negative signals:\n${redSignals}`,
    neutralSignals && `Neutral signals:\n${neutralSignals}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const prompt = `You are generating a realistic synthetic founder review for a VC partner database. This review will be clearly labeled "AI-generated" on the site — users know it is not from a real founder interaction.

Partner: ${partnerName}
Firm: ${firmName}
Relationship type: ${relationship}
Year: ${year}

Public signals about this partner (from HN and Reddit research):
${signalBlock}

Generate ONE review in first-person founder voice. Rules:
- Use the signals to inform ratings — green signals → higher scores, red signals → lower
- Ratings must be internally consistent (don't give 4 overall with 1 responsiveness)
- 2–3 sentences of review_text — first-person, specific but no fabricated company names or deal amounts
- green_flags: newline-separated bullet points (no bullet chars), max 3, each under 60 chars
- red_flags: newline-separated bullet points (no bullet chars), max 2, each under 60 chars — empty string if none
- All ratings are integers 1–5
- Do NOT mention the partner's name in review_text or flags

Respond with ONLY valid JSON, no markdown:
{
  "rating_overall": <1-5>,
  "rating_responsiveness": <1-5>,
  "rating_behavior": <1-5>,
  "rating_founder_friendly": <1-5>,
  "rating_term_sheet_match": <1-5>,
  "review_text": "<2-3 sentences>",
  "green_flags": "<newline-separated, no bullets>",
  "red_flags": "<newline-separated, no bullets, or empty string>"
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  const jsonStr = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error(`Claude returned invalid JSON: ${raw.slice(0, 200)}`);
  }

  // Clamp ratings to 1–5 integers
  function clamp(v: unknown): number {
    return Math.min(5, Math.max(1, Math.round(Number(v) || 3)));
  }

  return {
    relationship,
    year,
    rating_overall: clamp(parsed.rating_overall),
    rating_responsiveness: clamp(parsed.rating_responsiveness),
    rating_behavior: clamp(parsed.rating_behavior),
    rating_founder_friendly: clamp(parsed.rating_founder_friendly),
    rating_term_sheet_match: clamp(parsed.rating_term_sheet_match),
    review_text: String(parsed.review_text ?? "").slice(0, 600),
    green_flags: String(parsed.green_flags ?? "").slice(0, 400),
    red_flags: String(parsed.red_flags ?? "").slice(0, 400),
  };
}

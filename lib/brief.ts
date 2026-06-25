import Anthropic from "@anthropic-ai/sdk";
import type { Partner, Review } from "./airtable";

export interface BackchannelBrief {
  partner_slug: string;
  generated_at: string;
  quick_verdict: string;
  green_themes: Array<{ text: string }>;
  red_themes: Array<{ text: string }>;
  tactical_tips: Array<{ text: string }>;
  data_basis: { review_count: number; source_count: number };
}

// In-memory cache keyed by slug. TTL = 24h.
// In serverless this resets per cold start, but that's fine for MVP.
const cache = new Map<string, { brief: BackchannelBrief; expires: number }>();

export async function generateBackchannelBrief(
  partner: Partner,
  reviews: Review[]
): Promise<BackchannelBrief> {
  const cached = cache.get(partner.slug);
  if (cached && cached.expires > Date.now()) return cached.brief;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const reviewBlocks = reviews
    .map(
      (r, i) =>
        `Review ${i + 1} (${r.relationship}, ${r.year}):
- Overall: ${r.rating_overall}/5 | Responsiveness: ${r.rating_responsiveness}/5 | Behavior: ${r.rating_behavior}/5 | Founder-friendly: ${r.rating_founder_friendly}/5 | Term sheet match: ${r.rating_term_sheet_match}/5
- Text: ${r.review_text || "(none)"}
- Green flags: ${r.green_flags || "(none)"}
- Red flags: ${r.red_flags || "(none)"}`
    )
    .join("\n\n");

  let aiSignalBlock = "";
  if (partner.ai_signals) {
    try {
      const signals: Array<{ type: string; text: string }> = JSON.parse(partner.ai_signals);
      if (signals.length > 0) {
        aiSignalBlock =
          "\n\nPublic signals (AI-extracted, not verified):\n" +
          signals.map((s) => `- [${s.type}] ${s.text}`).join("\n");
      }
    } catch {
      // ignore malformed JSON
    }
  }

  const prompt = `You are a concise analyst helping a startup founder prepare for a meeting with a VC partner.

Partner: ${partner.name}
Firm: ${partner.firm}
Title: ${partner.title || "Partner"}

Verified founder reviews (${reviews.length} total):
${reviewBlocks}${aiSignalBlock}

Generate a structured backchannel brief in valid JSON matching this exact schema:
{
  "quick_verdict": "2-3 sentence plain-language synthesis of reputation. Be direct and specific, not vague.",
  "green_themes": [{ "text": "one concrete positive theme" }],
  "red_themes": [{ "text": "one concrete concern or caution" }],
  "tactical_tips": [{ "text": "one actionable tip for the meeting" }]
}

Rules:
- quick_verdict: synthesise across ALL reviews into 2-3 sentences. Be honest about polarisation if present.
- green_themes: 3-5 items, each grounded in actual review text. No fluff.
- red_themes: 1-4 items. Only include if there is genuine signal. Omit array entirely if no red flags.
- tactical_tips: 2-4 concrete, specific tactics tailored to this partner's patterns.
- Respond with ONLY the JSON object. No markdown fences, no explanation.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  const parsed = JSON.parse(raw) as {
    quick_verdict: string;
    green_themes: Array<{ text: string }>;
    red_themes?: Array<{ text: string }>;
    tactical_tips: Array<{ text: string }>;
  };

  const brief: BackchannelBrief = {
    partner_slug: partner.slug,
    generated_at: new Date().toISOString(),
    quick_verdict: parsed.quick_verdict,
    green_themes: parsed.green_themes ?? [],
    red_themes: parsed.red_themes ?? [],
    tactical_tips: parsed.tactical_tips ?? [],
    data_basis: {
      review_count: reviews.length,
      source_count: partner.ai_source_count ?? 0,
    },
  };

  cache.set(partner.slug, { brief, expires: Date.now() + 24 * 60 * 60 * 1000 });
  return brief;
}

import Anthropic from "@anthropic-ai/sdk";
import type { Partner, Review } from "./airtable";

// Full internal brief — never sent directly to clients
export interface BackchannelBrief {
  partner_slug: string;
  generated_at: string;
  quick_verdict: string;
  green_themes: Array<{ text: string }>;
  red_themes: Array<{ text: string }>;
  tactical_tips: Array<{ text: string }>;
  data_basis: { review_count: number; source_count: number };
}

export type BriefTier = "free" | "pro";

// What clients actually receive — pro fields are absent (not blurred) for free tier
export type GatedBrief =
  | {
      tier: "free";
      partner_slug: string;
      generated_at: string;
      quick_verdict: string;
      data_basis: { review_count: number; source_count: number };
      green_themes_count: number;
      red_themes_count: number;
      tactical_tips_count: number;
    }
  | {
      tier: "pro";
      partner_slug: string;
      generated_at: string;
      quick_verdict: string;
      green_themes: Array<{ text: string }>;
      red_themes: Array<{ text: string }>;
      tactical_tips: Array<{ text: string }>;
      data_basis: { review_count: number; source_count: number };
    };

export function gateBrief(brief: BackchannelBrief, tier: BriefTier): GatedBrief {
  if (tier === "pro") {
    return { tier: "pro", ...brief };
  }
  // Free tier: return counts only — no actual theme/tip text
  return {
    tier: "free",
    partner_slug: brief.partner_slug,
    generated_at: brief.generated_at,
    quick_verdict: brief.quick_verdict,
    data_basis: brief.data_basis,
    green_themes_count: brief.green_themes.length,
    red_themes_count: brief.red_themes.length,
    tactical_tips_count: brief.tactical_tips.length,
  };
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

  // Strip markdown code fences Claude sometimes adds despite instructions
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  let parsed: {
    quick_verdict?: string;
    green_themes?: Array<{ text: string }>;
    red_themes?: Array<{ text: string }>;
    tactical_tips?: Array<{ text: string }>;
  };

  try {
    parsed = JSON.parse(cleaned) as typeof parsed;
  } catch {
    // Claude returned non-JSON — produce a minimal fallback so the route
    // doesn't 500. The fallback will not be cached so the next request retries.
    const fallback: BackchannelBrief = {
      partner_slug: partner.slug,
      generated_at: new Date().toISOString(),
      quick_verdict:
        "We weren't able to generate a synthesis right now. Check back shortly — this usually resolves on the next attempt.",
      green_themes: [],
      red_themes: [],
      tactical_tips: [],
      data_basis: {
        review_count: reviews.length,
        source_count: partner.ai_source_count ?? 0,
      },
    };
    return fallback;
  }

  const brief: BackchannelBrief = {
    partner_slug: partner.slug,
    generated_at: new Date().toISOString(),
    quick_verdict: parsed.quick_verdict ?? "Summary unavailable.",
    green_themes: Array.isArray(parsed.green_themes) ? parsed.green_themes : [],
    red_themes: Array.isArray(parsed.red_themes) ? parsed.red_themes : [],
    tactical_tips: Array.isArray(parsed.tactical_tips) ? parsed.tactical_tips : [],
    data_basis: {
      review_count: reviews.length,
      source_count: partner.ai_source_count ?? 0,
    },
  };

  cache.set(partner.slug, { brief, expires: Date.now() + 24 * 60 * 60 * 1000 });
  return brief;
}

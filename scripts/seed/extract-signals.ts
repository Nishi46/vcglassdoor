/**
 * Uses Claude to extract structured reputation signals from raw public text snippets.
 * Run: npx tsx --env-file=.env.local scripts/seed/test-extract.ts
 */
import Anthropic from "@anthropic-ai/sdk";

export interface Signal {
  type: "green" | "red" | "neutral";
  text: string;   // max 100 chars — factual, no partner name
  source: string; // "hn" | "reddit"
}

export interface ExtractedSignals {
  ai_overall: number;      // 1.0–5.0, or 0 if insufficient data
  ai_confidence: number;   // 0.0–1.0
  signals: Signal[];
  reasoning: string;       // internal only — not shown to users
}

const client = new Anthropic();

export async function extractSignals(
  partnerName: string,
  firmName: string,
  snippets: Array<{ text: string; source: string }>
): Promise<ExtractedSignals> {
  if (snippets.length === 0) {
    return { ai_overall: 0, ai_confidence: 0, signals: [], reasoning: "No snippets provided" };
  }

  const snippetBlock = snippets
    .map((s, i) => `[${i + 1}] (${s.source}): ${s.text.slice(0, 500)}`)
    .join("\n\n");

  const prompt = `You are analyzing public internet mentions of a VC partner to estimate their reputation among founders.

Partner: ${partnerName}
Firm: ${firmName}

Public mentions:
${snippetBlock}

Extract a reputation signal from these mentions. Be conservative and factual — only use what the text explicitly states, never infer or fabricate.

Respond with ONLY valid JSON matching this exact schema (no markdown, no code fences):
{
  "ai_overall": <number 1.0-5.0, or 0 if insufficient signal>,
  "ai_confidence": <number 0.0-1.0>,
  "signals": [
    {"type": "green", "text": "<max 100 chars, factual>", "source": "<hn or reddit>"}
  ],
  "reasoning": "<1-2 sentences>"
}

Rules:
- ai_overall = 0 if mentions are off-topic, ambiguous, or about a different person with the same name
- ai_confidence = proportion of mentions that are clearly relevant and about this specific VC partner
- Maximum 5 signals total
- Never include the partner name in signal text
- Green = positive founder experience, Red = negative, Neutral = factual/mixed`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  // Strip markdown code fences if model adds them despite instructions
  const jsonStr = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  try {
    return JSON.parse(jsonStr) as ExtractedSignals;
  } catch {
    throw new Error(`Claude returned invalid JSON: ${raw.slice(0, 200)}`);
  }
}

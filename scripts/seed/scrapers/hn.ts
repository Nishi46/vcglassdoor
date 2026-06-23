/**
 * Fetches public mentions of a VC partner from Hacker News via the Algolia API.
 * Free, no auth required.
 */

interface HnHit {
  comment_text?: string;
  story_text?: string;
  title?: string;
}

export async function fetchHnMentions(name: string, firm: string): Promise<string[]> {
  // Search by name only — firm name sometimes hurts recall on HN
  const query = encodeURIComponent(`"${name}"`);
  const url = `https://hn.algolia.com/api/v1/search_by_date?query=${query}&hitsPerPage=20`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HN API error: ${res.status} ${res.statusText}`);

  const data = await res.json() as { hits: HnHit[] };

  // Filter hits that also mention the firm or VC-related keywords for relevance
  const firmLower = firm.toLowerCase();
  const vcKeywords = ["vc", "venture", "invest", "fund", "partner", "startup", "founder"];

  return data.hits
    .map((h) => h.comment_text || h.story_text || h.title || "")
    .filter((t) => {
      if (t.length < 20) return false;
      const lower = t.toLowerCase();
      return lower.includes(firmLower) || vcKeywords.some((kw) => lower.includes(kw));
    })
    .slice(0, 10);
}

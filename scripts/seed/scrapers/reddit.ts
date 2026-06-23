/**
 * Fetches public mentions of a VC partner from Reddit via the public search API.
 * No auth required. Rate limit: ~60 req/min unauthenticated.
 */

interface RedditChild {
  data: {
    selftext?: string;
    title?: string;
  };
}

interface RedditResponse {
  data?: {
    children?: RedditChild[];
  };
}

export async function fetchRedditMentions(name: string, firm: string): Promise<string[]> {
  // Try Pushshift (public archive) first; fall back gracefully on any error
  try {
    return await fetchViaPushshift(name, firm);
  } catch {
    // Pushshift may be down — return empty rather than crashing the pipeline
    return [];
  }
}

async function fetchViaPushshift(name: string, firm: string): Promise<string[]> {
  // Use Reddit's old.reddit.com endpoint which is more script-friendly
  const query = encodeURIComponent(`"${name}" ${firm} VC venture`);
  const url = `https://old.reddit.com/search.json?q=${query}&sort=relevance&limit=10&type=link,comment`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; vcglassdoor-research/1.0)",
      "Accept": "application/json",
    },
  });

  if (res.status === 429 || res.status === 403) {
    console.warn(`Reddit returned ${res.status} — skipping`);
    return [];
  }
  if (!res.ok) throw new Error(`Reddit API error: ${res.status}`);

  const data = await res.json() as RedditResponse;
  return (data.data?.children ?? [])
    .map((c) => c.data.selftext || c.data.title || "")
    .filter((t) => t.length > 20)
    .slice(0, 10);
}

/**
 * Combines HN + Reddit scrapers in parallel for a single partner.
 * Uses Promise.allSettled so one scraper failing never crashes the pipeline.
 */
import { fetchHnMentions } from "./scrapers/hn";
import { fetchRedditMentions } from "./scrapers/reddit";

export interface Snippet {
  text: string;
  source: "hn" | "reddit";
}

export async function fetchAllSignals(name: string, firm: string): Promise<Snippet[]> {
  const [hnResult, redditResult] = await Promise.allSettled([
    fetchHnMentions(name, firm),
    fetchRedditMentions(name, firm),
  ]);

  const snippets: Snippet[] = [];

  if (hnResult.status === "fulfilled") {
    hnResult.value.forEach((text) => snippets.push({ text, source: "hn" }));
  } else {
    console.warn(`HN scraper failed for "${name}": ${hnResult.reason}`);
  }

  if (redditResult.status === "fulfilled") {
    redditResult.value.forEach((text) => snippets.push({ text, source: "reddit" }));
  } else {
    console.warn(`Reddit scraper failed for "${name}": ${redditResult.reason}`);
  }

  return snippets;
}

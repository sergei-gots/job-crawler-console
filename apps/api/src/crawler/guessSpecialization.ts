/**
 * Best-effort keyword classification against a title (optionally combined with tags/skills) into
 * one of four broad, English buckets. Shared by sources with no dedicated specialization field on
 * the page itself (unlike habr_career's labeled lead paragraph, or weWorkRemotelyStrategy, which
 * uses its seeded CrawlListing.label instead - a real value, not a guess). Unmatched text is left
 * null rather than guessed.
 */
export function guessSpecialization(text: string): string | null {
  const lower = text.toLowerCase();
  if (/full[\s-]?stack/.test(lower)) return "Full-Stack";
  if (/back[\s-]?end/.test(lower)) return "Backend";
  if (/front[\s-]?end/.test(lower)) return "Frontend";
  if (/mobile|\bios\b|\bandroid\b/.test(lower)) return "Mobile";
  return null;
}

/**
 * Best-effort keyword classification against a title into one of six seniority buckets, ordered
 * most- to least-senior so a title with more than one signal ("Senior Staff Engineer") resolves
 * to its most senior word rather than whichever regex happens to run first. Shared by sources with
 * no dedicated seniority field of their own (unlike habr_career's labeled lead paragraph, which
 * already writes the level in English - e.g. "Квалификация: Senior" - and needs no guessing).
 * Unmatched titles are left null rather than guessed.
 */
export function guessSeniority(text: string): string | null {
  const lower = text.toLowerCase();
  if (/\bdirector\b|\bvp\b|\bhead of\b/.test(lower)) return "Director";
  if (/\bprincipal\b/.test(lower)) return "Principal";
  if (/\bstaff\b/.test(lower)) return "Staff";
  if (/\blead\b/.test(lower)) return "Lead";
  if (/\bsenior\b|\bsr\.?\b/.test(lower)) return "Senior";
  if (/\bmiddle\b|\bmid[\s-]?level\b/.test(lower)) return "Middle";
  if (/\bjunior\b|\bentry[\s-]?level\b|\bintern\b/.test(lower)) return "Junior";
  return null;
}

/* ------------------------------------------------------------------
   The world index.

   src/cities.ts is 46,684 places and about 320 KB over the wire, which
   is far too much to put in front of someone who only came to look at
   photographs. So it is a dynamic import: the packages console asks
   for it once, in the background, and nothing else on the site ever
   pays for it.

   Everything below is deliberately array-shaped rather than
   object-shaped. Three parallel arrays of primitives search in about
   a millisecond; 46k little objects do not.
   ------------------------------------------------------------------ */

export type WorldCity = { name: string; country: string };

let names: string[] = [];
let lower: string[] = [];
let codes: string[] = [];
let countries: Record<string, string> = {};
let lowCountries: string[] = [];

let pending: Promise<void> | null = null;

/** Fetch and parse the index. Safe to call repeatedly; only the first lands. */
export function loadWorld(): Promise<void> {
  pending ??= import("./cities").then((m) => {
    countries = m.COUNTRIES;

    const rows = m.CITY_INDEX.split("\n");
    names = new Array(rows.length);
    lower = new Array(rows.length);
    codes = new Array(rows.length);
    lowCountries = new Array(rows.length);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const bar = row.lastIndexOf("|");
      const name = row.slice(0, bar);
      const cc = row.slice(bar + 1);
      names[i] = name;
      lower[i] = name.toLowerCase();
      codes[i] = cc;
      lowCountries[i] = (countries[cc] ?? cc).toLowerCase();
    }
  });

  return pending;
}

export const worldReady = () => names.length > 0;

/** True where the match starts a word, so "york" finds New York but "ork" does not. */
const wordStart = (hay: string, at: number) =>
  at === 0 || hay[at - 1] === " " || hay[at - 1] === "-" || hay[at - 1] === "'";

/**
 * Cities whose name (or country) matches `q`, best first.
 *
 * The index is sorted by population, and that ordering does the ranking: a
 * single pass taking matches as it finds them returns New York before
 * Yorkville without ever comparing the two. Match quality only decides which
 * of three buckets a hit lands in, never the order inside one - rank by how
 * cleanly the letters line up instead and "york" buries the city everybody
 * actually meant under six villages named after it.
 */
export function searchWorld(
  q: string,
  limit = 6,
  skip?: (name: string) => boolean
): WorldCity[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2 || !names.length) return [];

  const clean: number[] = []; // starts the name, or a word inside it
  const loose: number[] = []; // buried mid-word
  const abroad: number[] = []; // matched the country instead

  for (let i = 0; i < lower.length; i++) {
    if (clean.length === limit) break;

    const hay = lower[i];
    const at = hay.indexOf(needle);

    if (at < 0) {
      if (abroad.length < limit && lowCountries[i].startsWith(needle)) abroad.push(i);
    } else if (wordStart(hay, at)) {
      clean.push(i);
    } else if (loose.length < limit) {
      loose.push(i);
    }
  }

  const out: WorldCity[] = [];
  const seen = new Set<string>();

  for (const i of [...clean, ...loose, ...abroad]) {
    if (out.length === limit) break;
    const name = names[i];
    const key = `${name}|${codes[i]}`;
    if (seen.has(key) || skip?.(name)) continue;
    seen.add(key);
    out.push({ name, country: countries[codes[i]] ?? codes[i] });
  }

  return out;
}

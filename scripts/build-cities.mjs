/**
 * Generates src/cities.ts - the world index the packages console searches.
 *
 * Source is `all-the-cities` (GeoNames, 135k places). Everything above
 * MIN_POPULATION is kept, deduplicated on name + country, and written as one
 * newline-separated string of "City|CC" - ordered by population, so a search
 * can take the first few hits and already be showing the right places.
 *
 *   node scripts/build-cities.mjs
 *
 * Re-run only when the dataset is bumped. The output is committed, so the
 * build itself never needs the 6MB dependency.
 */
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const cities = require("all-the-cities");

const MIN_POPULATION = 5000;
const NL = String.fromCharCode(10);

// Highest population wins when a country has several towns of the same name.
const best = new Map();
for (const c of cities) {
  if (c.population < MIN_POPULATION) continue;
  const key = `${c.country} ${c.name}`;
  const seen = best.get(key);
  if (!seen || c.population > seen.population) best.set(key, c);
}

// One flat list, biggest place first, so a search can stop at the first few
// hits and still be showing the cities people most likely meant.
const rows = [...best.values()].sort((a, b) => b.population - a.population);

const names = new Intl.DisplayNames(["en"], { type: "region" });
const countries = {};
for (const c of rows) {
  if (countries[c.country]) continue;
  let label;
  try {
    label = names.of(c.country);
  } catch {
    label = c.country;
  }
  countries[c.country] = label ?? c.country;
}

const index = rows.map((c) => `${c.name}|${c.country}`).join(NL);

const header = [
  "/* eslint-disable */",
  "// GENERATED FILE - do not edit by hand.",
  "// Regenerate with: node scripts/build-cities.mjs",
  "//",
  `// ${rows.length.toLocaleString("en")} populated places (population >= ${MIN_POPULATION.toLocaleString("en")})`,
  "// from GeoNames via the `all-the-cities` package.",
  "",
  "/** ISO 3166-1 alpha-2 -> English country name. */",
  `export const COUNTRIES: Record<string, string> = ${JSON.stringify(countries)};`,
  "",
  '/** "City|CC" per line, ordered by population, descending. */',
  `export const CITY_INDEX = ${JSON.stringify(index)};`,
  "",
].join(NL);

writeFileSync(new URL("../src/cities.ts", import.meta.url), header, "utf8");
console.log(`src/cities.ts: ${rows.length} cities, ${(header.length / 1024).toFixed(0)} KB`);

/* ------------------------------------------------------------------
   The finish guard.

   This site has one rule about its own surface: nothing on it is
   blurred and nothing on it is matte. Every panel is polished glass,
   every photograph keeps its own light, and every glyph is drawn at
   the size it is shown.

   That rule was expensive to win back - the frosting, the grain and
   the translateZ magnification had spread across eleven files before
   anyone named the cause - so it is enforced here rather than
   remembered. `npm run build` runs this first, which means a blurred
   or matte surface cannot reach the deploy.

   If you are here because the guard stopped you: it is almost never
   right to add the pattern back. Read the reason printed beside it -
   each one names what to do instead.
   ------------------------------------------------------------------ */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");
const EXT = /\.(tsx?|css)$/;

/* Comments talk about blur constantly - they are how the rule is
   explained. Only real declarations are scanned. */
const strip = (text) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, " "));

const RULES = [
  {
    test: /backdrop-blur|backdrop-filter\s*:/,
    why: "A backdrop-filter, of any kind. Blur is the obvious offender: it smears what is behind the panel and hands the panel its own composited layer, so the type on it rides on a blurred plate. But even `saturate()` is banned, because any backdrop-filter makes the element a backdrop root - and inside a moving preserve-3d subtree that snapshot is rasterised once and then resampled by the transform, so the plate goes soft under the pointer. Use `glass`, `glass-panel` or `glass-dark`: their gloss is a raked specular gradient, a lit top edge and a bright rim, all painted, all sharp.",
  },
  {
    test: /(^|[\s"'`:;(])-?blur-(sm|md|lg|xl|2xl|3xl|\[)|filter\s*:[^;]*\bblur\s*\(|\bblur\(\d/,
    why: "A blur filter. Decorative glows belong in a painted radial-gradient, which reads the same and costs no sharpness. Nothing on this site is deliberately out of focus.",
  },
  {
    test: /mix-blend-(multiply|overlay|soft-light)|feTurbulence/,
    why: "Grain, or a blend layer over a whole band. Noise multiplied across every pixel of a section is the definition of a matte finish, and it lands on the type as well as the photograph. Give the ground its texture with graticules, contour rings or warm glows instead.",
  },
  {
    test: /-webkit-font-smoothing\s*:\s*antialiased|-moz-osx-font-smoothing\s*:\s*grayscale/,
    why: "Greyscale antialiasing thins every stroke, which is what makes small type read soft. The body is set to `subpixel-antialiased` on purpose.",
  },
];

/* A lift inside a perspective magnifies by P / (P - Z): the element is
   rasterised once at 1x and then blown up by a few percent, so every
   glyph on it is resampled. Each step has to carry the inverse scale
   that cancels it.

   The inverse only holds while the browser paints the subtree in one
   pass. Anything below the lift that promotes itself - a link that
   transitions a transform on hover is enough - is rasterised at its
   ancestors' flat scale and then magnified by the perspective, and the
   inverse scale cannot reach a layer created beneath it. So a
   translateZ belongs on a leaf plate that needs real depth, never on a
   container wrapping content that moves. See the note at the top of
   Destination.tsx, which is where that was learned. */
const LIFT = /translateZ\(/;
const CANCEL = /scale\(/;

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : EXT.test(name) ? [path] : [];
  });

const found = [];

for (const path of walk(SRC)) {
  const lines = strip(readFileSync(path, "utf8")).split("\n");
  const where = relative(ROOT, path).replace(/\\/g, "/");

  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.test.test(line)) found.push({ where, line: i + 1, why: rule.why });
    }
    // Same line, deliberately: a lift and the scale that cancels it are one
    // thought and belong in one transform value. Widening the window only
    // lets an uncancelled lift hide behind a cancelled one further down.
    if (LIFT.test(line) && !CANCEL.test(line)) {
      found.push({
        where,
        line: i + 1,
        why: "A translateZ with no inverse scale. Inside a perspective P, a lift of Z magnifies the element by P / (P - Z) - it is drawn at 1x and then enlarged, which is what makes a card go soft the moment it lifts. Pair it with scale(1 - Z / P).",
      });
    }
  });
}

if (found.length) {
  console.error("\n  The finish guard stopped the build.\n");
  console.error("  This site is polished glass, never frosted, and never matte.\n");
  for (const f of found) console.error(`  ${f.where}:${f.line}\n    ${f.why}\n`);
  process.exit(1);
}

console.log("finish guard: clear - nothing blurred, nothing matte");

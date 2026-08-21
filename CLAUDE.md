# EG Travel

A single-page React 19 + Tailwind v4 site on Vite, deployed to Azure Static
Web Apps from `main`. `src/data.ts` holds every string and image URL; the
components hold no copy of their own.

## The one rule about the surface

**Nothing on this site is blurred, and nothing on it is matte.**

Every panel is polished glass, every photograph keeps its own light, and
every glyph is drawn at exactly the size it is shown. This is not a
preference to weigh against others - it is the finish the site is built
around, and it is enforced by `scripts/check-finish.mjs`, which `npm run
build` and `npm run lint` both run. A blurred or matte surface cannot reach
the deploy.

If the guard stops you, the fix is never to add the pattern back.

### backdrop-filter

Never, in any form - not `blur()`, and not `saturate()` either.

Blur is the obvious offender: it smears what is behind the panel, and it
hands the panel its own composited layer, so type sitting on it is
rasterised separately and rides on a blurred plate. Both halves read as out
of focus.

A `saturate()` looks harmless and is not. Any backdrop-filter makes the
element a backdrop root, so the browser snapshots what is behind it into a
texture and composites the result. Inside a `preserve-3d` subtree that
moves, that texture is rasterised once and then resampled by the transform,
and the plate softens under the pointer. Saturation is not worth an edge.

Use the three tokens in `src/index.css` instead. They get their gloss from
a raked specular gradient, a lit top edge and a bright rim - painted, and
sharp at any zoom:

- `glass` - clear glass, for a panel over a photograph that can carry it
- `glass-panel` - near-opaque bright glass, for a panel over the page
- `glass-dark` - the same cut from the dark end, for white type on a
  photograph. White type cannot trust a photograph: on a bleached sky an
  untinted pill vanishes. Reach for this whenever white type sits on an
  image rather than on a scrim you control.

A plate that carries a name is opaque. `crystal` and `brass` are the
nameplates; the bevel and the drop shadow do the cut-glass work.

### Blur filters

Never `filter: blur()` or `blur-*`. Decorative glows are painted
radial-gradients - they read the same and cost no sharpness. Nothing here
is deliberately out of focus, including the far layer of a parallax, the
first half of a reveal, and the background of a modal.

### Grain and blend layers

Never `mix-blend-multiply` / `mix-blend-overlay` over a section, and never
an `feTurbulence` noise texture. Noise multiplied across every pixel of a
band is the definition of a matte finish, and it lands on the type as well
as on the photograph. Grounds get their texture from graticules, contour
rings, latitude rules and warm radial glows.

### translateZ magnification

Inside a perspective `P`, a lift of `Z` magnifies the element by
`P / (P - Z)`: the browser rasterises it once at 1x and then enlarges it,
so every glyph on it is resampled. This is the blur that only appears on
hover, and it caused four separate regressions before it was named.

**Every `translateZ(Z)` carries `scale(1 - Z / P)` in the same transform.**
See `lift` in `Packages.tsx` and `READING` in `Contact.tsx`. Rotation
resamples too, so yaw stays small - single digits.

**And the inverse scale only holds while the subtree is painted in one
pass.** Anything below the lift that promotes itself to its own composited
layer - a link that transitions a transform on hover is enough - gets
rasterised at its ancestors' flat scale and then magnified by the
perspective, and the inverse scale cannot reach a layer created beneath it.
The Wander deck hit this: the portals sat at `translateZ(74px)` with the
matching `scale(0.954)`, the link inside lifted on hover, and the region
pill and the card name went soft under the pointer at a net 4.9%
enlargement.

So `translateZ` is for a leaf plate that genuinely needs depth - the
thickness of a mosaic tile, a badge standing off a card. It never wraps
content that moves. When a lift only has to *look* like a lift, use
`translateY`, which cannot magnify anything. The Wander deck has no
`translateZ` at all now; its depth is yaw, width and shadow, and the
comment at the top of `Destination.tsx` explains why.

Related: never scale a card that contains text on hover. Chrome rasterises
it once and resamples for the whole transition, so the caption goes soft
under the pointer. Lift and straighten it instead.

### Light

- Photographs are graded `saturate(1.08) contrast(1.04) brightness(1.02)`
  in `@layer base`. Anything that sets its own `filter` for a hover grade
  repeats those numbers as its resting value, so nothing jumps.
- Scrims are held as light as the type will allow. Headlines carry a
  `text-shadow`, which is what buys the extra light.
- Body type is `subpixel-antialiased`. Greyscale antialiasing thins every
  stroke and is what makes small type read soft.
- Text on the dark footer never goes below about 65% cream. Below that it
  is not quiet, it is unreadable, and the whole band reads matte.

## Colour

The hero owns the gold. Everything below it is brown: `brown` `#7a5c3e`,
`brown-deep` `#5b4632`, `brown-soft` `#a07d54`, taken from the Destination
wordmark. Headings are brown + `ink` + `ink-faint`; paragraphs are
`text-ink/80`, a soft near-black. On listing cards the title is `ink` (a
brown title reads as a link at card scale), the place eyebrow and the price
are brown. The Destination band keeps its own forest-green accent.

## Prose

Plain ASCII hyphens only - no em dashes, in copy, comments or commit
messages.

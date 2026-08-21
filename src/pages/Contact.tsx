import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Arrow, Mail, Phone, Pin } from "../icons";
import { brand, contactPage, footer } from "../data";

/* ------------------------------------------------------------------
   The desk.

   Every other section on this site is centred and stacked; this page
   is deliberately asymmetric - a narrow rail of ways to reach a human,
   pinned beside a wide column of correspondence. The enquiry is not a
   form. It is a sentence with gaps in it, which is the same promise
   the footer makes: one note, and a real person plans the rest.
   ------------------------------------------------------------------ */

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, shown] as const;
}

const rise = (shown: boolean, i: number): React.CSSProperties =>
  shown
    ? {
        animation: "fade-up 0.85s cubic-bezier(0.22,1,0.36,1) both",
        animationDelay: `${i * 0.08}s`,
      }
    : { opacity: 0 };

/* Local time plus whether anyone is actually at that desk right now. */
function deskState(tz: string, opens: number, closes: number, now: Date) {
  const at = (opt: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { ...opt, timeZone: tz }).format(now);

  const time = at({ hour: "2-digit", minute: "2-digit", hour12: false });
  const day = at({ weekday: "short" });
  const hour = Number(time.slice(0, 2));
  const open = day !== "Sat" && day !== "Sun" && hour >= opens && hour < closes;

  return { time, day, open };
}

/* ---------------- the note ---------------- */

/** An inline blank that grows with what you type. */
function Blank({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  label: string;
}) {
  const width = Math.max(placeholder.length, value.length) + 1;
  return (
    <input
      type={type}
      value={value}
      required
      aria-label={label}
      autoComplete={autoComplete}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: `${width}ch` }}
      className="mx-1 max-w-full border-b border-brown/45 bg-transparent px-1 pb-0.5 font-semibold text-brown-deep caret-brown outline-none transition-colors placeholder:font-normal placeholder:text-ink-faint hover:border-brown focus:border-brown-deep focus:bg-brown/[0.06]"
    />
  );
}

/** An inline blank you choose from instead of typing. */
function Pick({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  label: string;
}) {
  return (
    <span className="relative mx-1 inline-flex items-center">
      <select
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none border-b border-brown/45 bg-transparent py-0 pb-0.5 pl-1 pr-5 font-semibold text-brown-deep outline-none transition-colors hover:border-brown focus:border-brown-deep focus:bg-brown/[0.06]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1 h-1.5 w-1.5 -translate-y-[0.15em] rotate-45 border-b border-r border-brown/70"
      />
    </span>
  );
}

function Note() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [where, setWhere] = useState("");
  const [extra, setExtra] = useState("");
  const [sent, setSent] = useState(false);

  const months = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
    const from = new Date();
    from.setDate(1);
    return [
      "whenever it's quiet",
      ...Array.from({ length: 12 }, (_, i) => {
        const d = new Date(from);
        d.setMonth(from.getMonth() + i);
        return `in ${fmt.format(d)}`;
      }),
    ];
  }, []);

  const [when, setWhen] = useState(months[0]);
  const [nights, setNights] = useState<string>(contactPage.nights[1]);
  const [who, setWho] = useState<string>(contactPage.travellers[1]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const body = [
      `Hello ${brand} - I'm ${name}.`,
      "",
      `I'd like to travel to ${where}, ${when}, for about ${nights} nights, and it'll be ${who}.`,
      extra ? `\n${extra}` : "",
      "",
      `You can write back to ${email}.`,
    ].join("\n");

    // No backend on a static host, so the note goes out through the
    // visitor's own mail client - which also means they keep a copy.
    window.location.href = `mailto:${footer.email.label}?subject=${encodeURIComponent(
      `A note about ${where || "a trip"}`
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  };

  return (
    <form onSubmit={submit} className="relative">
      {/* the sheet */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#fffdf8] shadow-[0_36px_80px_-40px_rgba(58,44,24,0.45)] ring-1 ring-brown/12 sm:rounded-[2.25rem]">
        {/* faint letter ruling */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 41px, rgba(122,92,62,0.10) 41px 42px)",
            backgroundPosition: "0 2.6rem",
          }}
        />
        {/* the margin rule every exercise book has */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-8 w-px bg-brown/20 sm:left-14"
        />

        <div className="relative px-7 pb-8 pt-10 pl-12 sm:px-14 sm:pb-12 sm:pt-12 sm:pl-20">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brown-soft">
            The note
          </p>

          <p className="mt-6 text-[1.02rem] leading-[42px] text-ink sm:text-[1.2rem]">
            Hello {brand} - I'm
            <Blank
              label="Your name"
              value={name}
              onChange={setName}
              placeholder="your name"
              autoComplete="name"
            />
            and you can write back to
            <Blank
              label="Your email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
            . I'd like to travel to
            <Blank
              label="Where you want to go"
              value={where}
              onChange={setWhere}
              placeholder="Kerala, Uluru, somewhere quiet"
            />
            ,
            <Pick label="When" value={when} onChange={setWhen} options={months} />
            , for about
            <Pick
              label="How many nights"
              value={nights}
              onChange={setNights}
              options={contactPage.nights}
            />
            nights, and it'll be
            <Pick
              label="Who is travelling"
              value={who}
              onChange={setWho}
              options={contactPage.travellers}
            />
            .
          </p>

          <label className="mt-8 block">
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brown-soft">
              Anything else worth knowing
            </span>
            <textarea
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              rows={3}
              placeholder="An anniversary, a fear of small planes, a room that has to have a bath."
              className="mt-3 w-full resize-none rounded-2xl border border-brown/20 bg-cream/60 px-4 py-3 text-[0.95rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-brown/55 focus:bg-cream"
            />
          </label>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              type="submit"
              className="group inline-flex items-center gap-3 rounded-full bg-brown py-2.5 pl-7 pr-2.5 text-sm font-semibold text-cream shadow-[0_18px_36px_-16px_rgba(122,92,62,0.8)] transition-colors hover:bg-brown-deep"
            >
              Send this note
              <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-brown transition-transform duration-300 group-hover:rotate-45">
                <Arrow className="h-4 w-4" />
              </span>
            </button>

            <p
              className="max-w-xs text-xs leading-relaxed text-ink-soft"
              role={sent ? "status" : undefined}
            >
              {sent
                ? "Your mail app should be opening with the note already written - send it and you keep a copy too."
                : "Opens in your own mail app with the note already written, addressed to the planning desk."}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

/* ---------------- the mosaic band ----------------

   Six tiles, edge to edge. Nothing slides sideways: each tile turns over
   where it stands, dipping away from the viewer mid-turn so it reads as a
   solid card moving through space. One tile turns at a time, in a scattered
   order, which keeps the band alive without it ever looking mechanical. */

type Tile = (typeof contactPage.mosaic)[number];
type TileFace = Tile["faces"][number];

const spanCls: Record<string, string> = {
  sm: "col-span-1 row-span-1",
  tall: "col-span-1 row-span-1 lg:row-span-2",
  wide: "col-span-2 row-span-1 lg:row-span-2",
};

/* Resting yaw per tile, left to right across the band: the two left columns
   turn toward you, the right ones away, so the row stands like a folding
   screen instead of lying flat. Only applied from lg up, where the five-column
   layout actually holds. */
const FAN = [9, 9, 5, -4, -4, -8];

/* the order tiles take their turn in - deliberately not left to right */
const TURN_ORDER = [0, 3, 1, 5, 2, 4];
const TURN_MS = 900;
const HOLD_MS = 2600;

/* the tile leans toward the pointer, which is what gives it a visible side */
const lean = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--tx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
  el.style.setProperty("--ty", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
};
const level = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty("--tx", "0");
  e.currentTarget.style.setProperty("--ty", "0");
};

function MosaicFace({ face, back = false }: { face: TileFace; back?: boolean }) {
  return (
    <figure
      className={`absolute inset-0 overflow-hidden rounded-[1.35rem] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] ${
        back
          ? "[transform:rotate3d(var(--ax,0),var(--ay,1),0,180deg)_translateZ(11px)]"
          : "[transform:translateZ(11px)]"
      }`}
    >
      <img
        src={face.img}
        alt={face.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
      />
      {/* scrim - dark enough to carry white type, light enough to keep the view */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(29,22,19,0.46)_0%,rgba(29,22,19,0.14)_40%,rgba(29,22,19,0.70)_100%)]" />
      {/* raked light across the face, so the tile catches an edge as it turns */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_26%,transparent_46%)]" />

      <figcaption className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <p className="font-heading text-[clamp(1.05rem,1.9vw,2.05rem)] font-bold leading-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.5)]">
          {face.title}
        </p>
        <p className="mt-2 font-script text-[clamp(0.95rem,1.35vw,1.5rem)] leading-none text-cream/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]">
          {face.kicker}
        </p>
      </figcaption>

      {/* lit top edge and a rim, so the face reads as the polished side of a slab */}
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      <span className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/15" />
      {/* sheen that travels the tile on hover */}
      <span className="pointer-events-none absolute -inset-y-8 -left-1/3 w-1/4 -rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.38),transparent)] opacity-0 transition-[left,opacity] duration-[1100ms] ease-out group-hover:left-[125%] group-hover:opacity-100" />
    </figure>
  );
}

function Mosaic() {
  const tiles = contactPage.mosaic;
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  // `turn` drives the rotation; `staged` lags it by one turn so the photograph
  // on a face is only swapped once that face is safely out of sight.
  const [turn, setTurn] = useState<number[]>(() => tiles.map(() => 0));
  const [staged, setStaged] = useState<number[]>(() => tiles.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const busy = useRef(new Set<number>());
  const timers = useRef(new Set<number>());

  // one way in for a turn, whether it came from the timer or from a click
  const turnTile = useCallback((i: number) => {
    if (busy.current.has(i)) return;
    busy.current.add(i);
    setTurn((t) => t.map((v, j) => (j === i ? v + 1 : v)));

    const t = window.setTimeout(() => {
      timers.current.delete(t);
      busy.current.delete(i);
      setStaged((s) => s.map((v, j) => (j === i ? v + 1 : v)));
    }, TURN_MS + 100);
    timers.current.add(t);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (!live || reduced()) return;
    let step = 0;
    const id = window.setInterval(() => {
      turnTile(TURN_ORDER[step % TURN_ORDER.length] % tiles.length);
      step += 1;
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [live, tiles.length, turnTile]);

  return (
    <div
      ref={ref}
      className="grid w-full grid-cols-2 gap-3 p-3 [grid-auto-rows:clamp(9.5rem,34vw,15rem)] sm:gap-4 sm:p-4 lg:grid-flow-col lg:grid-cols-5 lg:gap-5 lg:p-5 lg:[grid-template-rows:repeat(2,clamp(12rem,19vw,27rem))]"
    >
      {tiles.map((tile, i) => {
        const n = turn[i];
        const s = staged[i];
        const len = tile.faces.length;
        // the visible face carries photograph `s`; the hidden one already
        // holds the next, ready for the turn.
        const front = tile.faces[(s % 2 === 0 ? s : s + 1) % len];
        const back = tile.faces[(s % 2 === 0 ? s + 1 : s) % len];

        return (
          <div
            key={tile.key}
            onMouseMove={lean}
            onMouseLeave={level}
            onClick={() => turnTile(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                turnTile(i);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Turn over ${front.title}`}
            className={`group relative cursor-pointer select-none outline-none [perspective:900px] ${spanCls[tile.size]}`}
            style={
              {
                "--ax": tile.axis === "x" ? 1 : 0,
                "--ay": tile.axis === "x" ? 0 : 1,
                "--rest": `${FAN[i] ?? 0}deg`,
              } as React.CSSProperties
            }
          >
            {/* lean shell - the tile stands at its own angle in the fan, leans
                toward the pointer and lifts off the band on hover */}
            <div className="relative h-full w-full [--fan:0] [--lift:0px] [transform-style:preserve-3d] [transform:rotateX(calc(var(--ty,0)*-11deg))_rotateY(calc(var(--rest,0deg)*var(--fan)_+_var(--tx,0)*14deg))_translateZ(var(--lift))] [transition:transform_.5s_ease-out] group-hover:[--lift:34px] group-focus-visible:[--lift:34px] lg:[--fan:1]">
              <div
                className="relative h-full w-full [transform-style:preserve-3d] will-change-transform"
                style={
                  n === 0
                    ? undefined
                    : {
                        animation: `${
                          n % 2 ? "tile-turn-a" : "tile-turn-b"
                        } ${TURN_MS}ms linear both`,
                      }
                }
              >
                {/* the card stock the two faces are mounted on. It sits 11px
                    behind each face, so the tile has a genuine 22px of
                    thickness - that pale edge is what you catch as the tile
                    leans and turns, and it is what stops this reading as a flat
                    picture. Kept light on purpose: a dark core reads as a
                    shadow behind the photograph rather than as an edge. */}
                <span
                  aria-hidden="true"
                  className="absolute -inset-px rounded-[1.4rem] bg-[linear-gradient(150deg,#fbf6ec_0%,#e7d9c1_42%,#c4a87f_100%)]"
                />
                <MosaicFace face={front} />
                <MosaicFace face={back} back />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- the desks ----------------

   A dozen offices is a list, and every site on the internet solves a list the
   same way: a row of pills with a tooltip hanging off it. This page already
   speaks in charts - compass roses, graticules, a latitude rail down the
   margin - so the offices are read the way you would read a chart instead.

   One side is the index: twelve desks, ordered west to east by clock, each
   with the time it is there right now. The other side is the chart, which
   swings to whichever desk you point at - the needle turns to the true bearing
   from the head office and the figure underneath is the real great-circle run.
   Hover to look, open to land in Google Maps. */

type Office = (typeof contactPage.offices)[number];

const R_EARTH = 6371;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance between two pins, in kilometres. */
const runTo = (a: Office, b: Office) => {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R_EARTH * Math.asin(Math.min(1, Math.sqrt(h)));
};

/** Initial bearing from a to b, in degrees clockwise from true north. */
const bearingTo = (a: Office, b: Office) => {
  const dLon = rad(b.lon - a.lon);
  const y = Math.sin(dLon) * Math.cos(rad(b.lat));
  const x =
    Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) -
    Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(dLon);
  return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
};

const coords = (o: Office) =>
  `${Math.abs(o.lat).toFixed(2)}°${o.lat < 0 ? "S" : "N"} ${Math.abs(o.lon).toFixed(
    2
  )}°${o.lon < 0 ? "W" : "E"}`;

/* The chart panel leans inside its own perspective, and the reading floats
   26px in front of the glass. That lift magnifies it by P / (P - Z), so the
   text was being rendered at 1x and then blown up ~1.9% - the reason the whole
   panel read soft. The inverse scale cancels the magnification exactly and
   leaves the parallax intact. */
const CHART_PERSPECTIVE = 1400;
const CHART_LIFT = 26;
const READING = {
  transform: `translateZ(${CHART_LIFT}px) scale(${(
    1 -
    CHART_LIFT / CHART_PERSPECTIVE
  ).toFixed(5)})`,
};

/* The chart itself. The rose is drawn once; only the needle moves. */
function Rose({ heading }: { heading: number }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      shapeRendering="geometricPrecision"
      className="h-full w-full text-brown"
    >
      <g opacity="0.5">
        <circle cx="200" cy="200" r="196" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="152" stroke="currentColor" strokeWidth="1" />
        <circle
          cx="200"
          cy="200"
          r="104"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 7"
        />
        {Array.from({ length: 72 }).map((_, i) => (
          <line
            key={i}
            x1="200"
            y1="6"
            x2="200"
            y2={i % 9 === 0 ? 26 : i % 3 === 0 ? 18 : 12}
            stroke="currentColor"
            strokeWidth={i % 9 === 0 ? 1.6 : 1}
            transform={`rotate(${i * 5} 200 200)`}
          />
        ))}
      </g>

      {["N", "E", "S", "W"].map((c, i) => (
        <text
          key={c}
          x="200"
          y="56"
          textAnchor="middle"
          className="fill-brown/55 font-heading"
          fontSize="19"
          fontWeight="700"
          transform={`rotate(${i * 90} 200 200)`}
        >
          {c}
        </text>
      ))}

      {/* the needle - the only part of the chart that moves */}
      <g
        style={{
          transform: `rotate(${heading}deg)`,
          transformOrigin: "200px 200px",
          transformBox: "view-box",
          transition: "transform 1s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <path d="M200 68 L214 200 L200 213 L186 200 Z" className="fill-brown-deep" />
        <path d="M200 332 L186 200 L200 187 L214 200 Z" className="fill-brown/25" />
        <circle cx="200" cy="200" r="9" className="fill-cream" />
        <circle cx="200" cy="200" r="9" stroke="currentColor" strokeWidth="2" />
        <circle cx="200" cy="74" r="4.5" className="fill-brown-deep" />
      </g>
    </svg>
  );
}

function Chart({ office, head, now }: { office: Office; head: Office; now: Date }) {
  const { time, open } = deskState(office.tz, office.opens, office.closes, now);
  const isHead = office.key === head.key;
  const km = Math.round(runTo(head, office) / 10) * 10;
  const heading = isHead ? 0 : bearingTo(head, office);
  const tag = "tag" in office ? office.tag : undefined;

  return (
    <div
      onMouseMove={lean}
      onMouseLeave={level}
      className="group/chart"
      style={{ perspective: `${CHART_PERSPECTIVE}px` }}
    >
      {/* Polished glass, not paper: a warm base so the specular streak has
          something to read against, a lit top edge, and a white inner rim.
          No overflow-hidden on this panel - it would flatten the 3D and take
          the lean with it, so each layer carries its own radius instead. */}
      <div
        className="relative rounded-[1.75rem] p-7 shadow-[0_40px_80px_-52px_rgba(58,44,24,0.5),inset_0_1px_0_0_rgba(255,255,255,1)] ring-1 ring-brown/15 [transform-style:preserve-3d] [transform:rotateX(calc(var(--ty,0)*-5deg))_rotateY(calc(var(--tx,0)*7deg))] [transition:transform_.5s_ease-out,box-shadow_.5s_ease] hover:shadow-[0_60px_100px_-56px_rgba(58,44,24,0.62),inset_0_1px_0_0_rgba(255,255,255,1)] sm:p-9 xl:p-11"
        style={{
          background:
            "linear-gradient(155deg, #ffffff 0%, #fffdf8 34%, #f8f2e7 74%, #f2ead9 100%)",
        }}
      >
        {/* the rose is parked on the panel itself; the reading floats in front
            of it, so the two planes part as the chart leans */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]"
        >
          <div className="absolute -right-16 -top-14 h-[23rem] w-[23rem] opacity-[0.3] transition-opacity duration-500 group-hover/chart:opacity-[0.42] sm:-right-20 sm:h-[27rem] sm:w-[27rem] xl:-right-24 xl:h-[33rem] xl:w-[33rem]">
            <Rose heading={heading} />
          </div>
        </div>

        {/* a raked specular streak - a defined edge of light, not a haze */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
          style={{
            background:
              "linear-gradient(118deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 13%, rgba(255,255,255,0.08) 29%, transparent 46%)",
          }}
        />
        {/* the ambient the glass picks up off its own bottom corner */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
          style={{
            background:
              "radial-gradient(120% 90% at 88% 108%, rgba(122,92,62,0.11), transparent 56%)",
          }}
        />
        {/* bevel: a lit top edge and a white rim all the way round */}
        <span className="pointer-events-none absolute inset-x-10 top-px h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <span className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/70" />

      <div className="relative" style={READING}>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.3em] text-brown-soft">
            {office.region}
          </p>
          {tag && (
            <span className="rounded-full bg-brown px-2.5 py-[0.15rem] text-[0.5rem] font-bold uppercase tracking-[0.2em] text-cream">
              {tag}
            </span>
          )}
        </div>

        {/* keyed on the office, so the name re-runs its entrance on each change */}
        <h3
          key={office.key}
          className="mt-2 font-heading text-[clamp(2.1rem,4.2vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-ink"
          style={{ animation: "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          {office.city}
        </h3>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <p className="font-heading text-[clamp(2.4rem,4.6vw,4.2rem)] font-semibold leading-none tabular-nums text-brown-deep">
            {time}
          </p>
          <p className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em]">
            <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-forest" : "bg-ink-faint"}`} />
            <span className={open ? "text-forest" : "text-ink-faint"}>
              {open ? "at the desk" : "closed"}
            </span>
            <span className="font-medium tracking-[0.14em] text-ink-faint/80">
              {office.opens}:00-{office.closes}:00 local
            </span>
          </p>
        </div>

        <p className="mt-7 text-[0.62rem] uppercase tracking-[0.26em] text-brown-soft xl:text-[0.7rem]">
          {coords(office)}
        </p>
        <p
          key={`${office.key}-lines`}
          className="mt-2 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft xl:text-[1.08rem]"
          style={{ animation: "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.07s both" }}
        >
          {office.lines[0]}
          <br />
          {office.lines[1]}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={office.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="group/map inline-flex items-center gap-3 rounded-full bg-brown py-2.5 pl-6 pr-2.5 text-sm font-semibold text-cream xl:py-3 xl:pl-7 xl:text-[0.95rem] shadow-[0_18px_36px_-16px_rgba(122,92,62,0.8)] transition-colors hover:bg-brown-deep"
          >
            Open in Google Maps
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-brown transition-transform duration-300 group-hover/map:rotate-45">
              <Arrow className="h-4 w-4" />
            </span>
          </a>

          {/* the run from the head office - measured, not decorative */}
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ink-faint">
            {isHead ? (
              "The desk this page is written from"
            ) : (
              <>
                {km.toLocaleString("en-AU")} km from {head.city}
                <span className="mx-2 text-brown/35">/</span>
                bearing {Math.round(heading)}
                {"°"}
              </>
            )}
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}

/* One line of the index - kept to a single tight line so all twelve desks sit
   on the screen at once. Pointing at it swings the chart; opening it opens
   Google Maps in a new tab. */
function DeskRow({
  office,
  now,
  active,
  onPoint,
}: {
  office: Office;
  now: Date;
  active: boolean;
  onPoint: () => void;
}) {
  const { time, open } = deskState(office.tz, office.opens, office.closes, now);

  return (
    <a
      href={office.maps}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onPoint}
      onFocus={onPoint}
      aria-label={`${office.city} - ${office.lines.join(", ")} - opens in Google Maps`}
      onMouseMove={lean}
      onMouseLeave={level}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border py-3 pl-4 pr-3.5 outline-none [--lift:0px] [transform-style:preserve-3d] [transform:rotateX(calc(var(--ty,0)*-8deg))_rotateY(calc(var(--tx,0)*10deg))_translateZ(var(--lift))] [transition:transform_.45s_ease-out,box-shadow_.45s_ease,background-color_.4s,border-color_.4s] hover:[--lift:22px] focus-visible:[--lift:22px] xl:py-3.5 xl:pl-5 ${
        active
          ? "border-brown/30 bg-[#fffdf8] shadow-[0_24px_40px_-26px_rgba(58,44,24,0.6)]"
          : "border-brown/12 bg-cream/60 shadow-[0_10px_20px_-18px_rgba(58,44,24,0.55)] hover:border-brown/25 hover:bg-[#fffdf8]"
      }`}
    >
      {/* the edge that lights up beside the desk you are pointing at */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-1.5 left-0 w-[3px] origin-center rounded-full bg-gradient-to-b from-brown-soft via-brown to-brown-deep transition-transform duration-400 ease-out ${
          active ? "scale-y-100" : "scale-y-0"
        }`}
      />
      {/* a sheen that travels the card as it lifts */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-6 -left-1/3 w-1/4 -rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.75),transparent)] opacity-0 transition-[left,opacity] duration-[900ms] ease-out group-hover:left-[125%] group-hover:opacity-100"
      />

      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-400 ${
          open ? "bg-forest" : "bg-brown/25"
        }`}
        title={open ? "At the desk now" : "Closed - notes still land"}
      />

      <span
        className={`min-w-0 flex-1 truncate font-heading text-[0.95rem] font-semibold leading-tight transition-colors duration-300 xl:text-[1.12rem] ${
          active ? "text-brown-deep" : "text-ink"
        }`}
      >
        {office.city}
      </span>

      <span
        className={`shrink-0 font-heading text-[0.85rem] font-semibold tabular-nums transition-colors duration-300 xl:text-[1rem] ${
          active ? "text-brown-deep" : "text-ink-faint"
        }`}
      >
        {time}
      </span>

      <Arrow
        className={`h-3 w-3 shrink-0 -rotate-45 text-brown transition-all duration-300 xl:h-3.5 xl:w-3.5 ${
          active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
        }`}
      />
    </a>
  );
}

/* ---------------- page ---------------- */

export default function Contact() {
  const [now, setNow] = useState(() => new Date());
  const [headRef, headShown] = useReveal<HTMLElement>();
  const [bodyRef, bodyShown] = useReveal<HTMLDivElement>();
  const [hubRef, hubShown] = useReveal<HTMLElement>();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const headAt = Math.max(
    0,
    contactPage.offices.findIndex((o) => o.key === "melbourne")
  );
  const head = contactPage.offices[headAt];
  const [pointed, setPointed] = useState(headAt);
  const melbourne = deskState(head.tz, head.opens, head.closes, now);

  const groups = useMemo(
    () =>
      ["Australia", "International"].map((name) => ({
        name,
        offices: contactPage.offices.filter((o) => o.group === name),
      })),
    []
  );
  const openNow = contactPage.offices.filter(
    (o) => deskState(o.tz, o.opens, o.closes, now).open
  ).length;

  return (
    <main className="min-h-dvh bg-cream">
      <Navbar variant="solid" />

      {/* ==================== masthead: the exchange ====================
           A contact page can show something no other page can - what an
           answer actually looks like. So the hero is not a picture with a
           caption, it is a short piece of correspondence, typeset the way a
           magazine sets an interview. The photograph gets its own full-bleed
           band underneath, where it has room to be cinematic. */}
      <section ref={headRef} className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(85% 70% at 10% 0%, #fffefb 0%, #f8f5ef 52%, #eee6d9 100%)",
          }}
        />

        <div className="shell relative pt-28 sm:pt-36">
          {/* dateline - eyebrow, live desk time and the script accent on one rule */}
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-b border-brown/20 pb-4"
            style={rise(headShown, 0)}
          >
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.32em] text-brown">
              {contactPage.eyebrow}
              <span className="mx-3 text-brown/35">/</span>
              <span className="text-ink-soft">
                Melbourne <span className="tabular-nums text-ink">{melbourne.time}</span>
              </span>
              <span className="mx-3 text-brown/35">/</span>
              <span className={melbourne.open ? "text-forest" : "text-ink-faint"}>
                {melbourne.open ? "at the desk" : "read first thing"}
              </span>
            </p>
            <span className="-rotate-2 font-script text-xl text-brown-soft sm:text-2xl">
              {contactPage.script}
            </span>
          </div>

          <div className="grid gap-14 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pb-24 lg:pt-16">
            {/* the statement */}
            <div>
              <h1 className="font-heading text-[clamp(2.9rem,8.2vw,6rem)] font-bold leading-[0.92] tracking-[-0.035em] text-ink">
                {contactPage.heading[0]}
                <br />
                <span className="relative inline-block text-brown-deep">
                  {contactPage.heading[1]}
                  {/* the blank the whole page is built around, drawn in */}
                  <svg
                    viewBox="0 0 320 12"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-2.5 w-full text-brown-soft sm:h-3"
                  >
                    <path
                      d="M2 8C60 2 130 11 200 5s100-2 118 2"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: 340,
                        strokeDashoffset: headShown ? 0 : 340,
                        transition:
                          "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1) 0.5s",
                      }}
                    />
                  </svg>
                </span>
              </h1>

              <p
                className="mt-9 max-w-md text-base leading-relaxed text-ink/80"
                style={rise(headShown, 2)}
              >
                {contactPage.copy}
              </p>

              <a
                href="#note"
                className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold text-brown transition-colors hover:text-brown-deep"
                style={rise(headShown, 3)}
              >
                Write yours
                <span className="grid h-9 w-9 place-items-center rounded-full border border-brown/30 transition-transform duration-300 group-hover:translate-y-1">
                  <Arrow className="h-4 w-4 rotate-90" />
                </span>
              </a>
            </div>

            {/* the exchange - correspondence, not a chat window: no bubbles,
                no avatars, just who spoke and what they said */}
            <figure
              className="relative self-end rounded-[1.75rem] bg-[#f2ebdf] p-7 ring-1 ring-brown/12 sm:rounded-[2rem] sm:p-10"
              style={rise(headShown, 1)}
            >
              <ol className="space-y-8">
                {contactPage.exchange.map((e, i) => (
                  <li
                    key={e.who}
                    className={i > 0 ? "border-l-2 border-brown/25 pl-5 sm:pl-7" : ""}
                    style={rise(headShown, 4 + i * 2)}
                  >
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.3em] text-brown-soft">
                      {e.who}
                    </p>
                    <p
                      className={`mt-2.5 text-[1.05rem] leading-relaxed sm:text-[1.18rem] ${
                        i > 0 ? "font-medium text-brown-deep" : "text-ink"
                      }`}
                    >
                      {e.line}
                    </p>
                  </li>
                ))}
              </ol>

              <figcaption
                className="mt-9 flex items-center gap-2.5 border-t border-brown/15 pt-5 text-[0.62rem] uppercase tracking-[0.22em] text-ink-faint"
                style={rise(headShown, 8)}
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-brown-soft" />
                {contactPage.exchangeNote}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ==================== the mosaic band, full bleed ==================== */}
      <section
        aria-label="Places these notes usually end up"
        className="relative bg-[linear-gradient(180deg,#efe9df_0%,#e6ddcf_50%,#efe9df_100%)]"
        style={rise(headShown, 6)}
      >
        <Mosaic />
      </section>

      {/* ==================== rail + correspondence ==================== */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div
          ref={bodyRef}
          className="shell grid gap-12 lg:grid-cols-[17rem_1fr] lg:gap-16 xl:gap-20"
        >
          {/* --- the rail: ways to reach a person --- */}
          <aside
            className="lg:sticky lg:top-28 lg:self-start"
            style={rise(bodyShown, 0)}
          >
            <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brown">
              Direct lines
            </h2>

            <div className="mt-5 flex flex-col divide-y divide-brown/12 border-y border-brown/12">
              <a
                href={footer.phone.href}
                className="group flex items-center gap-3 py-4 transition-colors hover:text-brown"
              >
                <Phone className="h-4 w-4 shrink-0 text-brown-soft" />
                <span className="text-[0.95rem] font-medium text-ink transition-colors group-hover:text-brown">
                  {footer.phone.label}
                </span>
              </a>
              <a
                href={footer.email.href}
                className="group flex items-center gap-3 py-4 transition-colors hover:text-brown"
              >
                <Mail className="h-4 w-4 shrink-0 text-brown-soft" />
                <span className="break-all text-[0.95rem] font-medium text-ink transition-colors group-hover:text-brown">
                  {footer.email.label}
                </span>
              </a>
              <a
                href={footer.address.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 py-4"
              >
                <Pin className="mt-0.5 h-4 w-4 shrink-0 text-brown-soft" />
                <span className="text-[0.95rem] leading-snug text-ink-soft transition-colors group-hover:text-brown">
                  {footer.address.lines[0]}
                  <br />
                  {footer.address.lines[1]}
                </span>
              </a>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-ink-soft">
              Prefer to talk it through? The phone reaches the same people who
              read the notes.
            </p>
          </aside>

          {/* --- the note, then what follows it --- */}
          <div>
            <div id="note" className="scroll-mt-28" style={rise(bodyShown, 1)}>
              <Note />
            </div>

            {/* what happens next - a real sequence, so it earns its numbers */}
            <div className="mt-16" style={rise(bodyShown, 2)}>
              <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brown">
                What happens next
              </h2>

              <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-brown/12 sm:grid-cols-3">
                {contactPage.steps.map((s) => (
                  <li key={s.n} className="bg-cream p-6">
                    <span className="font-heading text-sm font-bold tabular-nums text-brown-soft">
                      {s.n}
                    </span>
                    <h3 className="mt-3 font-heading text-lg font-semibold text-brown-deep">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* --- questions people actually ask --- */}
            <div className="mt-16" style={rise(bodyShown, 3)}>
              <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brown">
                Before you write
              </h2>

              <div className="mt-6 border-t border-brown/15">
                {contactPage.faq.map((f) => (
                  <details key={f.q} className="group border-b border-brown/15">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                      <span className="font-heading text-[1.05rem] font-semibold text-ink transition-colors group-hover:text-brown">
                        {f.q}
                      </span>
                      <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full border border-brown/25 text-brown transition-colors group-open:border-brown group-open:bg-brown group-open:text-cream">
                        <span className="absolute h-px w-3 bg-current" />
                        <span className="absolute h-3 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                      </span>
                    </summary>
                    <p className="max-w-xl pb-5 text-[0.95rem] leading-relaxed text-ink-soft">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== the desks, read as a chart ==================== */}
      <section
        ref={hubRef}
        className="relative overflow-hidden border-t border-brown/12 bg-cream-deep/50 py-20 sm:py-28"
      >
        {/* graticule, faded out downward - the same ruling the rest of the site
            draws its maps on */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 118px, rgba(122,92,62,0.08) 118px 119px), repeating-linear-gradient(0deg, transparent 0 118px, rgba(122,92,62,0.08) 118px 119px)",
            maskImage: "linear-gradient(180deg, #000, transparent 78%)",
            WebkitMaskImage: "linear-gradient(180deg, #000, transparent 78%)",
          }}
        />

        <div className="shell relative">
          <div
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
            style={rise(hubShown, 0)}
          >
            <div className="max-w-xl xl:max-w-2xl">
              <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brown xl:text-[0.7rem]">
                Where we sit
              </h2>
              <p className="mt-4 font-heading text-[clamp(1.8rem,3.3vw,3.3rem)] font-semibold leading-[1.08] tracking-tight text-ink">
                Twelve desks, eight time zones.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink/75 xl:text-[1.1rem]">
                Five across Australia and seven more from Toronto to Hong Kong,
                each listed west to east by its own clock. Point at a desk to
                swing the chart onto it; open it to land on the map.
              </p>
            </div>

            {/* the live count, which is the reason for listing them at all */}
            <p
              aria-live="polite"
              className="flex shrink-0 items-center gap-3 self-start rounded-full border border-brown/15 bg-cream/70 px-5 py-2.5 lg:self-auto"
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  openNow ? "bg-forest" : "bg-ink-faint"
                }`}
              />
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-ink xl:text-[0.76rem]">
                {openNow > 0 ? `${openNow} at the desk right now` : "Every desk closed"}
              </span>
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-20">
            {/* --- the chart --- */}
            <div style={rise(hubShown, 1)}>
              <Chart office={contactPage.offices[pointed]} head={head} now={now} />
            </div>

            {/* --- the index: both groups side by side, so every desk is on
                    the screen at once and nothing has to be scrolled for --- */}
            <div
              className="grid gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-x-10"
              style={rise(hubShown, 2)}
            >
              {groups.map((group) => (
                <div key={group.name}>
                  <div className="flex items-center gap-3 border-b border-brown/25 pb-2.5 pl-4">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-brown xl:text-[0.7rem]">
                      {group.name}
                    </p>
                    <span className="h-px flex-1 bg-brown/15" />
                    <p className="text-[0.58rem] tabular-nums uppercase tracking-[0.18em] text-ink-faint xl:text-[0.7rem]">
                      {String(group.offices.length).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-col gap-2 xl:gap-2.5">
                    {group.offices.map((o, j) => {
                      const i = contactPage.offices.indexOf(o);
                      return (
                        <div
                          key={o.key}
                          className="[perspective:800px]"
                          style={
                            hubShown
                              ? {
                                  animation:
                                    "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
                                  animationDelay: `${0.24 + j * 0.055}s`,
                                }
                              : { opacity: 0 }
                          }
                        >
                          <DeskRow
                            office={o}
                            now={now}
                            active={i === pointed}
                            onPoint={() => setPointed(i)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

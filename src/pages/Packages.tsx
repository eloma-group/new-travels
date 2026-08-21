import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "../components/Link";
import { Arrow, Calendar, Check, ChevronRight, Pin, Plane, Search, Star } from "../icons";
import {
  AIRPORTS,
  MONTHS,
  cityAliases,
  packages,
  packagesPage,
  type Pkg,
} from "../data";
import { loadWorld, searchWorld, worldReady } from "../world";

/* ------------------------------------------------------------------
   The departure board.

   A packages page is a list, and a list is where most travel sites
   stop trying. So this one is built the other way round: the hero is
   a lit board of routes that is already showing you four of them, the
   console underneath rides with you down the page instead of scrolling
   away, and each card holds the whole journey - route, window, group
   size, what is actually in it - one hover deep, so nobody has to open
   sixteen tabs to compare two trips.
   ------------------------------------------------------------------ */

const ANY = "";
const SHORT = MONTHS.map((m) => m.slice(0, 3));
const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Pointer tilt is for mice. Touch gets the same card, held flat. */
const fine = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

function useReveal<T extends HTMLElement>(threshold = 0.12) {
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
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, shown] as const;
}

const rise = (shown: boolean, i: number): React.CSSProperties =>
  shown
    ? {
        animation: "fade-up 0.85s cubic-bezier(0.22,1,0.36,1) both",
        animationDelay: `${i * 0.08}s`,
      }
    : { opacity: 0 };

/** "Oct - Mar" when the window runs unbroken, otherwise the months themselves. */
function season(months: number[]) {
  const run = months.every((m, i) => i === 0 || m === (months[i - 1] % 12) + 1);
  return run && months.length > 2
    ? `${SHORT[months[0] - 1]} - ${SHORT[months[months.length - 1] - 1]}`
    : months.map((m) => SHORT[m - 1]).join(", ");
}

/* ---------------- the console's fields ---------------- */

type Opt = { value: string; label: string; terms?: string[] };
type Group = { label?: string; options: Opt[] };

const Chevron = ({ open }: { open: boolean }) => (
  <ChevronRight
    className={`h-4 w-4 shrink-0 text-brown-soft transition-transform duration-300 ${
      open ? "-rotate-90" : "rotate-90"
    }`}
  />
);

/** A select, rebuilt - because the native one cannot carry a live count
 *  of what is left behind each choice, and that count is the whole point. */
function Field({
  label,
  icon,
  value,
  groups,
  count,
  onChange,
  compact,
  search,
  world,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  groups: Group[];
  count: (value: string) => number;
  onChange: (v: string) => void;
  compact: boolean;
  /** Placeholder for the type-ahead. Omitted on short lists (months). */
  search?: string;
  /** Fall back to the world index when the board has no match. */
  world?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [atlas, setAtlas] = useState(worldReady);
  const box = useRef<HTMLDivElement>(null);
  const entry = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  // Opening puts the caret in the box; closing forgets what was typed.
  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    if (search) requestAnimationFrame(() => entry.current?.focus());
    if (world && !atlas) loadWorld().then(() => setAtlas(true));
  }, [open, search, world, atlas]);

  const flat = groups.flatMap((g) => g.options);
  const set = value !== ANY;
  const current =
    flat.find((o) => o.value === value) ?? (set ? { value, label: value } : flat[0]);

  const q = query.trim().toLowerCase();
  const hits = (o: Opt) =>
    `${o.label} ${(o.terms ?? []).join(" ")}`.toLowerCase().includes(q);

  const shown = q
    ? groups
        .map((g) => ({ ...g, options: g.options.filter(hits) }))
        .filter((g) => g.options.length > 0)
    : groups;

  // Everywhere else on earth. Anything the board already covers - by its own
  // name or by one of the towns inside it - is dropped, so the same place is
  // never offered twice with two different answers.
  const covered = new Set(
    flat.flatMap((o) => [o.label, ...(o.terms ?? [])]).map((t) => t.toLowerCase())
  );
  const elsewhere =
    world && atlas ? searchWorld(q, 6, (n) => covered.has(n.toLowerCase())) : [];

  const first = shown[0]?.options[0];

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center gap-3 rounded-[18px] text-left transition-colors duration-200 ${
          compact ? "px-3 py-2" : "px-3.5 py-3"
        } ${open || set ? "bg-brown/[0.07]" : "hover:bg-brown/[0.05]"}`}
      >
        <span
          className={`grid shrink-0 place-items-center rounded-full text-brown ring-1 transition-colors ${
            compact ? "h-8 w-8" : "h-10 w-10"
          } ${set ? "bg-brown text-cream ring-brown" : "bg-brown/8 ring-brown/15"}`}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          {!compact && (
            <span className="block text-[0.55rem] font-bold uppercase tracking-[0.26em] text-brown-soft">
              {label}
            </span>
          )}
          <span
            className={`block truncate font-semibold ${
              set ? "text-brown-deep" : "text-ink"
            } ${compact ? "text-[0.8rem]" : "mt-0.5 text-sm"}`}
          >
            {current.label}
          </span>
        </span>
        <Chevron open={open} />
      </button>

      <div
        role="listbox"
        aria-label={label}
        className={`absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 origin-top overflow-y-auto overscroll-contain rounded-[22px] bg-white p-2 shadow-soft-lg ring-1 ring-brown/12 transition-all duration-200 ${
          open
            ? "max-h-80 scale-100 opacity-100"
            : "pointer-events-none max-h-0 scale-95 opacity-0"
        }`}
      >
        {search && (
          <div className="sticky top-0 z-10 -mx-2 -mt-2 mb-1 border-b border-brown/10 bg-white px-2 pb-2 pt-2">
            <div className="flex items-center gap-2 rounded-xl bg-brown/[0.06] px-3 py-2 ring-1 ring-brown/10 focus-within:ring-brown/35">
              <Search className="h-3.5 w-3.5 shrink-0 text-brown-soft" />
              <input
                ref={entry}
                type="text"
                value={query}
                tabIndex={open ? 0 : -1}
                placeholder={search}
                aria-label={`Search ${label.toLowerCase()}`}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  const pick = first?.value ?? elsewhere[0]?.name;
                  if (e.key !== "Enter" || !pick) return;
                  e.preventDefault();
                  onChange(pick);
                  setOpen(false);
                }}
                className="w-full min-w-0 bg-transparent text-sm font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-faint"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    entry.current?.focus();
                  }}
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brown/20 text-[0.6rem] leading-none text-brown-deep hover:bg-brown hover:text-cream"
                >
                  &#215;
                </button>
              )}
            </div>
          </div>
        )}

        {shown.length === 0 && elsewhere.length === 0 && q.length > 1 && (
          <p className="px-3 py-6 text-center text-sm text-ink-faint">
            {atlas ? <>Nothing called &ldquo;{query}&rdquo;.</> : <>Looking&hellip;</>}
          </p>
        )}

        {shown.map((g, gi) => (
          <div key={g.label ?? gi} className={gi > 0 ? "mt-1 border-t border-brown/10 pt-1" : ""}>
            {g.label && (
              <p className="px-3 pb-1 pt-2 text-[0.55rem] font-bold uppercase tracking-[0.26em] text-brown-soft">
                {g.label}
              </p>
            )}
            {g.options.map((o) => {
              const n = count(o.value);
              const on = o.value === value;
              return (
                <button
                  key={o.value || "any"}
                  type="button"
                  role="option"
                  tabIndex={open ? 0 : -1}
                  aria-selected={on}
                  disabled={n === 0 && !on}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-colors ${
                    on
                      ? "bg-brown text-cream"
                      : n === 0
                      ? "cursor-not-allowed text-ink-faint"
                      : "text-ink hover:bg-brown/[0.07]"
                  }`}
                >
                  <span className="truncate font-medium">{o.label}</span>
                  <span
                    className={`shrink-0 tabular-nums text-[0.7rem] ${
                      on ? "text-cream/70" : "text-ink-faint"
                    }`}
                  >
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
        ))}

        {elsewhere.length > 0 && (
          <div className={shown.length > 0 ? "mt-1 border-t border-brown/10 pt-1" : ""}>
            <p className="px-3 pb-1 pt-2 text-[0.55rem] font-bold uppercase tracking-[0.26em] text-brown-soft">
              Not on the board yet
            </p>
            {elsewhere.map((c) => (
              <button
                key={`${c.name}-${c.country}`}
                type="button"
                role="option"
                tabIndex={open ? 0 : -1}
                aria-selected={c.name === value}
                onClick={() => {
                  onChange(c.name);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-brown/[0.07]"
              >
                <span className="min-w-0 truncate">
                  <span className="font-medium">{c.name}</span>
                  <span className="ml-2 text-[0.72rem] text-ink-faint">{c.country}</span>
                </span>
                <span className="shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-brown-soft">
                  ask
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- the card ---------------- */

function Card({ p, i, shown }: { p: Pkg; i: number; shown: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const tilt = useRef(false);

  useEffect(() => {
    tilt.current = fine() && !reduced();
  }, []);

  const set = (k: string, v: string) => wrap.current?.style.setProperty(k, v);

  const move = (e: React.PointerEvent) => {
    if (!tilt.current || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    set("--rx", `${(0.5 - py) * 9}deg`);
    set("--ry", `${(px - 0.5) * 11}deg`);
  };

  const enter = () => tilt.current && set("--ty", "-10px");
  const leave = () => {
    set("--rx", "0deg");
    set("--ry", "0deg");
    set("--ty", "0px");
  };

  const off = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;

  return (
    <div
      ref={wrap}
      onPointerMove={move}
      onPointerEnter={enter}
      onPointerLeave={leave}
      className="group [perspective:1500px]"
      style={
        shown
          ? {
              animation: "float-in 0.75s cubic-bezier(0.22,1,0.36,1) both",
              animationDelay: `${Math.min(i, 11) * 0.06}s`,
            }
          : { opacity: 0 }
      }
    >
      <Link
        to="/contact"
        aria-label={`${p.name} - ${p.nights} nights from ${p.from}, from ${money(p.price)}`}
        className="relative flex h-[29rem] flex-col rounded-[28px] bg-white shadow-soft-md ring-1 ring-brown/12 transition-[box-shadow,transform] duration-300 ease-out group-hover:shadow-soft-lg group-hover:ring-brown/25 sm:h-[30rem] [transform-style:preserve-3d]"
        style={{
          transform:
            "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateY(var(--ty,0px))",
        }}
      >
        {/* ---- the photograph, and the whole journey one hover under it ---- */}
        <div className="relative h-[18rem] shrink-0 overflow-hidden rounded-t-[28px] sm:h-[19rem]">
          <img
            src={p.img}
            alt={p.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.14]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-ink/15" />

          {/* ---- the detail sheet ----
               A scrim, not a blur: the photograph keeps its edges and only
               loses its light. Five lines and nothing else - the leg, the
               three things you actually do, and when it runs. Everything a
               card is tempted to add here is already on the plate below. */}
          <div className="absolute inset-0 flex translate-y-5 flex-col justify-end p-6 opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,13,0.52)_0%,rgba(20,16,13,0.84)_44%,rgba(20,16,13,0.95)_100%)]"
            />

            <div className="relative">
              {/* the leg */}
              <div className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-white/80">
                {AIRPORTS[p.from] ?? p.from}
                <span className="relative h-px flex-1 origin-left scale-x-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.5)_0_4px,transparent_4px_9px)] transition-transform delay-150 duration-700 ease-out group-hover:scale-x-100">
                  <Plane className="absolute -top-2 right-0 h-4 w-4 translate-x-1 text-white" />
                </span>
                {p.to}
              </div>

              {/* the three things */}
              <ul className="mt-6 space-y-3.5">
                {p.highlights.slice(0, 3).map((h, n) => (
                  <li
                    key={h}
                    className="flex items-baseline gap-3 text-[0.88rem] leading-snug text-white opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-0 group-hover:opacity-100 [transform:translateX(-10px)]"
                    style={{ transitionDelay: `${0.2 + n * 0.09}s` }}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.5em] h-px w-2.5 shrink-0 bg-white/40"
                    />
                    {h}
                  </li>
                ))}
              </ul>

              {/* when it runs */}
              <p className="mt-6 flex items-center gap-3 border-t border-white/15 pt-4 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/55">
                {season(p.months)}
                <span aria-hidden="true" className="h-2.5 w-px bg-white/25" />
                {p.group}
              </p>
            </div>
          </div>
        </div>

        {/* ---- badges: siblings of the media, so they can stand off the card ---- */}
        <span
          className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-brown-deep shadow-soft-sm ring-1 ring-white/60 backdrop-blur-sm"
          style={{ transform: "translateZ(52px)" }}
        >
          {p.tag}
        </span>

        {p.was ? (
          <span
            className="pointer-events-none absolute right-4 top-4 rounded-full bg-brown-deep px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-cream shadow-soft-sm"
            style={{ transform: "translateZ(52px)" }}
          >
            Save {off}%
          </span>
        ) : (
          <span
            className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold text-brown-deep shadow-soft-sm ring-1 ring-white/60 backdrop-blur-sm"
            style={{ transform: "translateZ(52px)" }}
          >
            <Star className="h-3 w-3 text-brown-soft" />
            {p.rating.toFixed(1)}
          </span>
        )}

        {/* ---- the plate: name and price, always readable ---- */}
        <div
          className="flex flex-1 flex-col p-5"
          style={{ transform: "translateZ(26px)" }}
        >
          <p className="truncate text-[0.6rem] font-bold uppercase tracking-[0.24em] text-brown">
            {p.places}
          </p>

          <div className="mt-2 flex items-start justify-between gap-3">
            <h3 className="font-heading text-[1.15rem] font-bold leading-tight tracking-tight text-ink">
              {p.name}
            </h3>
            <span className="shrink-0 text-right leading-none">
              {p.was && (
                <s className="block text-[0.7rem] font-medium text-ink-faint">
                  {money(p.was)}
                </s>
              )}
              <b className="mt-1 block text-lg font-bold tabular-nums text-brown">
                {money(p.price)}
              </b>
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-brown/12 pt-3">
            <p className="truncate text-xs text-ink-soft">
              {p.nights} nights · from {p.from}
            </p>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brown/10 text-brown transition-all duration-300 group-hover:bg-brown group-hover:text-cream group-hover:rotate-45">
              <Arrow className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

      </Link>
    </div>
  );
}

/* ---------------- the hero board ---------------- */

const SLIDE_MS = 5200;

function Board() {
  const featured = useMemo(
    () =>
      packagesPage.featured
        .map((k) => packages.find((p) => p.key === k))
        .filter((p): p is Pkg => Boolean(p)),
    []
  );

  const [[at, prev], setAt] = useState<[number, number]>([0, 0]);
  const [held, setHeld] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (held || reduced()) return;
    const id = setTimeout(
      () => setAt(([c]) => [(c + 1) % featured.length, c]),
      SLIDE_MS
    );
    return () => clearTimeout(id);
  }, [at, held, featured.length]);

  // A hand's worth of parallax, written straight to CSS vars so moving the
  // mouse over a full-bleed photograph never re-renders the page.
  const drift = (e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || !fine() || reduced()) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--dx", `${((e.clientX - r.left) / r.width - 0.5) * -26}px`);
    el.style.setProperty("--dy", `${((e.clientY - r.top) / r.height - 0.5) * -18}px`);
  };

  return (
    <section
      ref={stage}
      onPointerMove={drift}
      onPointerLeave={() => {
        stage.current?.style.setProperty("--dx", "0px");
        stage.current?.style.setProperty("--dy", "0px");
      }}
      className="relative isolate overflow-hidden bg-ink"
    >
      <Navbar />

      {/* ---- the plates, wiped over one another top to bottom ---- */}
      {featured.map((p, n) => {
        const on = n === at;
        return (
          <div
            key={p.key}
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              zIndex: on ? 2 : n === prev ? 1 : 0,
              clipPath: on || n === prev ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
              transition: on ? "clip-path 1.25s cubic-bezier(0.76,0,0.24,1)" : "none",
            }}
          >
            <img
              src={p.img.replace("w=900", "w=2000")}
              alt=""
              loading={n === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-[6000ms] ease-out"
              style={{
                transform: `translate3d(var(--dx,0px), var(--dy,0px), 0) scale(${
                  on ? 1.14 : 1.04
                })`,
              }}
            />
          </div>
        );
      })}

      {/* ---- grade: dark enough to read on, warm enough to stay ours ---- */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3]"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,16,13,0.72) 0%, rgba(20,16,13,0.42) 34%, rgba(20,16,13,0.68) 72%, rgba(20,16,13,0.92) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3]"
        style={{
          background:
            "radial-gradient(120% 90% at 18% 42%, rgba(20,16,13,0.62) 0%, transparent 62%)",
        }}
      />
      {/* film grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
      {/* the board hands the page down to the cream below it */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-[4] h-40 bg-gradient-to-t from-cream via-cream/45 to-transparent"
      />

      <div className="shell relative z-10 pb-40 pt-32 sm:pb-44 sm:pt-40 lg:pb-48">
        {/* dateline */}
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-white/20 pb-4"
          style={rise(true, 0)}
        >
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.32em] text-gold-soft">
            {packagesPage.eyebrow}
            <span className="mx-3 text-white/30">/</span>
            <span className="text-white/70">India &amp; Australia</span>
            <span className="mx-3 text-white/30">/</span>
            <span className="text-white/70">2026 - 2027 departures</span>
          </p>
          <span className="-rotate-2 font-script text-xl text-gold-soft sm:text-2xl">
            {packagesPage.script}
          </span>
        </div>

        <div className="grid gap-12 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-16">
          {/* ---- the statement ---- */}
          <div>
            <h1 className="font-heading text-[clamp(2.6rem,7.4vw,5.4rem)] font-bold leading-[0.94] tracking-[-0.035em] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.35)]">
              <span className="block overflow-hidden">
                <span
                  className="block"
                  style={{ animation: "word-rise 1s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                  {packagesPage.heading[0]}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block bg-gradient-to-r from-gold-soft via-gold to-gold-deep bg-clip-text text-transparent"
                  style={{
                    animation: "word-rise 1s cubic-bezier(0.22,1,0.36,1) 0.12s both",
                  }}
                >
                  {packagesPage.heading[1]}
                </span>
              </span>
            </h1>

            <p
              className="mt-8 max-w-xl text-[0.98rem] leading-relaxed text-white/80"
              style={rise(true, 4)}
            >
              {packagesPage.copy}
            </p>

            <div
              className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6 border-t border-white/15 pt-7"
              style={rise(true, 5)}
            >
              {packagesPage.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-3xl font-bold tabular-nums text-white sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/55">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ---- the board: four routes, lit in turn ---- */}
          <div
            className="flex flex-col gap-2 self-end"
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            style={rise(true, 3)}
          >
            <p className="mb-1 text-[0.55rem] font-bold uppercase tracking-[0.3em] text-white/45">
              Now boarding
            </p>
            {featured.map((p, n) => {
              const on = n === at;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setAt(([c]) => [n, c])}
                  aria-pressed={on}
                  className={`group relative overflow-hidden rounded-2xl px-4 py-3 text-left transition-all duration-500 ${
                    on
                      ? "glass ring-1 ring-gold/60"
                      : "ring-1 ring-white/12 hover:bg-white/10 hover:ring-white/25"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-[3.4rem] shrink-0 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white/60 tabular-nums">
                      {AIRPORTS[p.from] ?? p.from}
                      <span className="mx-1 text-gold-soft">&#8594;</span>
                    </span>
                    <span className="w-[2.2rem] shrink-0 font-heading text-sm font-bold text-white">
                      {p.to}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.86rem] font-semibold text-white">
                        {p.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.68rem] text-white/55">
                        {p.nights} nights · {season(p.months)}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-[0.55rem] uppercase tracking-[0.16em] text-white/45">
                        from
                      </span>
                      <span className="block text-sm font-bold tabular-nums text-gold-soft">
                        {money(p.price)}
                      </span>
                    </span>
                  </span>

                  {on && !reduced() && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold"
                      style={{
                        animation: `hero-progress ${SLIDE_MS}ms linear both`,
                        animationPlayState: held ? "paused" : "running",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- the page ---------------- */

type Sort = "featured" | "low" | "high" | "name";

/** A route survives the console when it clears all three fields at once. */
const hit = (p: Pkg, f: string, d: string, m: string) =>
  (f === ANY || p.from === f) &&
  (d === ANY || p.country === d || p.dest === d) &&
  (m === ANY || p.months.includes(Number(m)));

const BY: Record<Sort, (a: Pkg, b: Pkg) => number> = {
  featured: (a, b) => b.rating - a.rating || a.price - b.price,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

const SORTS: { key: Sort; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "low", label: "Price low to high" },
  { key: "high", label: "Price high to low" },
  { key: "name", label: "Name (A-Z)" },
];

export default function Packages() {
  const [from, setFrom] = useState(ANY);
  const [dest, setDest] = useState(ANY);
  const [month, setMonth] = useState(ANY);
  const [sort, setSort] = useState<Sort>("featured");

  const [gridRef, gridShown] = useReveal<HTMLDivElement>(0.03);
  const [incRef, incShown] = useReveal<HTMLDivElement>();
  const [ctaRef, ctaShown] = useReveal<HTMLElement>();

  // The console collapses once it has left its own place at the top of the
  // list, so it can ride along without taking a third of the screen with it.
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  // Warm the world index once the page has settled, so the first person to
  // type into the console is not the one who waits for it.
  useEffect(() => {
    const id = setTimeout(loadWorld, 1200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), {
      rootMargin: "-96px 0px 0px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---- the option lists, built from the routes themselves ---- */
  const fromGroups: Group[] = useMemo(() => {
    const cities = (c: Pkg["country"]) =>
      [...new Set(packages.filter((p) => p.country !== c).map((p) => p.from))]
        .sort()
        .map((v) => ({
          value: v,
          label: v,
          terms: [AIRPORTS[v] ?? "", ...(cityAliases[v] ?? [])],
        }));
    return [
      { options: [{ value: ANY, label: packagesPage.anyFrom }] },
      { label: "Australia", options: cities("Australia") },
      { label: "India", options: cities("India") },
    ];
  }, []);

  const destGroups: Group[] = useMemo(() => {
    // A region is searchable by every town inside it - nobody types
    // "Queensland Coast" when what they mean is Cairns.
    const regions = (c: Pkg["country"]) =>
      [...new Set(packages.filter((p) => p.country === c).map((p) => p.dest))]
        .sort()
        .map((v) => ({
          value: v,
          label: v,
          terms: packages
            .filter((p) => p.dest === v)
            .flatMap((p) => [...p.places.split(", "), p.to, p.name]),
        }));
    return [
      { options: [{ value: ANY, label: packagesPage.anyDest }] },
      {
        label: "India",
        options: [
          { value: "India", label: "Anywhere in India", terms: ["india", "in"] },
          ...regions("India"),
        ],
      },
      {
        label: "Australia",
        options: [
          { value: "Australia", label: "Anywhere in Australia", terms: ["australia", "oz"] },
          ...regions("Australia"),
        ],
      },
    ];
  }, []);

  const monthGroups: Group[] = useMemo(
    () => [
      { options: [{ value: ANY, label: packagesPage.anyMonth }] },
      {
        label: "Departure month",
        options: MONTHS.map((m, i) => ({ value: String(i + 1), label: m })),
      },
    ],
    []
  );

  /* ---- matching, and the counts each field shows against its options ---- */
  const results = useMemo(
    () => packages.filter((p) => hit(p, from, dest, month)).sort(BY[sort]),
    [from, dest, month, sort]
  );

  const countFrom = (v: string) => packages.filter((p) => hit(p, v, dest, month)).length;
  const countDest = (v: string) => packages.filter((p) => hit(p, from, v, month)).length;
  const countMonth = (v: string) => packages.filter((p) => hit(p, from, dest, v)).length;

  const active = [
    from && { label: from, clear: () => setFrom(ANY) },
    dest && { label: dest, clear: () => setDest(ANY) },
    month && { label: MONTHS[Number(month) - 1], clear: () => setMonth(ANY) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  // A city the search found in the world index rather than on the board.
  const offBoard = useMemo(() => {
    const served = (k: "from" | "dest") => new Set(packages.map((p) => p[k]));
    if (from && !served("from").has(from)) return `departures from ${from}`;
    if (dest && dest !== "India" && dest !== "Australia" && !served("dest").has(dest))
      return `journeys to ${dest}`;
    return "";
  }, [from, dest]);

  const reset = () => {
    setFrom(ANY);
    setDest(ANY);
    setMonth(ANY);
    setSort("featured");
  };

  return (
    <main className="min-h-dvh bg-cream">
      <Board />

      {/* ==================== console + the board itself ==================== */}
      <section className="relative pb-24 sm:pb-32">
        <div ref={sentinel} aria-hidden="true" className="h-px" />

        {/* ---- the console. Reset sits above the fields, where it can be
                reached without reading past the thing it undoes. Once it
                reaches the top of the screen the card gives way to a plain
                bar, so the page runs under a toolbar rather than under a
                floating panel wedged against the edge. ---- */}
        <div className="sticky top-0 z-30 -mt-24 sm:-mt-28">
          <div
            className={`transition-colors duration-300 ${
              stuck
                ? "border-b border-brown/12 bg-cream/85 shadow-soft-sm backdrop-blur-xl"
                : "border-b border-transparent"
            }`}
          >
            <div className="shell">
          <div
            className={`transition-all duration-300 ${
              stuck
                ? "py-2"
                : "rounded-[30px] bg-cream/92 p-2.5 shadow-soft-lg ring-1 ring-brown/12 backdrop-blur-xl sm:p-3"
            }`}
          >
            {/* header rail */}
            <div
              className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 transition-all duration-300 ${
                stuck ? "px-3 py-1.5" : "px-3 py-3 sm:px-4"
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2
                  className={`font-bold uppercase tracking-[0.3em] text-brown transition-all duration-300 ${
                    stuck ? "hidden sm:block sm:text-[0.55rem]" : "text-[0.62rem]"
                  }`}
                >
                  Find your journey
                </h2>
                <p className="text-xs text-ink-soft">
                  <b className="tabular-nums text-ink">{results.length}</b>
                  <span className="text-ink-faint"> / {packages.length}</span> routes
                  {active.length > 0 && (
                    <span className="text-ink-faint"> match</span>
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={reset}
                disabled={active.length === 0 && sort === "featured"}
                className="group inline-flex items-center gap-2 rounded-full border border-brown/25 px-3.5 py-1.5 text-[0.72rem] font-semibold text-brown transition-all duration-200 hover:border-brown hover:bg-brown hover:text-cream disabled:cursor-not-allowed disabled:border-brown/12 disabled:text-ink-faint disabled:hover:bg-transparent"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-500 group-enabled:group-hover:-rotate-180"
                >
                  <path
                    d="M20 12a8 8 0 1 1-2.5-5.8M20 4.5V10h-5.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Reset filters
              </button>
            </div>

            {/* fields */}
            <div className="grid gap-1 rounded-[24px] bg-white p-1.5 ring-1 ring-brown/10 sm:grid-cols-3 sm:divide-x sm:divide-brown/10">
              <Field
                label="Departing from"
                icon={<Plane className="h-4 w-4" />}
                value={from}
                groups={fromGroups}
                count={countFrom}
                onChange={setFrom}
                compact={stuck}
                search="Search any city"
                world
              />
              <Field
                label="Destination"
                icon={<Pin className="h-4 w-4" />}
                value={dest}
                groups={destGroups}
                count={countDest}
                onChange={setDest}
                compact={stuck}
                search="Search anywhere"
                world
              />
              <Field
                label="Month"
                icon={<Calendar className="h-4 w-4" />}
                value={month}
                groups={monthGroups}
                count={countMonth}
                onChange={setMonth}
                compact={stuck}
              />
            </div>

            {/* sort rail */}
            <div
              className={`no-scrollbar flex items-center gap-1 overflow-x-auto transition-all duration-300 ${
                stuck ? "max-h-0 overflow-hidden opacity-0" : "mt-2 max-h-16 px-1 opacity-100"
              }`}
            >
              <span className="shrink-0 pl-2 pr-2 text-[0.55rem] font-bold uppercase tracking-[0.26em] text-brown-soft">
                Sort
              </span>
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSort(s.key)}
                  aria-pressed={sort === s.key}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold transition-colors duration-200 ${
                    sort === s.key
                      ? "bg-brown text-cream"
                      : "text-ink-soft hover:bg-brown/[0.07] hover:text-ink"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
            </div>
          </div>
        </div>

        {/* ---- active filters, said back in plain words ---- */}
        {active.length > 0 && (
          <div className="shell mt-6 flex flex-wrap items-center gap-2">
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-brown-soft">
              Showing
            </span>
            {active.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={a.clear}
                className="group inline-flex items-center gap-2 rounded-full bg-brown/10 py-1.5 pl-3.5 pr-2.5 text-xs font-semibold text-brown-deep transition-colors hover:bg-brown/20"
              >
                {a.label}
                <span className="grid h-4 w-4 place-items-center rounded-full bg-brown/25 text-[0.6rem] leading-none text-brown-deep transition-colors group-hover:bg-brown group-hover:text-cream">
                  &#215;
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ---- the cards ---- */}
        <div ref={gridRef} className="shell mt-8 sm:mt-10">
          {results.length > 0 ? (
            <div
              key={`${from}|${dest}|${month}|${sort}`}
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-7"
            >
              {results.map((p, i) => (
                <Card key={p.key} p={p} i={i} shown={gridShown} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-lg rounded-[28px] bg-white p-10 text-center shadow-soft-md ring-1 ring-brown/12">
              <p className="font-script text-2xl text-brown-soft">
                {offBoard ? "not yet, anyway" : "nothing on that day"}
              </p>
              <h3 className="mt-3 font-heading text-2xl font-bold text-ink">
                {offBoard
                  ? `We do not run ${offBoard} yet.`
                  : "No route matches all three."}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">
                {offBoard
                  ? "It is not on the board today, which is not the same as no. Tell a planner the dates and the shape of the group and you will get a costed route back."
                  : "Loosen one of them - the month is usually the one worth moving - or tell us the window you have and we will build the route around it."}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full bg-brown px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brown-deep"
                >
                  Clear filters
                </button>
                <Link
                  to="/contact"
                  className="rounded-full border border-brown/30 px-5 py-2.5 text-sm font-semibold text-brown transition-colors hover:border-brown hover:bg-brown/[0.07]"
                >
                  Ask a planner
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== what every price already covers ==================== */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#efe9df_0%,#e6ddcf_52%,#efe9df_100%)] py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 84px, rgba(122,92,62,0.07) 84px 85px), repeating-linear-gradient(90deg, transparent 0 84px, rgba(122,92,62,0.07) 84px 85px)",
            maskImage: "radial-gradient(110% 90% at 50% 50%, #000 34%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(110% 90% at 50% 50%, #000 34%, transparent 82%)",
          }}
        />

        <div ref={incRef} className="shell relative">
          <div className="max-w-2xl" style={rise(incShown, 0)}>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brown">
              Inclusions
            </p>
            <h2 className="mt-4 font-heading text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.02] tracking-[-0.03em] text-brown-deep">
              {packagesPage.includesTitle}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink/80">
              {packagesPage.includesCopy}
            </p>
          </div>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-[28px] bg-brown/12 ring-1 ring-brown/12 sm:grid-cols-2 xl:grid-cols-4">
            {packagesPage.includes.map((it, i) => (
              <li
                key={it.title}
                className="group relative bg-cream p-7 transition-colors duration-300 hover:bg-white"
                style={rise(incShown, i + 1)}
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brown/10 text-brown transition-colors duration-300 group-hover:bg-brown group-hover:text-cream">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="font-heading text-[0.7rem] font-bold uppercase tracking-[0.22em] text-brown-soft tabular-nums">
                    0{i + 1}
                  </span>
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold leading-tight text-brown-deep">
                  {it.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{it.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ==================== not on the board ==================== */}
      <section ref={ctaRef} className="relative py-20 sm:py-28">
        <div className="shell">
          <div
            className="relative overflow-hidden rounded-[34px] bg-brown-deep px-8 py-14 text-cream shadow-soft-lg sm:px-14 sm:py-20"
            style={rise(ctaShown, 0)}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(230,182,115,0.22),transparent_68%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -left-20 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.10),transparent_66%)]"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <span className="-rotate-2 font-script text-xl text-brown-soft sm:text-2xl">
                  {packagesPage.cta.script}
                </span>
                <h2 className="mt-3 font-heading text-[clamp(2rem,4.8vw,3.4rem)] font-bold leading-[1] tracking-[-0.035em]">
                  {packagesPage.cta.heading[0]}
                  <br />
                  <span className="text-cream/70">{packagesPage.cta.heading[1]}</span>
                </h2>
              </div>

              <div style={rise(ctaShown, 2)}>
                <p className="text-[0.95rem] leading-relaxed text-cream/80">
                  {packagesPage.cta.copy}
                </p>
                <Link
                  to="/contact"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-cream py-2 pl-6 pr-2 text-sm font-semibold text-brown-deep transition-colors hover:bg-white"
                >
                  {packagesPage.cta.action}
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brown-deep text-cream transition-transform duration-300 group-hover:rotate-45">
                    <Arrow className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

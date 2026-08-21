import { useEffect, useRef, useState } from "react";
import { Arrow, Mail, Phone, Pin } from "../icons";
import { brand, footer } from "../data";
import Link from "./Link";

/* ------------------------------------------------------------------
   Brand glyphs - kept local; `icons.tsx` holds the site's stroke set.
   ------------------------------------------------------------------ */
type G = { className?: string };

const LinkedIn = ({ className }: G) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterX = ({ className }: G) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Facebook = ({ className }: G) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ className }: G) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTok = ({ className }: G) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-3.31v13.4a2.59 2.59 0 0 1-2.58 2.46 2.59 2.59 0 1 1 0-5.18c.27 0 .53.04.78.11V10.4a5.97 5.97 0 0 0-.78-.05A5.92 5.92 0 1 0 15.6 16.4V9.15a7.55 7.55 0 0 0 4.4 1.41V7.25a4.27 4.27 0 0 1-3.4-1.43z" />
  </svg>
);

const Threads = ({ className }: G) => (
  <svg className={className} viewBox="0 0 192 192" fill="currentColor" aria-hidden="true">
    <path d="M141.537 88.988a71 71 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.985 0-27.449 6.397-35.12 18.036l13.779 9.452c5.73-8.694 14.724-10.548 21.347-10.548h.23c8.25.053 14.475 2.451 18.504 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.141-23.82 1.372-39.134 15.265-38.105 34.569.522 9.792 5.4 18.216 13.735 23.719 7.048 4.652 16.124 6.927 25.558 6.412 12.457-.683 22.23-5.436 29.048-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.059-7.484-51.275-21.742-10.502-13.351-15.93-32.635-16.133-57.317.203-24.682 5.631-43.966 16.133-57.317 11.216-14.258 28.466-21.573 51.275-21.742 22.975.171 40.526 7.521 52.171 21.848 5.71 7.025 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.607-16.219-32.669C147.036 9.607 125.202.195 97.07 0h-.113C68.882.194 47.292 9.642 32.788 28.079 19.882 44.486 13.224 67.316 13.001 95.932L13 96l.001.068c.223 28.616 6.881 51.446 19.787 67.853C47.292 182.358 68.882 191.806 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.553ZM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735a90 90 0 0 1 5.79-.169c6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.519 28.713-23.802 29.274Z" />
  </svg>
);

/* Real brand colours - the group's footers use them across every site. */
const socials = [
  { Icon: LinkedIn, label: "LinkedIn", href: "#", bg: "#0A66C2" },
  { Icon: TwitterX, label: "X", href: "#", bg: "#000000" },
  { Icon: Facebook, label: "Facebook", href: "#", bg: "#1877F2" },
  {
    Icon: Instagram,
    label: "Instagram",
    href: "#",
    bg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
  },
  { Icon: TikTok, label: "TikTok", href: "#", bg: "#000000" },
  { Icon: Threads, label: "Threads", href: "#", bg: "#000000" },
];

/* ------------------------------------------------------------------
   The route divider.

   The plane used to be an HTML badge stepped along by CSS keyframes:
   eleven `left`/`top` stops, linearly interpolated. That is a polyline
   pretending to be a curve, with the bank angle snapping between ten
   fixed values - which is the vibration. It also animated layout
   properties, so every frame cost a reflow.

   Now it is what the Wander Index already does: an SVG silhouette on
   `animateMotion`, following the drawn path itself. That needs the arc
   to be measured rather than stretched - `preserveAspectRatio="none"`
   would squash the aeroplane along with it - so the viewBox tracks the
   divider's real size and the whole thing renders 1:1.
   ------------------------------------------------------------------ */

/* Top-down aeroplane, nose along +x so `rotate="auto"` aligns it to the arc. */
const PLANE =
  "M13,0 L3,-1 L-2,-10 L-4,-10 L-1,-1.2 L-8,-1 L-10,-4 L-11,-4 L-11,-0.6 L-12,0 L-11,0.6 L-11,4 L-10,4 L-8,1 L-1,1.2 L-4,10 L-2,10 L3,1 Z";

/* The same arc the divider always had, held as fractions of its box. */
const ARC = { x0: 0.005, y0: 0.958, cx1: 0.283, cx2: 0.717, cy: -0.042 };

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Deterministic star field - no hydration surprises, no random reflow. */
const STARS = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 13.7 + (i % 5) * 3.1) % 100,
  top: (i * 7.3 + (i % 3) * 11) % 62,
  size: i % 7 === 0 ? 2.5 : 1.5,
  dur: 4 + (i % 5) * 1.4,
  delay: -((i * 0.9) % 7),
}));

/* ------------------------------------------------------------------
   Pieces
   ------------------------------------------------------------------ */

function ColumnHeading({ label }: { label: string }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="h-3.5 w-[3px] rounded-full bg-brown-soft" />
      <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-cream">
        {label}
      </h3>
    </div>
  );
}

function Chip({
  as = "div",
  href,
  label,
  children,
}: {
  as?: "div" | "a";
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  const cls =
    "group/chip flex w-full items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-left transition-all duration-300 ease-lux hover:-translate-y-1 hover:border-brown-soft/55 hover:bg-brown-soft/15 hover:shadow-[0_14px_30px_-14px_rgba(160,125,84,0.55)]";
  const inner = (
    <>
      <span className="shrink-0 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-brown-soft">
        {label}
      </span>
      <span className="h-3 w-px shrink-0 bg-white/15" />
      <span className="text-[0.8rem] font-medium leading-snug text-cream/75 transition-colors group-hover/chip:text-cream">
        {children}
      </span>
    </>
  );

  return as === "a" ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function HubClock({
  city,
  region,
  tz,
  now,
  align,
}: {
  city: string;
  region: string;
  tz: string;
  now: Date;
  align: "start" | "end";
}) {
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz,
  }).format(now);

  return (
    <div className={align === "end" ? "text-right" : "text-left"}>
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-brown-soft">
        {region}
      </p>
      <p className="mt-1.5 font-heading text-lg font-semibold text-cream sm:text-xl">
        {city}
      </p>
      <p className="mt-0.5 text-xs tabular-nums text-cream/45">{time} local</p>
    </div>
  );
}

/* ------------------------------------------------------------------
   Footer
   ------------------------------------------------------------------ */

export default function Footer() {
  const [now, setNow] = useState(() => new Date());
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [reduce] = useState(reduced);

  // The divider's own pixel size, so the arc is drawn at 1:1.
  const routeRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 1200, h: 96 });

  useEffect(() => {
    const el = routeRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      const h = Math.round(e.contentRect.height);
      // Integers only: sub-pixel noise would re-key the plane mid-flight.
      setBox((b) => (b.w === w && b.h === h ? b : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = box;
  const hub = { x0: ARC.x0 * w, y0: ARC.y0 * h, x1: (1 - ARC.x0) * w, y1: ARC.y0 * h };
  const route = `M${hub.x0},${hub.y0} C${ARC.cx1 * w},${ARC.cy * h} ${ARC.cx2 * w},${
    ARC.cy * h
  } ${hub.x1},${hub.y1}`;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
    setEmail("");
  };

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#191210] text-cream"
      aria-labelledby="footer-cta"
    >
      {/* ---------- horizon: the cream page curves down into the night ---------- */}
      <svg
        className="absolute inset-x-0 top-0 z-10 h-[54px] w-full sm:h-[92px]"
        viewBox="0 0 1440 92"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* starts on the exact page cream so the seam with the section above vanishes,
            then warms as it sinks toward the curve */}
        <defs>
          <linearGradient id="footerHorizon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8f5ef" />
            <stop offset="55%" stopColor="#f5f1e8" />
            <stop offset="100%" stopColor="#efe7da" />
          </linearGradient>
        </defs>
        <path d="M0 0h1440v14C1144 66 900 92 720 92S296 66 0 14V0Z" fill="url(#footerHorizon)" />
      </svg>

      {/* ---------- ambient warmth + star field ---------- */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] opacity-70"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 0%, rgba(160,125,84,0.22) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-brown-soft"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animation: `star-breathe ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="shell relative z-10 pt-24 sm:pt-36">
        {/* ================= CTA band ================= */}
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <div>
            <span className="font-script text-2xl text-brown-soft sm:text-3xl">
              {footer.script}
            </span>
            <h2
              id="footer-cta"
              className="mt-3 font-heading text-[clamp(2rem,5.2vw,3.6rem)] font-semibold leading-[1.06] tracking-tight"
            >
              {footer.ctaHeading[0]}
              <br />
              <span className="bg-gradient-to-r from-brown-soft via-[#d8b98c] to-brown-soft bg-clip-text text-transparent">
                {footer.ctaHeading[1]}
              </span>
            </h2>
          </div>

          <div>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-cream/55">
              {footer.ctaCopy}
            </p>

            <form onSubmit={submit} className="mt-6 max-w-md">
              <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] p-1.5 pl-5 transition-colors focus-within:border-brown-soft/60">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={footer.ctaPlaceholder}
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-cream outline-none placeholder:text-cream/35"
                />
                <button
                  type="submit"
                  aria-label="Join the list"
                  className="group grid h-11 w-11 shrink-0 place-items-center rounded-full brass text-cream transition-transform duration-300 hover:scale-105"
                >
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </div>
              <p
                className="mt-3 text-xs text-cream/35"
                role={joined ? "status" : undefined}
              >
                {joined
                  ? "You're on the list - we'll write when the season turns."
                  : footer.ctaNote}
              </p>
            </form>
          </div>
        </div>

        {/* ================= route divider: hub → plane → hub ================= */}
        <div className="mt-16 sm:mt-20">
          <div ref={routeRef} className="relative h-16 sm:h-24">
            <svg
              className="absolute inset-0 h-full w-full overflow-visible text-brown-soft/45"
              viewBox={`0 0 ${w} ${h}`}
              aria-hidden="true"
            >
              <path
                id="footerRoute"
                d={route}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="2 10"
                strokeLinecap="round"
                style={{ animation: "route-flow 2.6s linear infinite" }}
              />
              <circle cx={hub.x0} cy={hub.y0} r="4" className="fill-brown-soft" />
              <circle cx={hub.x1} cy={hub.y1} r="4" className="fill-brown-soft" />

              {/* the plane rides the arc hub -> hub, on the path itself */}
              {!reduce && (
                <g key={`${w}x${h}`} className="fill-white">
                  <path d={PLANE} transform="scale(1)" />
                  <animateMotion
                    dur="11s"
                    repeatCount="indefinite"
                    rotate="auto"
                    keyPoints="0;1"
                    keyTimes="0;1"
                  >
                    <mpath href="#footerRoute" />
                  </animateMotion>
                </g>
              )}
            </svg>
          </div>

          <div className="mt-7 flex items-start justify-between gap-4">
            <HubClock {...footer.hubs[0]} now={now} align="start" />
            <HubClock {...footer.hubs[1]} now={now} align="end" />
          </div>
        </div>

        {/* ================= main grid ================= */}
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 lg:grid-cols-4 xl:grid-cols-[1.7fr_1fr_1fr_1fr_1fr] xl:gap-x-10">
          {/* ---- brand column ---- */}
          <div className="col-span-2 lg:col-span-4 xl:col-span-1">
            <a
              href="#home"
              aria-label={`${brand} home`}
              className="inline-flex items-center gap-2.5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/25">
                <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-brown-soft to-brown-deep" />
              </span>
              <span className="font-heading text-xl font-bold tracking-tight">{brand}</span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/45">
              {footer.tagline}
            </p>

            {/* direct lines */}
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={footer.phone.href}
                className="inline-flex w-fit items-center gap-2.5 text-sm text-cream/60 transition-colors hover:text-brown-soft"
              >
                <Phone className="h-4 w-4 shrink-0 text-brown-soft" />
                {footer.phone.label}
              </a>
              <a
                href={footer.email.href}
                className="inline-flex w-fit items-center gap-2.5 text-sm text-cream/60 transition-colors hover:text-brown-soft"
              >
                <Mail className="h-4 w-4 shrink-0 text-brown-soft" />
                {footer.email.label}
              </a>
            </div>

            {/* detail chips */}
            <div className="mt-5 flex max-w-sm flex-col gap-2.5">
              <a
                href={footer.address.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="group/chip flex items-center gap-2.5 rounded-xl border border-brown-soft/25 bg-brown-soft/10 px-3.5 py-2.5 transition-all duration-300 ease-lux hover:-translate-y-1 hover:border-brown-soft/60 hover:bg-brown-soft/20 hover:shadow-[0_14px_30px_-14px_rgba(160,125,84,0.55)]"
              >
                <Pin className="h-4 w-4 shrink-0 text-brown-soft" />
                <span className="text-[0.8rem] font-medium leading-snug text-cream/85">
                  {footer.address.lines[0]}
                  <br />
                  {footer.address.lines[1]}
                </span>
              </a>

              {footer.abn && (
                <Chip label="ABN">
                  <span className="tracking-wide">{footer.abn}</span>
                </Chip>
              )}

              <Chip label="Co.">
                {footer.company}
                <br />
                {footer.companyUnit}
              </Chip>
            </div>

            {/* socials */}
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map(({ Icon, label, href, bg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: bg }}
                  className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-300 ease-lux hover:-translate-y-1 hover:scale-105 hover:shadow-[0_14px_26px_-8px_rgba(0,0,0,0.55)]"
                >
                  <Icon className="h-[15px] w-[15px]" />
                </a>
              ))}
            </div>
          </div>

          {/* ---- link columns ---- */}
          {footer.columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <ColumnHeading label={col.heading} />
              <ul className="flex flex-col gap-3">
                {col.links.map((item) => {
                  const cls =
                    "inline-block text-[0.83rem] text-cream/45 transition-all duration-200 hover:translate-x-1 hover:text-cream";
                  return (
                    <li key={item.label}>
                      {item.href.startsWith("/") ? (
                        <Link to={item.href} className={cls}>
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          {...(item.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className={cls}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        {/* ================= protected by - EG Digital shield ================= */}
        <div className="mt-14 flex items-end justify-center sm:justify-end">
          <span className="pb-4 -mr-3.5 text-[0.69rem] font-bold uppercase tracking-[0.14em] text-cream/40">
            Protected by
          </span>
          <a
            href="https://egdigital.com.au/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="EG Digital"
            className="block leading-none opacity-90 transition-all duration-300 ease-lux hover:scale-105 hover:opacity-100"
          >
            <img
              src="/images/eg-digital-shield.gif"
              alt="EG Digital"
              loading="lazy"
              decoding="async"
              width={92}
              height={92}
              className="block h-[92px] w-auto"
            />
          </a>
        </div>

        {/* ================= divider with the group's centre dot ================= */}
        <div className="relative mt-4 h-px bg-white/10">
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brown-soft shadow-[0_0_12px_rgba(160,125,84,0.7)]" />
        </div>

        {/* ================= bottom bar ================= */}
        <div className="relative flex flex-col items-center gap-4 pb-9 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-cream/30">
            © {now.getFullYear()} {footer.company}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footer.legal.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-xs text-cream/30 transition-colors hover:text-brown-soft"
              >
                {l.label}
              </a>
            ))}
            <span className="hidden text-xs text-cream/12 sm:inline">|</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-cream/30">
              Developed by
              <a
                href="https://egdigital.com.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brown-soft transition-opacity hover:opacity-80"
              >
                EG Digital
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* ---------- oversized wordmark, clipped by the page edge ---------- */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="block translate-y-[0.3em] text-center font-heading text-[clamp(4rem,17vw,15rem)] font-black uppercase leading-none tracking-tight text-white/[0.035]">
          {brand}
        </span>
      </div>
    </footer>
  );
}

import { useRef } from "react";
import { showcase } from "../data";
import { Arrow, Check, Pin, Star } from "../icons";

// Drifting blossom petals — deterministic configs (no hydration surprises).
const PETALS = Array.from({ length: 18 }, (_, i) => {
  const fg = i >= 15; // last three drift in the foreground, softly blurred
  return {
    left: (i * 5.6 + (i % 3) * 4) % 100,
    size: (fg ? 16 : 8) + (i % 4) * 3,
    dur: 9 + (i % 6) * 1.8,
    delay: -((i * 1.9) % 13),
    color: ["#f6c6d5", "#efb0c4", "#f4d3c0", "#e79fbb", "#fbe0e7"][i % 5],
    sway: (i % 2 ? 1 : -1) * (28 + (i % 4) * 14),
    spin: (i % 2 ? 1 : -1) * (300 + (i % 5) * 60),
    opacity: fg ? 0.5 : 0.8,
    fg,
  };
});

type Petal = (typeof PETALS)[number];

function petalStyle(p: Petal): React.CSSProperties {
  return {
    left: `${p.left}%`,
    width: p.size,
    height: p.size,
    background: p.color,
    borderRadius: "50% 0 50% 50%",
    filter: p.fg ? "blur(1.2px)" : undefined,
    animation: `petal-fall ${p.dur}s linear ${p.delay}s infinite`,
    ["--petal-sway" as string]: `${p.sway}px`,
    ["--petal-spin" as string]: `${p.spin}deg`,
    ["--petal-opacity" as string]: p.opacity,
    ["--petal-fall" as string]: "780px",
  } as React.CSSProperties;
}

// pointer parallax → translate a layer by a per-element magnitude
const par = (x: number, y: number): React.CSSProperties => ({
  transform: `translate3d(calc(var(--mx,0) * ${x}px), calc(var(--my,0) * ${y}px), 0)`,
});

// Split the heading so the accent word carries the brown wordmark colour.
function Heading() {
  const [before, after] = showcase.heading.split(showcase.headingAccent);
  return (
    <h2 className="mx-auto max-w-3xl text-[clamp(1.9rem,3.6vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
      {before}
      <span className="text-brown">{showcase.headingAccent}</span>
      {after}
    </h2>
  );
}

export default function Showcase() {
  const panelRef = useRef<HTMLDivElement>(null);

  const move = (e: React.MouseEvent) => {
    const el = panelRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const reset = () => {
    const el = panelRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
  };

  return (
    <section id="app" className="relative overflow-hidden bg-cream py-24 sm:py-32">
      {/* ---------------- editorial header ---------------- */}
      <div className="shell text-center">
        <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.32em] text-forest">
          <span className="h-0.5 w-8 rounded-full bg-forest/70" />
          {showcase.eyebrow}
        </span>
        <div className="mt-5">
          <Heading />
        </div>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg">
          {showcase.sub}
        </p>
      </div>

      {/* ---------------- scene panel ---------------- */}
      <div className="shell mt-14">
        <div
          ref={panelRef}
          onMouseMove={move}
          onMouseLeave={reset}
          className="relative min-h-[40rem] overflow-hidden rounded-[2.5rem] shadow-soft-lg ring-1 ring-black/[0.06] sm:min-h-[46rem]"
        >
          {/* rich misty backdrop */}
          <img
            src={showcase.bg}
            alt="Misty traditional building with a tiled roof framed by red plum blossoms"
            className="absolute inset-0 h-full w-full object-cover object-[50%_34%]"
            loading="lazy"
          />
          {/* depth + legibility grading (kept light so the scene stays rich) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-forest-deep/25" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(39,76,53,0.4),transparent_60%)]" />
          {/* brand-tinted glows */}
          <div className="pointer-events-none absolute -left-16 top-8 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(58,106,74,0.28),transparent_70%)] blur-2xl" />
          <div className="pointer-events-none absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(122,92,62,0.22),transparent_70%)] blur-2xl" />

          {/* drifting petals — behind the phone */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {PETALS.filter((p) => !p.fg).map((p, i) => (
              <span key={i} className="absolute top-0 block" style={petalStyle(p)} />
            ))}
          </div>

          {/* ---------- floating glass feature cards ---------- */}
          {/* city pill — top */}
          <div
            className="absolute left-1/2 top-6 z-20 hidden items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-xs font-semibold text-ink shadow-soft-md backdrop-blur-md transition-transform duration-300 ease-out will-change-transform sm:flex"
            style={{ transform: "translate3d(calc(-50% + var(--mx,0) * 16px), calc(var(--my,0) * 8px), 0)" }}
          >
            <Pin className="h-3.5 w-3.5 text-forest" />
            Kyoto · Osaka · Nara
          </div>

          {/* visa speed — upper left */}
          <div
            className="absolute left-4 top-16 z-20 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-soft-md backdrop-blur-md transition-transform duration-300 ease-out will-change-transform sm:left-10 sm:top-24"
            style={par(28, 22)}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-forest-soft to-forest-deep text-white">
              <Check className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">Visa in ~5 days</p>
              <p className="text-[0.7rem] text-ink/60">Approved &amp; delivered</p>
            </div>
          </div>

          {/* remote — right */}
          <div
            className="absolute right-4 top-28 z-20 rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-soft-md backdrop-blur-md transition-transform duration-300 ease-out will-change-transform sm:right-12 sm:top-40"
            style={par(-24, 18)}
          >
            <p className="text-sm font-bold text-forest">100% remote</p>
            <p className="text-[0.7rem] text-ink/60">No embassy visits</p>
          </div>

          {/* rating — lower left */}
          <div
            className="absolute bottom-14 left-4 z-20 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-soft-md backdrop-blur-md transition-transform duration-300 ease-out will-change-transform sm:bottom-20 sm:left-14"
            style={par(22, -18)}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brown text-white">
              <Star className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">4.9 / 5</p>
              <p className="text-[0.7rem] text-ink/60">18k travellers</p>
            </div>
          </div>

          {/* ---------- the 3D phone, emerging from the scene ---------- */}
          <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-6 [perspective:2000px]">
            {/* grounding shadow */}
            <div className="absolute -bottom-2 left-1/2 h-10 w-[80%] -translate-x-1/2 rounded-[100%] bg-forest-deep/40 blur-2xl" />
            <div
              className="relative aspect-[9/19.3] w-[15rem] rounded-[2.8rem] bg-gradient-to-br from-[#3a3a3d] via-[#111114] to-[#0a0a0c] p-[0.45rem] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.6),0_12px_30px_-12px_rgba(0,0,0,0.45)] ring-1 ring-white/10 [transition:transform_.3s_ease-out] will-change-transform sm:w-[17rem]"
              style={{
                transform:
                  "rotateX(calc(2deg + var(--my,0) * -7deg)) rotateY(calc(var(--mx,0) * 12deg))",
              }}
            >
              {/* side buttons */}
              <div className="absolute -left-[3px] top-24 h-14 w-[3px] rounded-l bg-gradient-to-b from-neutral-500 to-neutral-700" />
              <div className="absolute -right-[3px] top-32 h-20 w-[3px] rounded-r bg-gradient-to-b from-neutral-500 to-neutral-700" />

              {/* screen */}
              <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-white">
                <div className="absolute left-1/2 top-2.5 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

                <div className="flex h-full flex-col">
                  {/* image hero */}
                  <div className="relative flex-[1.5] overflow-hidden">
                    <img src={showcase.appPhoto} alt="" className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/20 to-black/25" />

                    {/* top bar */}
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-7 text-[0.6rem] font-semibold tracking-[0.16em] text-white/90">
                      <span>{showcase.brand}</span>
                      <span>MENU</span>
                    </div>

                    {/* headline + CTA */}
                    <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
                      <h3 className="text-[1.05rem] font-extrabold leading-tight text-white">{showcase.appHeadline}</h3>
                      <p className="mt-1 text-[0.66rem] text-white/80">{showcase.appSub}</p>
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-forest px-3.5 py-2.5 text-[0.72rem] font-bold text-white shadow-sm">
                        {showcase.cta}
                        <Arrow className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* price row */}
                  <div className="flex items-center justify-between bg-white px-4 py-3.5">
                    <div>
                      <p className="text-[0.58rem] font-medium uppercase tracking-wide text-neutral-400">
                        {showcase.priceNote}
                      </p>
                      <p className="text-[0.95rem] font-bold text-ink">
                        {showcase.price} <span className="text-[0.62rem] font-medium text-neutral-400">{showcase.priceUnit}</span>
                      </p>
                      <p className="mt-0.5 text-[0.58rem] text-neutral-400">{showcase.discount}</p>
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brown/10 text-brown">
                      <Star className="h-4 w-4" />
                    </span>
                  </div>

                  {/* city ticker */}
                  <div className="overflow-hidden bg-forest-deep py-2">
                    <div
                      className="flex w-max whitespace-nowrap text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/90"
                      style={{ animation: "ticker 16s linear infinite" }}
                    >
                      {[...showcase.ticker, ...showcase.ticker, ...showcase.ticker].map((c, i) => (
                        <span key={i} className="mx-3 flex items-center gap-3">
                          {c} <span className="text-forest-soft">•</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* glass reflection */}
                <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] bg-gradient-to-tr from-transparent via-white/5 to-white/20" />
              </div>
            </div>
          </div>
          {/* foreground petals — drifting in front for depth */}
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
            {PETALS.filter((p) => p.fg).map((p, i) => (
              <span key={i} className="absolute top-0 block" style={petalStyle(p)} />
            ))}
          </div>
        </div>

        {/* ---------------- CTA row under the panel ---------------- */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <a
            href="#book"
            className="group inline-flex items-center gap-3 rounded-full bg-forest py-3 pl-7 pr-3 text-sm font-semibold text-cream shadow-[0_18px_36px_-16px_rgba(39,76,53,0.7)] transition-colors hover:bg-forest-deep"
          >
            {showcase.cta}
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-forest transition-transform duration-300 group-hover:rotate-45">
              <Arrow className="h-4 w-4" />
            </span>
          </a>
          <p className="text-sm text-ink/70">
            From <span className="font-bold text-ink">{showcase.price}</span> per person · {showcase.discount.toLowerCase()}
          </p>
        </div>
      </div>
    </section>
  );
}

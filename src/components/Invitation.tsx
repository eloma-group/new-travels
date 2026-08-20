import { useEffect, useRef, useState } from "react";
import { invite } from "../data";
import { Arrow, Star } from "../icons";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// the landscape that shows through the letters - one photograph, each word
// cropped to its own band of it so the two lines read as a single view
const fill = (band: string): React.CSSProperties =>
  ({
    backgroundImage: `url("${invite.fill}")`,
    backgroundSize: "cover",
    backgroundPosition: `50% ${band}`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    "--band": band,
  }) as React.CSSProperties;

export default function Invitation() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [reduce] = useState(reduced);

  useEffect(() => {
    const el = sectionRef.current;
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

  // pointer parallax - the traveller leads, the wordmark and plates lag behind
  const move = (e: React.MouseEvent) => {
    const el = stageRef.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const rest = () => {
    stageRef.current?.style.setProperty("--px", "0");
    stageRef.current?.style.setProperty("--py", "0");
  };

  const enter = (name: string, delay: number): React.CSSProperties =>
    shown
      ? { animation: `${name} 1.05s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${delay}s` }
      : { opacity: 0 };

  // a word wipes up from its own baseline, then its photograph starts drifting
  const word = (delay: number): React.CSSProperties =>
    shown
      ? {
          animation:
            `word-rise 1.15s cubic-bezier(0.22,1,0.36,1) ${delay}s both` +
            (reduce ? "" : `, fill-pan 24s ease-in-out ${delay + 1.2}s infinite`),
        }
      : { opacity: 0 };

  return (
    <section
      ref={sectionRef}
      id="invitation"
      className="relative overflow-hidden bg-cream py-16 sm:py-20"
    >
      {/* ============ ambient: contour map, latitude rules, warm light, grain ============ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 82% at 50% 16%, #fffefb 0%, #faf7f1 42%, #ece4d7 100%)",
          }}
        />
        {/* contour rings - a topographic map read from far above */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at 18% 30%, transparent 0 46px, rgba(122,92,62,0.09) 46px 47px), repeating-radial-gradient(circle at 84% 72%, transparent 0 54px, rgba(122,92,62,0.08) 54px 55px)",
            maskImage: "radial-gradient(90% 70% at 50% 50%, transparent 26%, #000 82%)",
            WebkitMaskImage: "radial-gradient(90% 70% at 50% 50%, transparent 26%, #000 82%)",
          }}
        />
        {/* latitude rules, kept off the centre so the wordmark stays clean */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 96px, rgba(122,92,62,0.07) 96px 97px)",
            maskImage: "linear-gradient(90deg, #000, transparent 32%, transparent 68%, #000)",
            WebkitMaskImage:
              "linear-gradient(90deg, #000, transparent 32%, transparent 68%, #000)",
          }}
        />
        <div className="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(160,125,84,0.16),transparent_68%)]" />
        <div className="absolute -right-32 bottom-4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(122,92,62,0.14),transparent_68%)]" />
        <div
          className="absolute inset-0 opacity-[0.1] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
            backgroundSize: "140px 140px",
          }}
        />
      </div>

      {/* ---------------- vertical edge rails ---------------- */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-7 top-1/2 hidden whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-brown/45 [transform:translate(-50%,-50%)_rotate(-90deg)] xl:block"
      >
        Lat 27.2°N · Lon 78.0°E
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-7 top-1/2 hidden whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-brown/45 [transform:translate(50%,-50%)_rotate(90deg)] xl:block"
      >
        Chapter 03 · The invitation
      </span>

      <div className="shell relative">
        {/* ==================== top rail ==================== */}
        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-brown/20 pb-4"
          style={enter("fade-up", 0)}
        >
          <span className="-rotate-2 font-script text-2xl leading-none text-brown sm:text-[1.75rem]">
            {invite.script}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-brown/30 to-brown/5" />
          <span className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.3em] text-brown">
            <Star className="h-3 w-3" />
            {invite.eyebrow}
          </span>
        </div>

        {/* ==================== the wordmark stage ==================== */}
        <div
          ref={stageRef}
          onMouseMove={move}
          onMouseLeave={rest}
          className="group relative mt-8 sm:mt-10"
        >
          {/* ---------- flanking plates ---------- */}
          {invite.plates.map((pl, i) => {
            const left = i === 0;
            return (
              <div
                key={pl.key}
                className={`absolute bottom-[15%] hidden lg:block ${left ? "left-0" : "right-0"}`}
                style={enter(left ? "deck-in-left" : "deck-in-right", left ? 0.62 : 0.72)}
              >
                <a
                  href="#packages"
                  aria-label={`Explore ${pl.name}`}
                  className="group/plate block w-[clamp(7rem,10.5vw,11rem)] [transform:rotate(var(--r))_translate3d(calc(var(--px,0)*var(--drift)),calc(var(--py,0)*10px),0)] [transition:transform_.6s_ease-out] hover:[--r:0deg]"
                  style={
                    {
                      "--r": left ? "-5deg" : "5deg",
                      "--drift": left ? "-18px" : "18px",
                    } as React.CSSProperties
                  }
                >
                  <div className="rounded-[1.35rem] bg-gradient-to-b from-[#f7f1e6] to-[#e2d7c5] p-2 shadow-[0_28px_50px_-24px_rgba(58,44,24,0.6),inset_0_2px_2px_rgba(255,255,255,0.95)] ring-1 ring-brown/15 transition-shadow duration-500 group-hover/plate:shadow-[0_40px_66px_-26px_rgba(58,44,24,0.72)]">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1rem] shadow-[inset_0_2px_10px_rgba(58,44,24,0.45)]">
                      <img
                        src={pl.img}
                        alt={pl.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/plate:scale-[1.09]"
                      />
                      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.42),transparent_44%)]" />
                    </div>
                  </div>
                  {/* cut-crystal nameplate */}
                  <div className="crystal relative z-10 mx-auto -mt-3 w-[86%] overflow-hidden rounded-lg px-2 py-1.5 text-center transition-transform duration-500 group-hover/plate:-translate-y-0.5">
                    {/* bevelled top facet - the specular line that sells the glass */}
                    <span className="pointer-events-none absolute inset-x-2 top-px h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                    {/* raked light sweeping across the facet on hover */}
                    <span className="pointer-events-none absolute -inset-y-4 -left-1/3 w-1/4 -rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)] opacity-0 transition-[left,opacity] duration-[900ms] ease-out group-hover/plate:left-[125%] group-hover/plate:opacity-100" />
                    <p className="relative text-[0.72rem] font-semibold leading-tight text-brown-deep [text-shadow:0_1px_0_rgba(255,255,255,0.9)]">
                      {pl.name}
                    </p>
                    <p className="relative mt-0.5 text-[0.52rem] font-medium uppercase tracking-[0.18em] text-ink/60">
                      {pl.tag}
                    </p>
                  </div>
                </a>
              </div>
            );
          })}

          {/* ---------- the two words ---------- */}
          <div className="relative w-full pt-6 text-center [transform:translate3d(calc(var(--px,0)*-14px),calc(var(--py,0)*-8px),0)] [transition:transform_.5s_ease-out] sm:pt-10">
            <h2 className="sr-only">
              {invite.words[0]} {invite.words[1]}- {invite.tagline}
            </h2>

            <div className="overflow-hidden">
              <span
                aria-hidden="true"
                className="block font-heading text-[clamp(5.5rem,31vw,32rem)] font-bold uppercase leading-[0.8] tracking-[-0.05em] brightness-[1.18] saturate-[1.12] transition-[filter] duration-700 ease-out group-hover:brightness-[1.34] group-hover:saturate-[1.32]"
                style={{ ...fill("40%"), ...word(0.16) }}
              >
                {invite.words[0]}
              </span>
            </div>

            <div className="overflow-hidden">
              <span
                aria-hidden="true"
                className="block font-heading text-[clamp(1.9rem,10.4vw,10.5rem)] font-bold uppercase leading-[1.02] tracking-[0.08em] brightness-[1.18] saturate-[1.12] transition-[filter] duration-700 ease-out group-hover:brightness-[1.34] group-hover:saturate-[1.32]"
                style={{ ...fill("52%"), ...word(0.32) }}
              >
                {invite.words[1]}
              </span>
            </div>
          </div>

          {/* ---------- the traveller, cut out and standing in front ---------- */}
          <div className="pointer-events-none absolute bottom-[15%] left-1/2 -translate-x-1/2">
            <div style={enter("traveller-in", 0.5)}>
              <div className="relative [transform:translate3d(calc(var(--px,0)*26px),calc(var(--py,0)*12px),0)] [transition:transform_.55s_ease-out] group-hover:[transform:translate3d(calc(var(--px,0)*26px),calc(var(--py,0)*12px_-_16px),0)]">
                <img
                  src={invite.traveller}
                  alt="A traveller on a summit, arms raised to the sky"
                  loading="lazy"
                  className="relative h-[clamp(15rem,38vw,32rem)] w-auto [mask-image:linear-gradient(to_bottom,#000_58%,rgba(0,0,0,0.45)_78%,transparent_97%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_58%,rgba(0,0,0,0.45)_78%,transparent_97%)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================== editorial footer row ==================== */}
        <div className="mt-10 grid items-center gap-8 border-t border-brown/20 pt-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
          <p
            className="max-w-sm text-sm leading-relaxed text-ink/80 lg:text-base"
            style={enter("fade-up", 0.8)}
          >
            {invite.copy}
          </p>

          <p
            className="-rotate-2 text-center font-script text-[clamp(1.9rem,4.4vw,3.4rem)] leading-none text-brown"
            style={enter("fade-up", 0.86)}
          >
            {invite.tagline}
          </p>

          <div className="flex lg:justify-end" style={enter("fade-up", 0.92)}>
            <a
              href="#packages"
              className="group/cta inline-flex items-center gap-3 rounded-full bg-brown py-2.5 pl-7 pr-2.5 text-sm font-semibold text-cream shadow-[0_18px_36px_-16px_rgba(122,92,62,0.75)] transition-colors hover:bg-brown-deep"
            >
              {invite.cta}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-brown transition-transform duration-300 group-hover/cta:rotate-45">
                <Arrow className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>

        {/* ==================== the route book ==================== */}
        <div className="mt-10 border-t border-brown/20 pt-6" style={enter("fade-up", 0.98)}>
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.34em] text-brown/70">
            {invite.indexTitle}
          </p>

          <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl bg-brown/15 sm:grid-cols-2 lg:grid-cols-4">
            {invite.index.map((row) => (
              <li key={row.n}>
                <a
                  href="#packages"
                  className="group/row relative flex h-full items-baseline gap-3 bg-cream/85 px-5 py-5 transition-colors duration-500 hover:bg-[#f3ece0]"
                >
                  <span className="font-heading text-xs font-bold tracking-[0.16em] text-brown/45 transition-colors duration-500 group-hover/row:text-brown">
                    {row.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading text-lg font-bold leading-tight text-ink transition-transform duration-500 group-hover/row:translate-x-1 sm:text-xl">
                      {row.name}
                    </span>
                    <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.2em] text-ink-faint">
                      {row.coord}
                    </span>
                    <span className="mt-2 block text-xs text-ink/70">{row.note}</span>
                  </span>
                  <Arrow className="ml-auto h-3.5 w-3.5 shrink-0 self-center text-brown opacity-0 transition-all duration-500 group-hover/row:translate-x-0.5 group-hover/row:opacity-100" />
                  {/* a brown rule draws itself along the foot of the cell */}
                  <span className="pointer-events-none absolute inset-x-5 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-brown to-brown/0 transition-transform duration-500 ease-out group-hover/row:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

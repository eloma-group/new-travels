import { useEffect, useRef, useState } from "react";
import { wander } from "../data";
import { Arrow, Star } from "../icons";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// count a number up to `target` once `run` flips true
function useCountUp(target: number, run: boolean, dur = 1300) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reduced()) return setVal(target);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setVal(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, dur]);
  return val;
}

// per-portal 3D placement in the tilting deck: symmetric wrap-around toward centre
const depth: React.CSSProperties[] = [
  { transform: "translateZ(0px) rotateY(16deg)" }, //   far-left — furthest, most yawed
  { transform: "translateZ(30px) rotateY(9deg)" }, //   left     — yawed toward centre
  { transform: "translateZ(74px)" }, //                 center   — pushed forward (feature)
  { transform: "translateZ(30px) rotateY(-9deg)" }, //  right    — yawed toward centre
  { transform: "translateZ(0px) rotateY(-16deg)" }, //  far-right — furthest, most yawed
];

export default function Destination() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [reduce] = useState(reduced);

  // reveal-on-scroll
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
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // pointer parallax → --mx/--my on the deck (drives the group tilt)
  const move = (e: React.MouseEvent) => {
    const el = stageRef.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const rest = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
  };

  const reveal = (i: number): React.CSSProperties =>
    shown
      ? { animation: "fade-up 0.85s cubic-bezier(0.22,1,0.36,1) both", animationDelay: `${i * 0.09}s` }
      : { opacity: 0 };
  const pop = (delay: number): React.CSSProperties =>
    shown
      ? { animation: "float-in 0.95s cubic-bezier(0.22,1,0.36,1) both", animationDelay: `${delay}s` }
      : { opacity: 0 };

  const rating = useCountUp(4.9, shown);
  const places = useCountUp(120, shown);
  const travellers = useCountUp(18, shown);
  const counts = [rating.toFixed(1), `${Math.round(places)}+`, `${Math.round(travellers)}k`];

  return (
    <section
      ref={sectionRef}
      id="destination"
      className="relative overflow-hidden bg-cream py-24 sm:py-32"
    >
      {/* ============ ambient: cartographic backdrop (compass + graticule + grain) ============ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* warm radial wash for depth */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(125% 92% at 50% 32%, #fffdf9 0%, #f8f5ef 50%, #efe9df 100%)" }}
        />

        {/* faint map graticule (lat/long grid), faded toward the edges */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 84px, rgba(122,92,62,0.05) 84px 85px), repeating-linear-gradient(90deg, transparent 0 84px, rgba(122,92,62,0.05) 84px 85px)",
            maskImage: "radial-gradient(120% 95% at 50% 48%, #000 36%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(120% 95% at 50% 48%, #000 36%, transparent 80%)",
          }}
        />

        {/* ghosted compass-rose watermark behind the portals */}
        <svg
          viewBox="0 0 400 400"
          fill="none"
          className="absolute left-1/2 top-[54%] h-[44rem] w-[44rem] max-w-none -translate-x-1/2 -translate-y-1/2 text-brown"
          style={{ opacity: 0.08 }}
        >
          <circle cx="200" cy="200" r="197" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="200" cy="200" r="96" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 6" />
          {Array.from({ length: 72 }).map((_, i) => (
            <line
              key={i}
              x1="200"
              y1="3"
              x2="200"
              y2={i % 6 === 0 ? 18 : 10}
              stroke="currentColor"
              strokeWidth="0.9"
              transform={`rotate(${i * 5} 200 200)`}
            />
          ))}
          {[0, 90, 180, 270].map((a) => (
            <path key={a} d="M200 120 L220 191 L200 200 L180 191 Z" fill="currentColor" transform={`rotate(${a} 200 200)`} />
          ))}
          {[45, 135, 225, 315].map((a) => (
            <path key={a} d="M200 150 L207 193 L200 200 L193 193 Z" fill="currentColor" opacity="0.55" transform={`rotate(${a} 200 200)`} />
          ))}
          <circle cx="200" cy="200" r="6.5" fill="currentColor" />
        </svg>

        {/* warm corner glows */}
        <div className="absolute -left-40 -top-16 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(122,92,62,0.10),transparent_68%)]" />
        <div className="absolute -right-36 -bottom-12 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(160,125,84,0.13),transparent_68%)]" />

        {/* fine grain for tactile, printed-map depth */}
        <div
          className="absolute inset-0 opacity-[0.4] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
            backgroundSize: "140px 140px",
          }}
        />
      </div>

      <div className="shell relative">
        {/* ==================== centered header ==================== */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3" style={reveal(0)}>
            <span className="h-px w-8 bg-brown/40" />
            <span className="inline-block -rotate-3 font-script text-2xl text-brown sm:text-3xl">
              {wander.script}
            </span>
            <span className="h-px w-8 bg-brown/40" />
          </div>

          <p
            className="mt-3 text-xs font-bold uppercase tracking-[0.34em] text-brown"
            style={reveal(1)}
          >
            {wander.eyebrow}
          </p>

          <h2
            className="mt-4 text-balance text-[clamp(2.1rem,5.2vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink"
            style={reveal(2)}
          >
            {wander.heading[0]}{" "}
            <span className="inline-block bg-gradient-to-br from-brown-soft via-brown to-brown-deep bg-clip-text tracking-[-0.035em] text-transparent">
              {wander.heading[1]}
            </span>{" "}
            {wander.heading[2]}
          </h2>

          <p
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/80"
            style={reveal(3)}
          >
            {wander.copy}
          </p>
        </div>

        {/* ==================== 3D deck of arched portals ==================== */}
        <div
          ref={stageRef}
          onMouseMove={move}
          onMouseLeave={rest}
          className="mt-16 [perspective:1600px] sm:mt-20"
        >
          <div
            className="relative flex flex-col items-center justify-center gap-12 pt-20 [transform-style:preserve-3d] [transform:rotateX(calc(var(--my,0)*-5deg))_rotateY(calc(var(--mx,0)*9deg))] [transition:transform_.4s_ease-out] will-change-transform sm:flex-row sm:items-end sm:gap-6 sm:pt-28 lg:gap-9 xl:gap-12"
          >
            {/* flight route + aeroplane — floats forward in 3D, clear above the arches */}
            <div
              className="pointer-events-none absolute inset-x-0 top-1 hidden justify-center sm:flex"
              style={{ transform: "translateZ(96px)" }}
            >
              <svg
                viewBox="0 0 640 120"
                fill="none"
                className="h-24 w-[102%] max-w-none overflow-visible text-brown"
                style={{ opacity: shown ? 1 : 0, transition: "opacity .8s ease .4s" }}
              >
                <path
                  id="wanderRoute"
                  d="M30,104 C 150,-48 490,-48 610,104"
                  stroke="currentColor"
                  strokeOpacity="0.55"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="1 12"
                />
                <circle cx="30" cy="104" r="4" className="fill-brown" />
                <circle cx="610" cy="104" r="4" className="fill-brown" />
                {!reduce && (
                  <g className="fill-brown-deep">
                    {/* top-down aeroplane silhouette, nose along +x (rotate=auto aligns it) */}
                    <path
                      transform="scale(0.85)"
                      d="M13,0 L3,-1 L-2,-10 L-4,-10 L-1,-1.2 L-8,-1 L-10,-4 L-11,-4 L-11,-0.6 L-12,0 L-11,0.6 L-11,4 L-10,4 L-8,1 L-1,1.2 L-4,10 L-2,10 L3,1 Z"
                    />
                    <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1">
                      <mpath href="#wanderRoute" />
                    </animateMotion>
                  </g>
                )}
              </svg>
            </div>

            {wander.plates.map((p, i) => {
              const feature = i === 2;
              const edge = i === 0 || i === wander.plates.length - 1;
              return (
                <div key={p.key} style={depth[i]} className={`will-change-transform ${edge ? "hidden lg:block" : ""}`}>
                  <div style={pop(feature ? 0.05 : edge ? 0.24 : 0.18)}>
                    <a
                      href="#packages"
                      aria-label={`Explore ${p.name}, ${p.region}`}
                      className="group relative block will-change-transform transition-transform duration-500 ease-out hover:-translate-y-2 focus-visible:-translate-y-2"
                    >
                      {/* outer cabin wall panel — second frame */}
                      <div className="rounded-[46%/32%] bg-gradient-to-b from-[#ece3d4] to-[#d8ccb9] p-[0.6rem] shadow-[0_44px_74px_-32px_rgba(58,44,24,0.6),inset_0_2px_3px_rgba(255,255,255,0.8),inset_0_-3px_7px_rgba(122,92,62,0.25)] ring-1 ring-brown/15 sm:p-3">
                      {/* airplane cabin window — moulded plastic bezel */}
                      <div
                        className={`relative rounded-[44%/30%] bg-gradient-to-b from-[#f6f1e8] to-[#e5dccc] p-[0.9rem] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(122,92,62,0.2)] ring-1 ring-brown/10 sm:p-4 ${
                          feature
                            ? "h-[22rem] w-64 sm:h-[27rem] sm:w-72 lg:h-[31rem] lg:w-[21rem] xl:h-[34rem] xl:w-[23rem]"
                            : edge
                            ? "h-[14rem] w-40 sm:h-[16.5rem] sm:w-44 lg:h-[19rem] lg:w-52 xl:h-[21rem] xl:w-56"
                            : "h-[17rem] w-48 sm:h-[20rem] sm:w-52 lg:h-[23rem] lg:w-60 xl:h-[25rem] xl:w-64"
                        }`}
                      >
                        {/* recessed glass pane */}
                        <div className="relative h-full w-full overflow-hidden rounded-[42%/28%] shadow-[inset_0_3px_12px_rgba(58,44,24,0.6)]">
                          <img
                            src={p.img}
                            alt={`${p.name}, ${p.region}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          {/* cabin-dim + sky wash */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                          {/* raked glass reflection */}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent" />
                          {/* inner glass rim */}
                          <div className="pointer-events-none absolute inset-0 rounded-[42%/28%] ring-1 ring-inset ring-white/20" />
                          <span className="glass absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white">
                            {p.region}
                          </span>
                        </div>
                        {/* breather hole at the base of the pane */}
                        <span className="pointer-events-none absolute bottom-[1.35rem] left-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black/45 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.5)] sm:bottom-6" />
                      </div>
                      </div>

                      {/* engraved brass coordinate nameplate */}
                      <div className="brass relative z-10 mx-auto -mt-5 w-[86%] rounded-xl px-4 py-2 text-center text-cream transition-transform duration-500 group-hover:-translate-y-0.5">
                        <span className="absolute left-2.5 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-black/25" />
                        <span className="absolute right-2.5 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-black/25" />
                        <p className="text-sm font-semibold leading-tight">{p.name}</p>
                        <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.22em] text-cream/75">
                          {p.coord}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== stat rail + CTA ==================== */}
        <div
          className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:mt-20"
          style={reveal(4)}
        >
          {wander.stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8">
              {i > 0 && <span className="hidden h-10 w-px bg-brown/25 sm:block" />}
              <div className="text-center">
                <p className="flex items-center justify-center gap-1.5 font-bold text-ink text-[clamp(1.5rem,3vw,2rem)]">
                  {counts[i]}
                  {i === 0 && <Star className="h-4 w-4 text-brown" />}
                </p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center" style={reveal(5)}>
          <a
            href="#packages"
            className="group inline-flex items-center gap-3 rounded-full bg-brown py-2.5 pl-7 pr-2.5 text-sm font-semibold text-cream shadow-[0_18px_36px_-16px_rgba(122,92,62,0.75)] transition-colors hover:bg-brown-deep"
          >
            Explore all destinations
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-brown transition-transform duration-300 group-hover:rotate-45">
              <Arrow className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

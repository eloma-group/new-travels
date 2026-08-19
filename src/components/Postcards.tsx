import { useRef } from "react";
import { Arrow, Pin, Play, Sparkle, Users } from "../icons";
import { postcards as pc } from "../data";

/* ------------------------------------------------------------------
   Layout notes
   - < xl : every pinned item lines up in one snap-scrolling rail.
   - ≥ xl : the same nodes float free around the centred core, each one
            drifting a little against the pointer.
   ------------------------------------------------------------------ */

/* Shared rail sizing + the switch to free-floating at xl. */
const PIN = "w-[15rem] shrink-0 snap-center xl:pointer-events-auto xl:absolute";

/* Pointer drift - magnitude in px, applied to the outer node so the inner
   card keeps its own rotation. */
const drift = (x: number, y: number): React.CSSProperties => ({
  transform: `translate3d(calc(var(--mx, 0) * ${x}px), calc(var(--my, 0) * ${y}px), 0)`,
  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
});

/* The paper itself: white stock, hairline edge, straightens on hover. */
const paper =
  "group/card relative overflow-hidden rounded-[3px] bg-white shadow-soft-md ring-1 ring-black/[0.05] transition-transform duration-500 ease-lux xl:hover:rotate-0 xl:hover:scale-[1.03]";

function Caption({
  name,
  line,
  tag,
}: {
  name: string;
  line: string;
  tag: string;
}) {
  return (
    <div className="px-4 pb-4 pt-3.5 text-center">
      <p className="font-script text-xl text-brown">{name}</p>
      <p className="mt-1.5 text-[0.7rem] font-bold uppercase leading-[1.5] tracking-[0.13em] text-ink">
        {line}
      </p>
      <p className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-ink-faint">
        {tag}
      </p>
    </div>
  );
}

export default function Postcards() {
  const sceneRef = useRef<HTMLElement>(null);

  const move = (e: React.MouseEvent) => {
    const el = sceneRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const reset = () => {
    const el = sceneRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
  };

  return (
    <section
      ref={sceneRef}
      id="journal"
      onMouseMove={move}
      onMouseLeave={reset}
      className="relative overflow-hidden bg-cream py-20 sm:py-28 xl:py-32"
    >
      {/* ---------- contour-map ground ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/images/collage-topo.jpg')] bg-cover bg-top bg-no-repeat opacity-80"
      />
      {/* fade the plate into the cream above and below it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cream to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent"
      />
      {/* ---------- ghost script behind everything ---------- */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-script text-[clamp(6rem,22vw,20rem)] leading-none text-brown/[0.055]"
      >
        {pc.watermark}
      </span>

      {/* ================= centred core ================= */}
      <div className="shell relative z-10 flex flex-col items-center text-center xl:min-h-[36rem] xl:justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/80 py-1.5 pl-2 pr-4 text-sm font-medium text-ink shadow-soft-sm backdrop-blur-sm">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-brown-soft to-brown-deep text-white">
            <Sparkle className="h-3.5 w-3.5" />
          </span>
          {pc.chip}
        </span>

        {/* script line + the hand-drawn flight doodle */}
        <div className="relative mt-7">
          <img
            src="/images/collage-landmark.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-44 -top-2 hidden w-36 opacity-90 lg:block xl:-left-56 xl:w-44"
          />
          <p className="font-script text-[clamp(1.75rem,3.6vw,2.6rem)] leading-none text-brown">
            {pc.script}
          </p>
        </div>

        <h2 className="mt-3 max-w-xl text-[clamp(2.2rem,5vw,3.9rem)] font-bold leading-[1.02] tracking-[-0.03em] text-ink">
          {pc.heading[0]}{" "}
          <span className="bg-gradient-to-r from-brown-deep to-brown bg-clip-text text-transparent">
            {pc.heading[1]}
          </span>
        </h2>

        <p className="mt-5 max-w-md text-base leading-relaxed text-ink/80">
          {pc.copy}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3.5">
          <a
            href="#gallery"
            className="group inline-flex items-center gap-3 rounded-full bg-ink py-3 pl-7 pr-3 text-sm font-semibold text-cream transition-colors hover:bg-brown-deep"
          >
            {pc.cta}
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-ink transition-transform duration-300 group-hover:rotate-45">
              <Arrow className="h-4 w-4" />
            </span>
          </a>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
            {pc.meta}
          </p>
        </div>
      </div>

      {/* ================= the pinned wall ================= */}
      <div className="no-scrollbar mt-14 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[max(1.25rem,calc((100vw-1360px)/2))] pb-6 pt-2 xl:pointer-events-none xl:absolute xl:inset-0 xl:mt-0 xl:block xl:overflow-visible xl:p-0">
        {/* ---- traveller, bleeding off the left edge ---- */}
        <div
          className={`${PIN} xl:-left-[1%] xl:top-[7%] xl:w-[13rem]`}
          style={drift(20, 14)}
        >
          <div className={`${paper} p-2.5 xl:-rotate-6`}>
            <img
              src={pc.traveller.img}
              alt={pc.traveller.alt}
              className="h-64 w-full rounded-[2px] object-cover xl:h-72"
            />
          </div>
        </div>

        {/* ---- Jaipur polaroid ---- */}
        <div
          className={`${PIN} xl:left-[8%] xl:top-[25%] xl:w-[14.5rem]`}
          style={drift(-26, 18)}
        >
          <div className={`${paper} p-2.5 pb-0 xl:rotate-2`}>
            <img
              src={pc.jaipur.img}
              alt={pc.jaipur.alt}
              className="h-56 w-full rounded-[2px] object-cover"
            />
            <Caption {...pc.jaipur} />
          </div>
        </div>

        {/* ---- stitched round shot + travellers-joined count ---- */}
        <div
          className={`${PIN} xl:left-[2%] xl:bottom-[7%] xl:w-[15rem]`}
          style={drift(-18, -16)}
        >
          <div
            className={`${paper} flex items-center gap-3 py-2.5 pl-2.5 pr-4 xl:-rotate-3`}
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-dashed border-brown/40 p-1">
              <img
                src={pc.street.img}
                alt={pc.street.alt}
                className="aspect-square w-full rounded-full object-cover"
              />
            </span>
            <span className="text-left">
              <span className="flex items-center gap-1.5 font-heading text-xl font-bold leading-none text-ink">
                <Users className="h-4 w-4 text-brown" />
                {pc.stat.value}
              </span>
              <span className="mt-1.5 block text-[0.62rem] font-semibold uppercase leading-snug tracking-[0.14em] text-ink-faint">
                {pc.stat.label}
              </span>
            </span>
          </div>
        </div>

        {/* ---- Kerala clipping ---- */}
        <div
          className={`${PIN} xl:right-[7%] xl:top-[5%] xl:w-[14rem]`}
          style={drift(22, 16)}
        >
          <div className={`${paper} p-2.5 pb-0 xl:-rotate-3`}>
            <img
              src={pc.kerala.img}
              alt={pc.kerala.alt}
              className="h-44 w-full rounded-[2px] object-cover"
            />
            <Caption {...pc.kerala} />
          </div>
        </div>

        {/* ---- Uluru stamp ---- */}
        <div
          className={`${PIN} xl:-right-[1%] xl:top-[46%] xl:w-[11.5rem]`}
          style={drift(-20, -16)}
        >
          <div className={`${paper} p-2.5 xl:rotate-6`}>
            <div className="relative overflow-hidden rounded-[2px]">
              <img
                src={pc.stamp.img}
                alt={pc.stamp.alt}
                className="h-32 w-full object-cover"
              />
              <span className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-brown-deep backdrop-blur-sm">
                {pc.stamp.note}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-1 pb-1 pt-3">
              <Pin className="h-3.5 w-3.5 shrink-0 text-brown" />
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink">
                {pc.stamp.place}
              </span>
              <span className="ml-auto text-[0.58rem] tabular-nums tracking-wide text-ink-faint">
                {pc.stamp.coord}
              </span>
            </div>
          </div>
        </div>

        {/* ---- boarding pass ---- */}
        <div
          className={`${PIN} xl:left-[22%] xl:bottom-[3%] xl:w-[15rem]`}
          style={drift(24, -18)}
        >
          <div className={`${paper} flex items-stretch xl:rotate-1`}>
            <div className="flex-1 px-4 py-3.5">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.22em] text-brown">
                Boarding pass
              </p>
              <p className="mt-2 flex items-baseline gap-2 font-heading text-xl font-black leading-none tracking-tight text-ink">
                {pc.pass.from}
                <span className="text-brown-soft">✈</span>
                {pc.pass.to}
              </p>
              <p className="mt-1.5 text-[0.6rem] uppercase tracking-[0.14em] text-ink-faint">
                {pc.pass.route}
              </p>
            </div>
            {/* perforation */}
            <div className="my-2 border-l border-dashed border-ink/20" />
            <div className="flex flex-col justify-center gap-2 px-3.5 py-3.5 text-center">
              <span className="block">
                <span className="block text-[0.5rem] font-bold uppercase tracking-[0.18em] text-ink-faint">
                  Seat
                </span>
                <span className="block font-heading text-sm font-bold text-ink">
                  {pc.pass.seat}
                </span>
              </span>
              <span className="block">
                <span className="block text-[0.5rem] font-bold uppercase tracking-[0.18em] text-ink-faint">
                  Gate
                </span>
                <span className="block font-heading text-sm font-bold text-ink">
                  {pc.pass.gate}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ---- wide film still ---- */}
        <div
          className={`${PIN} xl:right-[4%] xl:bottom-[4%] xl:w-[21rem]`}
          style={drift(-24, -12)}
        >
          <div className={`${paper} p-2.5 xl:-rotate-2`}>
            <div className="relative overflow-hidden rounded-[2px]">
              <img
                src={pc.reel.img}
                alt={pc.reel.alt}
                className="h-40 w-full object-cover transition-transform duration-700 ease-lux group-hover/card:scale-105 xl:h-44"
              />
              <button
                type="button"
                aria-label={`Play film- ${pc.reel.place}`}
                className="absolute inset-0 grid place-items-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-ink shadow-soft-md backdrop-blur-sm transition-transform duration-300 hover:scale-110">
                  <Play className="h-6 w-6" />
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between px-1 pb-1 pt-3">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink">
                {pc.reel.place}
              </span>
              <span className="text-[0.58rem] uppercase tracking-[0.16em] text-ink-faint">
                {pc.reel.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

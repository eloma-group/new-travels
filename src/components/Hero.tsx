import { useEffect, useState } from "react";
import { Arrow } from "../icons";
import { avatars, experiences } from "../data";
import Navbar from "./Navbar";

const SLIDE_MS = 3000;
const delay = (s: number) => ({ animationDelay: `${s}s` });
const swap = {
  animation: "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
};

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const exp = experiences[active];

  // auto-advance through the experiences every few seconds; pauses while the
  // viewer is interacting with the controls, and stays put for reduced motion.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(
      () => setActive((a) => (a + 1) % experiences.length),
      SLIDE_MS
    );
    return () => clearTimeout(id);
  }, [active, paused]);

  return (
    <section id="home">
      {/* full-bleed cinematic frame - edge to edge, no gaps */}
      <div className="relative min-h-dvh overflow-hidden">
        {/* crossfading background layers */}
        {experiences.map((e, i) => (
          <img
            key={e.key}
            src={e.hero}
            alt=""
            aria-hidden={i !== active}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
              i === active ? "animate-kenburns opacity-100" : "scale-105 opacity-0"
            }`}
          />
        ))}

        {/* legibility overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* floating nav */}
        <Navbar />

        {/* ---------- centered headline (swaps with experience) ---------- */}
        <div
          key={exp.key}
          style={swap}
          className="relative z-10 flex flex-col items-center px-5 pt-28 text-center sm:pt-32 lg:pt-40"
        >
          <span className="glass rounded-full px-4 py-1.5 text-xs font-medium text-white sm:text-sm">
            {exp.eyebrow}
          </span>

          <h1 className="mt-6 w-full max-w-[92vw] text-balance px-2 text-[clamp(1.9rem,6vw,6.25rem)] font-bold leading-[1.04] tracking-[-0.02em] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.4)] sm:leading-[1] lg:max-w-5xl">
            {exp.title}
          </h1>
        </div>

        {/* ---------- bottom overlay row ---------- */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="absolute inset-x-0 bottom-0 z-10 flex max-w-full flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8"
        >
          {/* bottom-left: community card */}
          <div
            className="glass-panel w-full max-w-sm animate-float-in rounded-[28px] p-5 text-ink shadow-soft-lg"
            style={delay(0.5)}
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                ))}
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-ink text-xs font-bold text-white">
                  50+
                </span>
              </div>
              <span className="text-sm font-semibold">People joined</span>
            </div>

            <p key={exp.key} style={swap} className="mt-4 text-sm leading-relaxed text-ink-soft">
              {exp.copy}
            </p>

            <a
              href="#book"
              className="group mt-5 inline-flex items-center gap-2 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition-colors hover:bg-gold-deep"
            >
              Book now
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:rotate-45">
                <Arrow className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>

          {/* bottom-right: clickable experience cards (active floats to front) */}
          <div
            className="no-scrollbar flex min-w-0 max-w-full animate-float-in gap-3 overflow-x-auto pb-1 lg:max-w-[54%]"
            style={delay(0.65)}
          >
            {[active, ...experiences.map((_, i) => i).filter((i) => i !== active)].map((i) => {
              const e = experiences[i];
              const on = i === active;
              return (
                <button
                  key={e.key}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  aria-label={`Show ${e.card}`}
                  className={`group relative h-52 shrink-0 overflow-hidden rounded-[24px] text-left shadow-soft-md ring-1 transition-all duration-500 hover:-translate-y-1 sm:h-60 ${
                    on
                      ? "w-60 ring-2 ring-gold sm:w-64"
                      : "w-32 ring-white/25 sm:w-36"
                  }`}
                >
                  <img
                    src={e.thumb}
                    alt={e.card}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  {/* auto-advance timing bar (active card only) */}
                  {on && (
                    <span
                      className="absolute inset-x-3 top-3 z-10 h-[3px] origin-left rounded-full bg-gold/90"
                      style={{
                        animation: `hero-progress ${SLIDE_MS}ms linear both`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  )}
                  {/* glass caption plate */}
                  <div className="glass absolute inset-x-3 bottom-3 rounded-2xl px-3 py-2.5 text-white">
                    <h3 className="text-sm font-bold leading-tight">{e.card}</h3>
                    {on && (
                      <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/85">
                        {e.copy}
                      </p>
                    )}
                    {!on && (
                      <p className="mt-0.5 text-[0.7rem] text-white/70">{e.place}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

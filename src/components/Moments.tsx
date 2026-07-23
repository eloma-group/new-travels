import { useEffect, useRef, useState } from "react";
import { momentLayout, momentSets } from "../data";
import { Arrow, Sparkle } from "../icons";

const heights: Record<string, string> = {
  sm: "h-[clamp(300px,38vh,460px)]",
  md: "h-[clamp(340px,44vh,540px)]",
  lg: "h-[clamp(380px,50vh,600px)]",
};

const STAGGER = 0.2; // seconds between each card
const ROTATE_MS = 4000; // dwell before the next set

export default function Moments() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [set, setSet] = useState(0);

  // Preload every set so rotations reveal instantly.
  useEffect(() => {
    momentSets.forEach((s) =>
      s.images.forEach((src) => {
        const im = new Image();
        im.src = src;
      })
    );
  }, []);

  // Reveal on scroll-in.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-rotate once revealed.
  useEffect(() => {
    if (!shown) return;
    const id = setInterval(
      () => setSet((s) => (s + 1) % momentSets.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [shown]);

  const active = momentSets[set];

  // Each card re-mounts per set (key), replaying the reveal with a stagger.
  const reveal = (i: number) =>
    shown
      ? {
          animation: `moment-in 0.95s cubic-bezier(0.22,1,0.36,1) both`,
          animationDelay: `${i * STAGGER}s`,
        }
      : { opacity: 0 };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative z-10 -mt-6 rounded-t-[32px] bg-cream pb-20 pt-20 shadow-[0_-22px_60px_-30px_rgba(42,36,32,0.5)] sm:-mt-8 sm:rounded-t-[44px] sm:pb-28 sm:pt-28"
    >
      {/* grab handle — signals the section lifts up over the hero */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-4 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ink/12"
      />
      {/* premium header */}
      <div className="shell relative flex flex-col items-center text-center">
        {/* warm glow behind the heading */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 left-1/2 -z-0 h-72 w-[min(90vw,44rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(122,92,62,0.18),transparent_68%)] blur-2xl"
        />

        <span className="relative inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/80 py-1.5 pl-2 pr-4 text-sm font-medium text-ink shadow-soft-sm backdrop-blur-sm">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-brown-soft to-brown-deep text-white">
            <Sparkle className="h-3.5 w-3.5" />
          </span>
          Pure Adventure
        </span>

        <h2 className="relative mt-6 max-w-4xl text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
          Unforgettable{" "}
          <span className="bg-gradient-to-r from-brown-deep to-brown bg-clip-text text-transparent">
            Moments
          </span>{" "}
          <span className="whitespace-nowrap text-ink-faint">in the</span>
          <br className="hidden sm:block" /> Heart of Mount Bromo
        </h2>

        <p className="relative mt-5 max-w-xl text-base leading-relaxed text-ink/80">
          Chase breathtaking sunrises, wander across volcanic landscapes and
          gather memories at one of the world's most iconic destinations.
        </p>
      </div>

      {/* full-width gallery — 6 across on desktop, swipeable on smaller screens */}
      <div className="no-scrollbar mt-14 flex items-start gap-3 overflow-x-auto px-4 py-2 sm:gap-4 sm:px-6 lg:gap-5 lg:overflow-x-visible lg:px-8">
        {momentLayout.map((slot, i) => {
          const src = active.images[i];
          const alt = active.alts[i];
          const cardKey = `${i}-${set}`;
          return slot.featured ? (
            /* featured card: image + caption below */
            <div
              key={cardKey}
              className="flex w-52 shrink-0 flex-col gap-4 sm:w-60 lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink"
              style={{ marginTop: slot.offset, ...reveal(i) }}
            >
              <div className={`${heights[slot.h]} overflow-hidden rounded-[26px] shadow-soft-md`}>
                <img src={src} alt={alt} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="flex items-start justify-between gap-3 px-1">
                <div>
                  <h3 className="text-base font-bold text-ink">{active.caption.title}</h3>
                  <p className="mt-1 text-sm leading-snug text-ink/80">{active.caption.copy}</p>
                </div>
                <a
                  href="#book"
                  aria-label={active.caption.title}
                  className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-cream transition-transform duration-300 hover:rotate-45"
                >
                  <Arrow className="h-4 w-4" />
                </a>
              </div>
            </div>
          ) : (
            /* image-only card */
            <div
              key={cardKey}
              className={`${heights[slot.h]} w-40 shrink-0 overflow-hidden rounded-[26px] shadow-soft-md sm:w-52 lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink`}
              style={{ marginTop: slot.offset, ...reveal(i) }}
            >
              <img src={src} alt={alt} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
          );
        })}
      </div>

      {/* set indicator */}
      <div className="shell mt-10 flex items-center justify-center gap-2">
        {momentSets.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === set ? "w-7 bg-brown-deep" : "w-1.5 bg-ink/15"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

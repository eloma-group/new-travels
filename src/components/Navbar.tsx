import { useState } from "react";
import { Arrow } from "../icons";
import { nav, brand } from "../data";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(nav[0].label);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-4 sm:pt-6">
      <nav
        aria-label="Primary"
        className="glass pointer-events-auto flex w-full max-w-4xl animate-fade-up items-center justify-between gap-4 rounded-full py-2 pl-3 pr-3 text-white shadow-soft-md ring-1 ring-white/20 sm:pl-5"
      >
        {/* Brand */}
        <a href="#home" aria-label={`${brand} home`} className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 ring-1 ring-white/40">
            <span className="h-3 w-3 rounded-full bg-gradient-to-br from-gold-soft to-gold-deep" />
          </span>
          <span className="text-lg font-bold tracking-tight">{brand}</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setActive(item.label)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                active === item.label
                  ? "bg-white text-ink"
                  : "text-white/85 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#book"
          className="group hidden items-center gap-2 rounded-full bg-white/95 py-1.5 pl-4 pr-1.5 text-sm font-semibold text-ink transition-colors hover:bg-white sm:flex"
        >
          Book now
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-45">
            <Arrow className="h-3.5 w-3.5" />
          </span>
        </a>

        {/* Mobile toggle */}
        <button
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col gap-[5px] rounded-full p-2.5 lg:hidden"
        >
          <span className={`h-0.5 w-5 rounded bg-white transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 rounded bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 rounded bg-white transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>

        {/* Mobile dropdown */}
        <div
          id="mobile-nav"
          className={`glass-panel absolute inset-x-0 top-[calc(100%+0.6rem)] origin-top overflow-hidden rounded-[28px] text-ink shadow-soft-lg transition-all duration-300 lg:hidden ${
            open ? "max-h-[26rem] p-3 opacity-100" : "pointer-events-none max-h-0 p-0 opacity-0"
          }`}
        >
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                setActive(item.label);
                setOpen(false);
              }}
              className="block rounded-2xl px-4 py-3 font-medium text-ink-soft transition-colors hover:bg-white/60 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#book"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 font-semibold text-white"
          >
            Book now <Arrow className="h-4 w-4" />
          </a>
        </div>
      </nav>
    </div>
  );
}

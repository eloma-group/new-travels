import { useState } from "react";
import { Arrow } from "../icons";
import { nav, brand } from "../data";
import { useRoute } from "../router";
import Link from "./Link";

/* The bar sits over the hero on the home page and on cream everywhere
   else, so it carries two skins rather than two components. */
type Variant = "overlay" | "solid";

export default function Navbar({ variant = "overlay" }: { variant?: Variant }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(nav[0].label);
  const route = useRoute();

  const onHome = route === "/";
  const solid = variant === "solid";

  // In-page anchors only resolve on the home page - from anywhere else
  // they need the path in front of them.
  const resolve = (href: string) => (href.startsWith("#") && !onHome ? `/${href}` : href);
  const isActive = (href: string, label: string) =>
    href.startsWith("/") ? route === href : onHome && active === label;

  const item = (href: string, label: string, className: string, onClick?: () => void) => {
    const to = resolve(href);
    return to.startsWith("/") ? (
      <Link key={label} to={to} onClick={onClick} className={className}>
        {label}
      </Link>
    ) : (
      <a key={label} href={to} onClick={onClick} className={className}>
        {label}
      </a>
    );
  };

  return (
    <div
      className={`pointer-events-none inset-x-0 top-0 z-30 flex justify-center px-4 pt-4 sm:pt-6 ${
        solid ? "fixed" : "absolute"
      }`}
    >
      <nav
        aria-label="Primary"
        className={`pointer-events-auto flex w-full max-w-4xl animate-fade-up 2xl:max-w-5xl min-[1920px]:max-w-6xl items-center justify-between gap-4 rounded-full py-2 pl-3 pr-3 shadow-soft-md sm:pl-5 ${
          solid
            ? "glass-panel text-ink ring-1 ring-brown/12"
            : "glass text-white ring-1 ring-white/20"
        }`}
      >
        {/* Brand */}
        <Link to="/" aria-label={`${brand} home`} className="flex items-center gap-2.5">
          <span
            className={`grid h-9 w-9 place-items-center rounded-full ring-1 ${
              solid ? "bg-brown/10 ring-brown/25" : "bg-white/15 ring-white/40"
            }`}
          >
            <span
              className={`h-3 w-3 rounded-full bg-gradient-to-br ${
                solid ? "from-brown-soft to-brown-deep" : "from-gold-soft to-gold-deep"
              }`}
            />
          </span>
          <span className="text-lg font-bold tracking-tight">{brand}</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {nav.map((n) =>
            item(
              n.href,
              n.label,
              `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive(n.href, n.label)
                  ? solid
                    ? "bg-brown text-cream"
                    : "bg-white text-ink"
                  : solid
                  ? "text-ink-soft hover:text-ink"
                  : "text-white/85 hover:text-white"
              }`,
              () => setActive(n.label)
            )
          )}
        </div>

        {/* CTA */}
        <Link
          to="/contact"
          className={`group hidden items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 text-sm font-semibold transition-colors sm:flex ${
            solid ? "bg-brown text-cream hover:bg-brown-deep" : "bg-white/95 text-ink hover:bg-white"
          }`}
        >
          Book now
          <span
            className={`grid h-7 w-7 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${
              solid ? "bg-cream text-brown" : "bg-ink text-white"
            }`}
          >
            <Arrow className="h-3.5 w-3.5" />
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col gap-[5px] rounded-full p-2.5 lg:hidden"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-0.5 w-5 rounded ${solid ? "bg-ink" : "bg-white"} ${
                i === 1
                  ? `transition-opacity duration-200 ${open ? "opacity-0" : ""}`
                  : `transition-transform duration-300 ${
                      open
                        ? i === 0
                          ? "translate-y-[7px] rotate-45"
                          : "-translate-y-[7px] -rotate-45"
                        : ""
                    }`
              }`}
            />
          ))}
        </button>

        {/* Mobile dropdown */}
        <div
          id="mobile-nav"
          className={`glass-panel absolute inset-x-0 top-[calc(100%+0.6rem)] origin-top overflow-hidden rounded-[28px] text-ink shadow-soft-lg transition-all duration-300 lg:hidden ${
            open ? "max-h-[26rem] p-3 opacity-100" : "pointer-events-none max-h-0 p-0 opacity-0"
          }`}
        >
          {nav.map((n) =>
            item(
              n.href,
              n.label,
              "block rounded-2xl px-4 py-3 font-medium text-ink-soft transition-colors hover:bg-white/60 hover:text-ink",
              () => {
                setActive(n.label);
                setOpen(false);
              }
            )
          )}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-center gap-2 rounded-full bg-brown px-4 py-3 font-semibold text-cream"
          >
            Book now <Arrow className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </div>
  );
}

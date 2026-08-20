import { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   A ~40-line client router. The site is two pages and a handful of
   in-page anchors, so react-router would be more machinery than the
   problem deserves. Azure Static Web Apps serves index.html for
   unknown paths (see public/staticwebapp.config.json), which is all
   this needs from the host.
   ------------------------------------------------------------------ */

const NAV = "aurea:navigate";

/** Current pathname, kept in sync with the back/forward buttons. */
export function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener("popstate", sync);
    window.addEventListener(NAV, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(NAV, sync);
    };
  }, []);

  return path;
}

export function navigate(to: string) {
  const url = new URL(to, window.location.origin);
  const samePage = url.pathname === window.location.pathname;

  if (!samePage || url.hash !== window.location.hash) {
    window.history.pushState({}, "", url.pathname + url.hash);
    window.dispatchEvent(new Event(NAV));
  }

  if (!url.hash) {
    window.scrollTo({ top: 0, behavior: samePage ? "smooth" : "auto" });
    return;
  }

  // Two frames: one for React to commit the new page, one for layout.
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      document
        .querySelector(url.hash)
        ?.scrollIntoView({ behavior: samePage ? "smooth" : "auto", block: "start" })
    )
  );
}

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Cursor from "./Cursor";
import SmoothScroll from "./SmoothScroll";
import ScrollEffects from "./ScrollEffects";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

gsap.registerPlugin(ScrollTrigger);

interface PageShellProps {
  /** True while the nav sits over a dark hero: it switches to its light-on-dark variant. */
  overHero: boolean;
  /** The home page links to its own sections in place; every other page links back to them. */
  home?: boolean;
  children: ReactNode;
}

/** Everything every page shares: smooth scroll, cursor, scroll effects, nav and footer. */
export default function PageShell({ overHero, home = false, children }: PageShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Web fonts and lazy images change page height after first layout, which
      // would leave every pinned section's scroll range stale.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready?.then(refresh);
      window.addEventListener("load", refresh);
      const pendingImages = Array.from(document.images).filter((img) => !img.complete);
      let pending = pendingImages.length;
      if (pending === 0) refresh();
      pendingImages.forEach((img) =>
        img.addEventListener(
          "load",
          () => {
            pending -= 1;
            if (pending === 0) refresh();
          },
          { once: true },
        ),
      );

      return () => window.removeEventListener("load", refresh);
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <SmoothScroll />
      <ScrollEffects />
      <Cursor />
      <SiteNav overHero={overHero} home={home} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

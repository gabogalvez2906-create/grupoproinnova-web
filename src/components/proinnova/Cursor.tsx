import { useEffect, useRef } from "react";
import gsap from "gsap";

const INTERACTIVE = 'a, button, [data-cursor="interactive"]';

/**
 * Gold dot + trailing ring. Hover state uses event delegation, so anything
 * added to the page later (including by Lovable) picks it up automatically.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let overInteractive = false;

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const hit = e.target instanceof Element && e.target.closest(INTERACTIVE) !== null;
      if (hit === overInteractive) return;
      overInteractive = hit;
      gsap.to(ring, { scale: hit ? 2.4 : 1, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: hit ? 0 : 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scrubbed scroll effects driven by data attributes, so section components only
 * mark their markup:
 *   [data-parallax]     image drifts inside its overflow-hidden frame
 *   [data-zoom-reveal]  frame opens from an inset crop to full size
 */
export default function ScrollEffects() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
      const frame = img.parentElement;
      if (!frame) return;
      gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-zoom-reveal]").forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(14% 10% 14% 10% round 4px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 4px)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 92%", end: "top 38%", scrub: 0.6 },
        },
      );
    });
  }, []);

  return null;
}

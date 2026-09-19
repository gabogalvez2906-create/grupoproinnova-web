import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Scrubbed scroll effects driven by data attributes, so section components only
 * mark their markup:
 *   [data-parallax]     image drifts inside its overflow-hidden frame
 *   [data-zoom-reveal]  frame opens from an inset crop to full size
 *   [data-split]        heading rises line by line out of a mask
 *   [data-count]        number counts up when it enters the viewport
 *   [data-spot]         card lights up under the pointer (sets --mx / --my)
 *   [data-line]         hairline draws itself along the scroll (scaleX 0 → 1)
 * Plus the thin scroll-progress bar under the nav.
 */
export default function ScrollEffects() {
  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scroll progress bar.
    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    if (bar) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => bar.style.setProperty("--p", String(self.progress)),
      });
    }

    // Pointer spotlight: feedback rather than animation, so it stays on with reduced motion.
    const spots = gsap.utils.toArray<HTMLElement>("[data-spot]");
    const spotHandlers = spots.map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      el.addEventListener("pointermove", move);
      return () => el.removeEventListener("pointermove", move);
    });
    const cleanup = () => spotHandlers.forEach((off) => off());

    if (reduced) {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        el.textContent = el.dataset["count"] ?? "";
      });
      gsap.utils.toArray<HTMLElement>(".method__step").forEach((s) => s.classList.add("is-on"));
      return cleanup;
    }

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

    // Headings: each line slides up from behind its own mask.
    gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }),
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const end = Number(el.dataset["count"] ?? 0);
      const state = { v: 0 };
      gsap.to(state, {
        v: end,
        duration: 1.8,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = String(Math.round(state.v));
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-line]").forEach((el) => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: { trigger: el.parentElement, start: "top 75%", end: "+=520", scrub: 0.5 },
        },
      );
    });

    // Method steps light up in sequence as the line reaches them.
    gsap.utils.toArray<HTMLElement>(".method__step").forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 78%",
        onEnter: () => step.classList.add("is-on"),
        onLeaveBack: () => step.classList.remove("is-on"),
      });
    });

    return cleanup;
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}

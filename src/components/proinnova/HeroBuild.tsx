import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import MagneticButton from "./MagneticButton";
import { BUILDING_FLOORS } from "./site";
import { TIMELINE, floorsBuiltAt, stageAt, type Stage } from "./buildTimeline";

// three.js is heavy and needs WebGL, so it is split out and only loaded in the browser.
const BuildingScene = lazy(() => import("./BuildingScene"));

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

interface HeroBuildProps {
  /** Lets the fixed nav flip to its light-on-dark variant while the hero fills the screen. */
  onOverHeroChange?: (over: boolean) => void;
}

export default function HeroBuild({ onOverHeroChange }: HeroBuildProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef({ value: 0 });
  const [floorsBuilt, setFloorsBuilt] = useState(() => floorsBuiltAt(0));
  const [stage, setStage] = useState<Stage>(() => stageAt(0));
  // The page is server-rendered; the WebGL canvas can only mount client-side.
  const [canRender3D, setCanRender3D] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  // Stop drawing the 3D scene once the hero has scrolled out of view.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    setCanRender3D(true);
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true), {
      rootMargin: "120px 0px",
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const sync = (p: number) => {
        progressRef.current.value = p;
        setFloorsBuilt(floorsBuiltAt(p));
        setStage(stageAt(p));
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        sync(1);
        gsap.set(".hero-build__final", { opacity: 1 });
        // Without the pin there is no hero-sized band for the nav to sit over.
        onOverHeroChange?.(false);
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=380%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => sync(self.progress),
          // The pin lasts exactly as long as the hero fills the screen, so it
          // also decides when the nav can stop being transparent.
          onToggle: (self) => onOverHeroChange?.(self.isActive),
        },
      });

      // Keeps the timeline exactly one unit long so positions below are scroll fractions.
      tl.to({}, { duration: 1 }, 0)
        .to(".hero-build__kicker", { opacity: 0, y: -16, duration: 0.06 }, 0.02)
        .to(".hero-build__intro", { y: -12, duration: 0.3 }, TIMELINE.reveal - 0.3)
        .fromTo(
          ".hero-build__final",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.08 },
          TIMELINE.reveal,
        )
        .fromTo(
          ".hero-build__final-item",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.07, stagger: 0.025 },
          TIMELINE.reveal + 0.02,
        );

      gsap
        .timeline({ delay: 0.35 })
        .from(".hero-build__eyebrow", { opacity: 0, y: 16, duration: 0.7, ease: "power3.out" })
        .from(
          ".hero-build__line > span",
          { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.12 },
          "-=0.45",
        )
        .from(".hero-build__kicker", { opacity: 0, y: 12, duration: 0.6, ease: "power2.out" }, "-=0.5")
        .from(".hero-build__meter", { opacity: 0, x: 16, duration: 0.8, ease: "power3.out" }, "-=0.6");
    },
    { scope: sectionRef },
  );

  return (
    <section className="hero-build" ref={sectionRef} id="inicio">
      <div className={`hero-build__scene ${sceneReady ? "is-ready" : ""}`} aria-hidden="true">
        {canRender3D && (
          <Suspense fallback={null}>
            <BuildingScene
              progressRef={progressRef}
              active={inView}
              onReady={() => setSceneReady(true)}
            />
          </Suspense>
        )}
      </div>
      <div className="hero-build__scrim" />

      <div className="hero-build__ui">
        <div className="hero-build__intro">
          <span className="hero-build__eyebrow eyebrow eyebrow--light">
            Construcción e innovación · Guatemala
          </span>
          <h1 className="hero-build__title">
            <span className="hero-build__line">
              <span>Construimos</span>
            </span>
            <span className="hero-build__line">
              <span>espacios que</span>
            </span>
            <span className="hero-build__line">
              <span>impulsan negocios.</span>
            </span>
          </h1>
          <p className="hero-build__kicker">
            <span className="hero-build__kicker-line" aria-hidden="true" />
            Desliza para construir
          </p>
        </div>

        <div className="hero-build__final">
          <p className="hero-build__final-item hero-build__sub">
            Un solo equipo responsable de diseño, obra y acabados. Un estándar, una fecha, cero
            excusas.
          </p>
          <div className="hero-build__final-item hero-build__cta">
            <MagneticButton href="#contacto">Agenda una consultoría</MagneticButton>
            <a href="#quienes-somos" className="hero-build__scroll-hint" data-cursor="interactive">
              Conoce Proinnova ↓
            </a>
          </div>
        </div>
      </div>

      <div className="hero-build__meter" aria-hidden="true">
        <span className="hero-build__meter-label">Niveles</span>
        <span className="hero-build__meter-count">
          {pad(floorsBuilt)}
          <span className="hero-build__meter-total">/{pad(BUILDING_FLOORS)}</span>
        </span>
        <div className="hero-build__meter-track">
          <div
            className="hero-build__meter-fill"
            style={{ height: `${(floorsBuilt / BUILDING_FLOORS) * 100}%` }}
          />
        </div>
        <span className="hero-build__meter-stage">{stage}</span>
      </div>
    </section>
  );
}

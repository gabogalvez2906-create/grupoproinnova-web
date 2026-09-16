import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import MagneticButton from "./MagneticButton";
import { BUILDING_FLOORS } from "./site";
import heroImg from "../../assets/obra/hero-proinnova.jpg";

// three.js is heavy and needs WebGL, so it is split out and only loaded in the browser.
const BuildingScene = lazy(() => import("./BuildingScene"));

gsap.registerPlugin(ScrollTrigger);

export default function HeroBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef({ value: 0 });
  const [floorsBuilt, setFloorsBuilt] = useState(0);
  // The page is server-rendered; the WebGL canvas can only mount client-side.
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    setCanRender3D(true);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        progressRef.current.value = 1;
        setFloorsBuilt(BUILDING_FLOORS);
        gsap.set(".hero-build__final", { opacity: 1 });
        gsap.set(".hero-build__photo", { opacity: 0.42, filter: "blur(7px)" });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            progressRef.current.value = self.progress;
            const built = Math.round(
              gsap.utils.mapRange(0.08, 0.82, 0, BUILDING_FLOORS, self.progress),
            );
            setFloorsBuilt(Math.min(BUILDING_FLOORS, Math.max(0, built)));
          },
        },
      });

      // The photo drops back into a soft, defocused sky/skyline plate so the
      // 3D structure reads as the subject instead of competing with it.
      tl.to(
        ".hero-build__photo",
        { opacity: 0.42, filter: "blur(7px) saturate(0.85)", duration: 0.14 },
        0,
      )
        .to(".hero-build__photo", { scale: 1.1, duration: 1 }, 0)
        .to(".hero-build__kicker", { opacity: 0, y: -20, duration: 0.1 }, 0.02)
        .fromTo(".hero-build__final", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.1 }, 0.76)
        .fromTo(
          ".hero-build__final-item",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.08, stagger: 0.03 },
          0.78,
        );

      gsap
        .timeline({ delay: 0.2 })
        .from(".hero-build__eyebrow", { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" })
        .from(
          ".hero-build__line > span",
          { opacity: 0, yPercent: 110, duration: 0.8, ease: "expo.out", stagger: 0.1 },
          "-=0.2",
        )
        .from(".hero-build__kicker", { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }, "-=0.3");
    },
    { scope: sectionRef },
  );

  return (
    <section className="hero-build" ref={sectionRef} id="inicio">
      <div className="hero-build__photo">
        <img
          src={heroImg}
          alt="Obra de Proinnova en construcción al atardecer sobre la ciudad"
          fetchPriority="high"
        />
      </div>
      <div className="hero-build__scrim" />

      <div className="hero-build__scene" aria-hidden="true">
        {canRender3D && (
          <Suspense fallback={null}>
            <BuildingScene progressRef={progressRef} />
          </Suspense>
        )}
      </div>

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
          <p className="hero-build__kicker">Desliza para construir ↓</p>
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
          {String(floorsBuilt).padStart(2, "0")}/{String(BUILDING_FLOORS).padStart(2, "0")}
        </span>
        <div className="hero-build__meter-track">
          <div
            className="hero-build__meter-fill"
            style={{ height: `${(floorsBuilt / BUILDING_FLOORS) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}

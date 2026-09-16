import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: "01", title: "Reunión", desc: "Objetivos, alcance y presupuesto." },
  { n: "02", title: "Planificación", desc: "Cronograma y recursos." },
  { n: "03", title: "Diseño", desc: "Planos e ingeniería." },
  { n: "04", title: "Construcción", desc: "Supervisión técnica en obra." },
  { n: "05", title: "Entrega", desc: "Validación y entrega final." },
  { n: "06", title: "Seguimiento", desc: "Mantenimiento y garantía." },
];

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const progress = progressRef.current;
      if (!section || !progress) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setActive(steps.length - 1);
        gsap.set(progress, { scaleY: 1 });
        return;
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${steps.length * 420}`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)));
          gsap.set(progress, { scaleY: self.progress });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className="process" ref={sectionRef} id="proceso">
      <div className="process__inner">
        <div className="process__heading">
          <span className="eyebrow">Nuestro proceso</span>
          <h2>Un método ordenado</h2>
        </div>

        <div className="process__body">
          <div className="process__rail" aria-hidden="true">
            <div className="process__rail-track">
              <div className="process__rail-progress" ref={progressRef} />
            </div>
          </div>

          <ol className="process__list">
            {steps.map((step, i) => (
              <li
                key={step.n}
                className={`process__step ${i === active ? "is-active" : ""}`}
                aria-current={i === active ? "step" : undefined}
              >
                <span className="process__num">{step.n}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

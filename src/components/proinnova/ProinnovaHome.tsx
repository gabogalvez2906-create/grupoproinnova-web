import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Cursor from "./Cursor";
import SmoothScroll from "./SmoothScroll";
import Logo from "./Logo";
import HeroBuild from "./HeroBuild";
import MagneticButton from "./MagneticButton";
import Marquee from "./Marquee";
import ScrollReveal from "./ScrollReveal";
import ScrollEffects from "./ScrollEffects";
import ServicesInteractive from "./ServicesInteractive";
import MethodSection from "./MethodSection";
import ProjectsGallery from "./ProjectsGallery";
import { CONTACT, telHref } from "./site";

import ingenierosPlanos from "../../assets/obra/ingenieros-revisando-planos.jpg";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  { n: "01", title: "Calidad", desc: "Materiales certificados y mano de obra calificada." },
  { n: "02", title: "Cumplimiento", desc: "Cronogramas realistas que sí se cumplen." },
  { n: "03", title: "Innovación", desc: "Procesos constructivos actualizados y eficientes." },
  { n: "04", title: "Transparencia", desc: "Presupuesto desglosado, sin costos ocultos." },
  { n: "05", title: "Seguridad", desc: "Protocolos de seguridad industrial en cada obra." },
  { n: "06", title: "Acompañamiento", desc: "Un interlocutor directo de la idea a la entrega." },
];

export default function ProinnovaHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [overHero, setOverHero] = useState(true);

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

      <header className={`nav ${overHero ? "nav--over-hero" : ""}`}>
        <div className="nav__inner">
          <a className="nav__logo" href="#inicio" aria-label="Proinnova, ir al inicio">
            <Logo variant={overHero ? "on-dark" : "on-light"} />
          </a>
          <nav className="nav__links" aria-label="Principal">
            <a href="#quienes-somos">Nosotros</a>
            <a href="#valores">Valores</a>
            <a href="#servicios">Servicios</a>
            <a href="#metodologia">Metodología</a>
            <a href="#casos">Casos</a>
          </nav>
          <MagneticButton href="#contacto" variant="outline" className="nav__cta">
            Hablemos
          </MagneticButton>
        </div>
      </header>

      <main>
        <HeroBuild onOverHeroChange={setOverHero} />

        <Marquee
          items={["Innovación", "Calidad", "Confianza", "Excelencia", "Obra civil", "Acabados"]}
        />

        <section className="stats" aria-label="Proinnova en cifras">
          {[
            { n: 1, label: "Equipo responsable", note: "de la idea a la entrega" },
            { n: 10, label: "Servicios integrados", note: "bajo un mismo techo" },
            { n: 6, label: "Pasos de metodología", note: "sin improvisar" },
            { n: 0, label: "Excusas", note: "una fecha, un estándar" },
          ].map((s) => (
            <div className="stats__item" key={s.label}>
              <span className="stats__num" data-count={s.n}>
                0
              </span>
              <span className="stats__label">{s.label}</span>
              <span className="stats__note">{s.note}</span>
            </div>
          ))}
        </section>

        {/* 1 · Quiénes somos */}
        <section className="about" id="quienes-somos">
          <div className="about__media" data-zoom-reveal>
            <img
              src={ingenierosPlanos}
              alt="Ingenieros de Proinnova revisando planos en obra"
              loading="lazy"
              data-parallax
            />
          </div>
          <div className="about__content">
            <ScrollReveal>
              <span className="eyebrow">Quiénes somos</span>
              <h2 data-split>Somos la constructora que entrega lo que promete.</h2>
              <p>
                Un solo equipo responsable de diseño, obra y acabados en Guatemala. Un estándar,
                una fecha, cero excusas.
              </p>
              <p>
                Diseñamos espacios funcionales, modernos y duraderos que hacen crecer a nuestros
                clientes. Cada diseño integra estructuras, instalaciones hidrosanitarias,
                eléctricas y climatización desde el primer plano — garantizando estética y
                eficiencia, sin cambios costosos en obra.
              </p>
              <blockquote className="about__quote">
                No vendemos únicamente construcción. <span>Creamos valor.</span>
              </blockquote>
            </ScrollReveal>
          </div>
        </section>

        {/* 2 · Valores */}
        <section className="values" id="valores">
          <div className="values__inner">
            <span className="eyebrow eyebrow--light">Valores</span>
            <h2 data-split>Lo que nos define</h2>
            <ScrollReveal stagger className="pillars">
              {pillars.map((p) => (
                <div className="pillar" key={p.n} data-spot>
                  <span className="pillar__num">{p.n}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        {/* 3 · Servicios (incluye Nuestra especialidad) */}
        <ServicesInteractive />

        {/* 4 · Metodología (incluye fases y certeza) */}
        <MethodSection />

        {/* 5 · Casos de éxito (incluye clientes) */}
        <ProjectsGallery />

        {/* 6 · Contacto */}
        <section className="cta-final" id="contacto">
          <div className="cta-final__inner">
            <ScrollReveal>
              <span className="eyebrow eyebrow--light">Contacto</span>
              <h2 data-split>Construyamos juntos tu próximo proyecto.</h2>
              <p className="cta-final__lead">
                Construimos relaciones de largo plazo a través de proyectos ejecutados con calidad,
                responsabilidad y excelencia.
              </p>
              <MagneticButton href={`mailto:${CONTACT.email}`} className="cta-final__btn">
                Escríbenos
              </MagneticButton>
            </ScrollReveal>

            <ScrollReveal stagger className="cta-final__info">
              <div>
                <span className="eyebrow eyebrow--light">Teléfono</span>
                {CONTACT.phones.map((phone) => (
                  <a key={phone} href={telHref(phone)}>
                    {phone}
                  </a>
                ))}
              </div>
              <div>
                <span className="eyebrow eyebrow--light">Correo</span>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </div>
              <div>
                <span className="eyebrow eyebrow--light">Sitio web</span>
                <p>{CONTACT.website}</p>
              </div>
              <div>
                <span className="eyebrow eyebrow--light">Ubicación</span>
                <p>{CONTACT.location}</p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <Logo variant="on-dark" tagline className="footer__logo" />
        <span>© {new Date().getFullYear()} Grupo Proinnova</span>
      </footer>
    </div>
  );
}

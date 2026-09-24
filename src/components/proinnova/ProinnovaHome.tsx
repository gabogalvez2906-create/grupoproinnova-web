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

const stats = [
  {
    n: 50,
    plus: true,
    featured: true,
    label: "Proyectos entregados",
    note: "Más de cincuenta clientes creyeron en nosotros. Hoy operan, venden y viven en espacios que levantamos.",
  },
  {
    n: 8,
    plus: true,
    featured: false,
    label: "Obras en simultáneo",
    note: "Capacidad para sostener varios frentes a la vez sin que ninguno pierda supervisión.",
  },
  {
    n: 10,
    plus: false,
    featured: false,
    label: "Especialidades integradas",
    note: "Diseño, obra civil, estructuras, instalaciones y acabados bajo un solo contrato.",
  },
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

        <section className="stats" aria-labelledby="stats-title">
          <div className="stats__intro">
            <span className="eyebrow">Trayectoria y alcance</span>
            <h2 id="stats-title" data-split>
              Más alcance. El mismo estándar en cada obra.
            </h2>
          </div>
          <div className="stats__grid">
            {stats.map((s) => (
              <div className={`stats__item ${s.featured ? "stats__item--featured" : ""}`} key={s.label}>
                <span className="stats__rule" aria-hidden="true">
                  <i data-line />
                </span>
                <span className="stats__num">
                  {s.plus && <span className="stats__plus">+</span>}
                  <span data-count={s.n}>0</span>
                </span>
                <span className="stats__label">{s.label}</span>
                <p className="stats__note">{s.note}</p>
              </div>
            ))}
          </div>
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

        {/* 4 · Casos de éxito (incluye clientes) */}
        <ProjectsGallery />

        {/* 5 · Contacto */}
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

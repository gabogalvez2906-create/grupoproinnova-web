import { useRef } from "react";

import PageShell from "./PageShell";
import PageHero from "./PageHero";
import ReachStats from "./ReachStats";
import ContactBand from "./ContactBand";
import ScrollReveal from "./ScrollReveal";
import Tilt from "./Tilt";
import { useOverHero } from "./useOverHero";
import { serviceBySlug, servicePath, type Service } from "./services";

const pad = (n: number) => String(n).padStart(2, "0");

export default function ServicePage({ slug }: { slug: string }) {
  const service = serviceBySlug(slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return <ServiceView service={service} />;
}

function ServiceView({ service: s }: { service: Service }) {
  const heroRef = useRef<HTMLElement>(null);
  const overHero = useOverHero(heroRef);
  const related = s.related.map((r) => serviceBySlug(r)).filter((r): r is Service => !!r);

  return (
    <PageShell overHero={overHero}>
      <PageHero
        ref={heroRef}
        photo={s.hero}
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Servicios", href: "/servicios/" }, { label: s.name }]}
        eyebrow={s.eyebrow}
        title={s.h1}
        lead={s.lead}
        facts={s.facts}
        secondary={{ href: "#alcance", label: "Ver qué incluye ↓" }}
      />

      <section className="svc-intro">
        <div className="svc-intro__head">
          <span className="eyebrow">{s.name}</span>
          <h2 data-split>{s.intro.title}</h2>
        </div>
        <ScrollReveal className="svc-intro__body">
          {s.intro.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </ScrollReveal>
      </section>

      <section className="values svc-scope" id="alcance">
        <div className="values__inner">
          <span className="eyebrow eyebrow--light">Qué incluye</span>
          <h2 data-split>{s.scope.title}</h2>
          <ScrollReveal stagger className="pillars">
            {s.scope.items.map((item, i) => (
              <div className="pillar" key={item.title} data-spot>
                <span className="pillar__num">{pad(i + 1)}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <section className="svc-gallery">
        <div className="svc-gallery__head">
          <span className="eyebrow">Obra real</span>
          <h2 data-split>{s.gallery.title}</h2>
        </div>
        <div className="svc-gallery__grid">
          {s.gallery.photos.map((photo) => (
            <figure className="svc-gallery__item" key={photo.alt}>
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" data-parallax />
              <figcaption>{photo.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <ReachStats eyebrow="Por qué Proinnova" title="Un solo responsable. Capacidad para cumplir." />

      <section className="faq" aria-labelledby="faq-title">
        <div className="faq__head">
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2 id="faq-title" data-split>
            Lo que nos preguntan
          </h2>
        </div>
        <div className="faq__list">
          {s.faqs.map((f) => (
            <details className="faq__item" key={f.q}>
              <summary data-cursor="interactive">
                <h3>{f.q}</h3>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <div className="faq__a">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="related" aria-labelledby="related-title">
        <div className="related__head">
          <span className="eyebrow">Otros servicios</span>
          <h2 id="related-title" data-split>
            También construimos
          </h2>
        </div>
        <ScrollReveal stagger className="related__grid">
          {related.map((r) => (
            <Tilt className="especialidad-card" key={r.slug}>
              <a href={servicePath(r.slug)} className="card-link" data-cursor="interactive">
                <img src={r.hero.src} alt="" loading="lazy" decoding="async" />
                <div className="especialidad-card__overlay" />
                <div className="especialidad-card__content">
                  <h3 className="on-dark">{r.name}</h3>
                  <p className="on-dark-soft">{r.summary}</p>
                  <span className="card-link__go" aria-hidden="true">
                    Ver servicio ↗
                  </span>
                </div>
              </a>
            </Tilt>
          ))}
        </ScrollReveal>
        <a className="related__all" href="/servicios/">
          Ver todos los servicios →
        </a>
      </section>

      <ContactBand
        title={s.contactTitle}
        lead="Cuéntenos qué necesita construir. Le respondemos con un alcance claro y un presupuesto desglosado."
        subject={`Cotización: ${s.name}`}
      />
    </PageShell>
  );
}

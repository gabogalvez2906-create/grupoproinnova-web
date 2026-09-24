import { useRef } from "react";

import PageShell from "./PageShell";
import PageHero from "./PageHero";
import ReachStats from "./ReachStats";
import ContactBand from "./ContactBand";
import ScrollReveal from "./ScrollReveal";
import { useOverHero } from "./useOverHero";
import { HUB, SERVICES, servicePath } from "./services";

const pad = (n: number) => String(n).padStart(2, "0");

/** /servicios/ — every service page, one card each. */
export default function ServicesHub() {
  const heroRef = useRef<HTMLElement>(null);
  const overHero = useOverHero(heroRef);

  return (
    <PageShell overHero={overHero}>
      <PageHero
        ref={heroRef}
        photo={HUB.hero}
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Servicios" }]}
        eyebrow={HUB.eyebrow}
        title={HUB.h1}
        lead={HUB.lead}
        secondary={{ href: "#catalogo", label: "Ver servicios ↓" }}
      />

      <section className="svc-intro">
        <div className="svc-intro__head">
          <span className="eyebrow">Un solo contrato</span>
          <h2 data-split>Todas las especialidades de su obra, en un mismo equipo.</h2>
        </div>
        <ScrollReveal className="svc-intro__body">
          {HUB.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </ScrollReveal>
      </section>

      <section className="hub" id="catalogo" aria-label="Servicios">
        <ScrollReveal stagger className="hub__grid">
          {SERVICES.map((s, i) => (
            <a className="hub__card" href={servicePath(s.slug)} key={s.slug} data-cursor="interactive">
              <span className="hub__media">
                <img src={s.hero.src} alt={s.hero.alt} loading="lazy" decoding="async" />
              </span>
              <span className="hub__body">
                <span className="hub__num">{pad(i + 1)}</span>
                <span className="hub__title">{s.name}</span>
                <span className="hub__summary">{s.summary}</span>
                <span className="hub__go" aria-hidden="true">
                  Ver servicio ↗
                </span>
              </span>
            </a>
          ))}
        </ScrollReveal>
        <p className="hub__more">{HUB.more}</p>
      </section>

      <ReachStats />

      <ContactBand
        title="Cuéntenos qué quiere construir."
        lead="Le respondemos con un alcance claro y un presupuesto desglosado, sin costos ocultos."
        subject="Cotización de proyecto"
      />
    </PageShell>
  );
}

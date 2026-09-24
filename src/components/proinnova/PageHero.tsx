import { forwardRef, type ReactNode } from "react";

import MagneticButton from "./MagneticButton";
import type { Photo } from "./services";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  photo: Photo;
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  lead: string;
  facts?: { label: string; value: string }[];
  secondary?: { href: string; label: string };
  children?: ReactNode;
}

/**
 * Photo hero for inner pages. The eyebrow sits inside the H1 (same as the home
 * hero) so the location keyword is part of the page's main heading.
 */
const PageHero = forwardRef<HTMLElement, PageHeroProps>(function PageHero(
  { photo, crumbs, eyebrow, title, lead, facts, secondary },
  ref,
) {
  return (
    <section className="page-hero" ref={ref} id="inicio">
      <img
        className="page-hero__img"
        src={photo.src}
        alt={photo.alt}
        fetchPriority="high"
        decoding="async"
      />
      <div className="page-hero__scrim" aria-hidden="true" />

      <div className="page-hero__inner">
        <nav className="crumbs" aria-label="Ruta de navegación">
          <ol>
            {crumbs.map((c) => (
              <li key={c.label}>
                {c.href ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="page-hero__title">
          <span className="page-hero__eyebrow eyebrow eyebrow--light">{eyebrow}</span>{" "}
          <span className="page-hero__h">{title}</span>
        </h1>
        <p className="page-hero__lead">{lead}</p>

        <div className="page-hero__cta">
          <MagneticButton href="#contacto">Cotizar mi proyecto</MagneticButton>
          {secondary && (
            <a className="page-hero__link" href={secondary.href} data-cursor="interactive">
              {secondary.label}
            </a>
          )}
        </div>
      </div>

      {facts && (
        <dl className="page-hero__facts">
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
});

export default PageHero;

import { useEffect, useState } from "react";

import Logo from "./Logo";
import MagneticButton from "./MagneticButton";

export default function SiteNav({ overHero, home }: { overHero: boolean; home: boolean }) {
  // On the home page the sections are right there; elsewhere the links go back to them.
  const at = (id: string) => (home ? `#${id}` : `/#${id}`);
  const links = [
    { href: at("quienes-somos"), label: "Nosotros" },
    { href: at("valores"), label: "Valores" },
    { href: home ? "#servicios" : "/servicios/", label: "Servicios" },
    { href: at("casos"), label: "Casos" },
  ];

  // Phones: the inline links don't fit, so they live in a full-screen menu.
  const [open, setOpen] = useState(false);

  // Inner pages: once the photo hero starts scrolling, its text would slide under the
  // transparent bar and collide with the logo, so the bar turns solid dark.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (home) return;
    const sync = () => setScrolled(window.scrollY > 24);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, [home]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("menu-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <header
      className={`nav ${overHero && !open ? "nav--over-hero" : ""} ${open ? "nav--menu-open" : ""} ${
        scrolled ? "nav--scrolled" : ""
      }`}
    >
      <div className="nav__inner">
        <a className="nav__logo" href={home ? "#inicio" : "/"} aria-label="Grupo Proinnova, ir al inicio">
          <Logo variant={overHero || open ? "on-dark" : "on-light"} />
        </a>
        <nav className="nav__links" aria-label="Principal">
          {links.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <MagneticButton href="#contacto" variant="outline" className="nav__cta">
            Hablemos
          </MagneticButton>
          <button
            type="button"
            className="nav__menu-btn"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav id="menu-movil" className={`nav__mobile ${open ? "is-open" : ""}`} aria-label="Menú" aria-hidden={!open}>
        <ul>
          {[...links, { href: "#contacto", label: "Contacto" }].map((l) => (
            <li key={l.label}>
              <a href={l.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

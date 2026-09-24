import PageShell from "./PageShell";
import ContactBand from "./ContactBand";
import { SERVICES, servicePath } from "./services";

/** GitHub Pages serves this for any URL that does not exist (as 404.html, noindex). */
export default function NotFound() {
  return (
    <PageShell overHero>
      <section className="not-found" id="inicio">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1 className="not-found__title">Esta página no existe.</h1>
        <p className="not-found__lead">
          Puede que el enlace esté mal escrito o que la página se haya movido. Estos son los caminos
          principales:
        </p>
        <ul className="not-found__links">
          <li>
            <a href="/">Inicio</a>
          </li>
          <li>
            <a href="/servicios/">Servicios</a>
          </li>
          {SERVICES.slice(0, 4).map((s) => (
            <li key={s.slug}>
              <a href={servicePath(s.slug)}>{s.name}</a>
            </li>
          ))}
        </ul>
      </section>
      <ContactBand />
    </PageShell>
  );
}

/**
 * Proinnova lockup, redrawn as vector from the brand artwork.
 * Geometry measured from the original file (icon 176 × 276).
 *
 * `variant="on-dark"` flips the ink parts to cream so the mark stays legible
 * over the hero; `tagline` adds the full stacked lockup used in the footer.
 */
export default function Logo({
  variant = "on-light",
  tagline = false,
  className = "",
}: {
  variant?: "on-light" | "on-dark";
  tagline?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`logo logo--${variant} ${tagline ? "logo--stacked" : ""} ${className}`.trim()}
    >
      <svg className="logo__icon" viewBox="0 0 176 276" role="img" aria-label="Proinnova">
        {/* left pillar */}
        <path className="logo__ink" d="M0 0h42v276H0z" />
        {/* angled wall plane */}
        <path className="logo__tan" d="M60 75 136 2v198l-76 70z" />
        {/* narrow pillar and its cap */}
        <path className="logo__grey" d="M152 50h22v226h-22z" />
        <path className="logo__ink" d="M152 0h22v21h-22z" />
        {/* base */}
        <path className="logo__ink" d="M0 267h176v9H0z" />
      </svg>

      <span className="logo__lockup">
        <span className="logo__word">
          <span className="logo__word-pro">PRO</span>
          <span className="logo__word-innova">INNOVA</span>
        </span>
        {tagline && <span className="logo__tagline">Construcción e Innovación</span>}
      </span>
    </span>
  );
}

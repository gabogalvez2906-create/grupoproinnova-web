/**
 * Proinnova mark, rebuilt as vector from the brand artwork:
 * stepped towers with bevelled tops, gold + ink.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <svg className="logo__icon" viewBox="0 0 64 64" role="img" aria-label="Proinnova">
        <path d="M4 30 L14 30 L14 60 L4 60 Z" fill="var(--pi-gold)" />
        <path d="M17 22 L27 15 L27 60 L17 60 Z" fill="var(--pi-gold-deep)" />
        <path d="M30 12 L41 4 L41 60 L30 60 Z" fill="var(--pi-ink)" />
        <path d="M44 26 L54 19 L54 50 L44 50 Z" fill="var(--pi-ink)" />
        <path d="M44 50 L60 50 L60 60 L44 60 Z" fill="var(--pi-ink)" />
      </svg>
      <span className="logo__word">
        <span className="logo__word-pro">PRO</span>
        <span className="logo__word-innova">INNOVA</span>
      </span>
    </span>
  );
}

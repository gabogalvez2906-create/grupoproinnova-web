import { useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
  /** Opens in a new tab (WhatsApp, other sites). */
  external?: boolean;
}

export default function MagneticButton({
  href,
  children,
  variant = "solid",
  className = "",
  external = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.35;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    gsap.to(el, { x, y, duration: 0.4, ease: "elastic.out(1, 0.4)" });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.35)" });
  };

  return (
    <a
      ref={ref}
      href={href}
      className={`magnetic-btn magnetic-btn--${variant} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-cursor="interactive"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span>{children}</span>
    </a>
  );
}

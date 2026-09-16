import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface MarqueeProps {
  items: string[];
}

export default function Marquee({ items }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const width = track.scrollWidth / 2;
      gsap.to(track, { x: -width, duration: width / 60, ease: "none", repeat: -1 });
    },
    { scope: trackRef },
  );

  const loop = [...items, ...items];

  return (
    <div className="marquee">
      <div className="marquee__track" ref={trackRef}>
        {loop.map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`} aria-hidden={i >= items.length}>
            {item}
            <span className="marquee__dot" aria-hidden="true">
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

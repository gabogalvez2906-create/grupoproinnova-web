import { useEffect, useState, type RefObject } from "react";

/** True while `ref`'s bottom edge is still under the fixed nav, i.e. the nav sits on the dark hero. */
export function useOverHero(ref: RefObject<HTMLElement | null>) {
  const [over, setOver] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => setOver(el.getBoundingClientRect().bottom > 90);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [ref]);

  return over;
}

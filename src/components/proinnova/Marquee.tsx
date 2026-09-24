interface MarqueeProps {
  items: string[];
}

/** Brand words as a fixed band under the hero (it used to scroll sideways). */
export default function Marquee({ items }: MarqueeProps) {
  return (
    <div className="marquee">
      <ul className="marquee__track">
        {items.map((item, i) => (
          <li className="marquee__item" key={item}>
            {i > 0 && (
              <span className="marquee__dot" aria-hidden="true">
                ●
              </span>
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

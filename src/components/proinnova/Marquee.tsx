interface MarqueeProps {
  items: string[];
}

/**
 * Brand values as a fixed, quiet band under the hero: the wordmark's typeface,
 * wide tracking, one column per word with hairline dividers.
 */
export default function Marquee({ items }: MarqueeProps) {
  return (
    <div className="brand-band">
      <ul className="brand-band__list" aria-label="Lo que nos define">
        {items.map((item) => (
          <li className="brand-band__item" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

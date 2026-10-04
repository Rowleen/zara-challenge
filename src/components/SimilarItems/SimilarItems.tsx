import { useEffect, useRef, useState } from "react";

import { ProductCard } from "@components/ProductCard/ProductCard";

import type { ProductSummary } from "@/lib/types/product";

import "./similar-items.sass";

type SimilarItemsProps = {
  products: ProductSummary[];
};

type ScrollMetrics = {
  thumbWidth: number;
  thumbLeft: number;
};

export function SimilarItems({ products }: SimilarItemsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    thumbWidth: 100,
    thumbLeft: 0,
  });

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateMetrics = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroller;
      const thumbWidth =
        scrollWidth > 0 ? (clientWidth / scrollWidth) * 100 : 100;
      const maxScroll = scrollWidth - clientWidth;
      const thumbLeft =
        maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - thumbWidth) : 0;

      setMetrics({ thumbWidth, thumbLeft });
    };

    updateMetrics();
    scroller.addEventListener("scroll", updateMetrics, { passive: true });
    window.addEventListener("resize", updateMetrics);

    return () => {
      scroller.removeEventListener("scroll", updateMetrics);
      window.removeEventListener("resize", updateMetrics);
    };
  }, [products]);

  if (products.length === 0) return null;

  return (
    <section className="similar-items" aria-labelledby="similar-title">
      <h2 id="similar-title" className="similar-items__title">
        SIMILAR ITEMS
      </h2>

      <div ref={scrollerRef} className="similar-items__scroller">
        <ul className="similar-items__track" aria-label="Similar smartphones">
          {products.map((product) => (
            <li key={product.id} className="similar-items__item">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>

      <div className="similar-items__progress" aria-hidden="true">
        <div
          className="similar-items__thumb"
          style={{
            width: `${metrics.thumbWidth}%`,
            left: `${metrics.thumbLeft}%`,
          }}
        />
      </div>
    </section>
  );
}

import { ProductCard } from "@components/ProductCard/ProductCard";

import type { ProductSummary } from "@/lib/types/product";

import "./product-grid.sass";

type ProductGridProps = {
  products: ProductSummary[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <ul className="product-grid" aria-label="Smartphones">
      {products.map((product) => (
        <li key={product.id} className="product-grid__item">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

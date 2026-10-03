import { Link } from "react-router-dom";

import { formatPrice } from "@/lib/format/price";

import type { ProductSummary } from "@/lib/types/product";

import "./product-card.sass";

type ProductCardProps = {
  product: ProductSummary;
};

export function ProductCard({ product }: ProductCardProps) {
  const { id, brand, name, basePrice, imageUrl } = product;
  const priceLabel = formatPrice(basePrice);

  return (
    <article className="product-card">
      <Link
        to={`/products/${id}`}
        className="product-card__link"
        aria-label={`${brand} ${name}, ${priceLabel}`}
      >
        <div className="product-card__media">
          <img src={imageUrl} alt="" loading="lazy" decoding="async" />
        </div>

        <div className="product-card__body">
          <p className="product-card__brand" aria-hidden="true">
            {brand}
          </p>

          <div className="product-card__footer">
            <h2 className="product-card__name" aria-hidden="true">
              {name}
            </h2>

            <p className="product-card__price" aria-hidden="true">
              {priceLabel}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

import type { ProductDetail } from "@/lib/types/product";

import "./specifications.sass";

type SpecificationsProps = {
  product: ProductDetail;
};

const SPEC_ROWS: {
  label: string;
  value: (product: ProductDetail) => string;
}[] = [
  { label: "BRAND", value: (p) => p.brand },
  { label: "NAME", value: (p) => p.name },
  { label: "DESCRIPTION", value: (p) => p.description },
  { label: "SCREEN", value: (p) => p.specs.screen },
  { label: "RESOLUTION", value: (p) => p.specs.resolution },
  { label: "PROCESSOR", value: (p) => p.specs.processor },
  { label: "MAIN CAMERA", value: (p) => p.specs.mainCamera },
  { label: "SELFIE CAMERA", value: (p) => p.specs.selfieCamera },
  { label: "BATTERY", value: (p) => p.specs.battery },
  { label: "OS", value: (p) => p.specs.os },
  { label: "SCREEN REFRESH RATE", value: (p) => p.specs.screenRefreshRate },
];

export function Specifications({ product }: SpecificationsProps) {
  return (
    <section className="specifications" aria-labelledby="specifications-title">
      <h2 id="specifications-title" className="specifications__title">
        SPECIFICATIONS
      </h2>

      <dl className="specifications__list">
        {SPEC_ROWS.map((row) => (
          <div key={row.label} className="specifications__row">
            <dt>{row.label}</dt>
            <dd>{row.value(product)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

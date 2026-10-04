import { useId, useState } from "react";
import { ProductGrid } from "@components/ProductGrid/ProductGrid";
import { ResultsCount } from "@components/ResultsCount/ResultsCount";
import { SearchBar } from "@components/SearchBar/SearchBar";
import { useProductSearch } from "@/hooks/useProductSearch";
import "./home-page.sass";

export function HomePage() {
  const resultsCountId = useId();
  const [query, setQuery] = useState("");
  const { products, count, isLoading, isSearching, error } =
    useProductSearch(query);

  return (
    <main className="home">
      <div className="home__toolbar">
        <SearchBar
          value={query}
          onChange={setQuery}
          describedBy={resultsCountId}
        />
        <ResultsCount id={resultsCountId} count={count} />
      </div>

      {error ? (
        <p className="home__status" role="alert">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <p className="home__status" role="status">
          Loading…
        </p>
      ) : null}

      {!isLoading && !error ? (
        <div
          className="home__results"
          aria-busy={isSearching}
          aria-live="polite"
        >
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <p className="home__status" role="status">
              No smartphones found.
            </p>
          )}
        </div>
      ) : null}
    </main>
  );
}

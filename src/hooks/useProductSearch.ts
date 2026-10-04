import { useEffect, useRef, useState } from "react";
import { isAbortError } from "@/lib/http/apiError";
import { getProducts } from "@/services/products";
import type { ProductSummary } from "@/lib/types/product";
import { useDebouncedValue } from "./useDebouncedValue";

const SEARCH_DEBOUNCE_MS = 300;

export function useProductSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);
  const requestIdRef = useRef(0);
  const [result, setResult] = useState<{
    query: string;
    products: ProductSummary[];
  } | null>(null);
  const [error, setError] = useState<{ query: string; message: string } | null>(
    null,
  );

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    getProducts(debouncedQuery, controller.signal)
      .then((products) => {
        if (requestId !== requestIdRef.current) return;
        setResult({ query: debouncedQuery, products });
        setError(null);
      })
      .catch((reason: unknown) => {
        if (requestId !== requestIdRef.current || isAbortError(reason)) return;
        setError({
          query: debouncedQuery,
          message:
            reason instanceof Error
              ? reason.message
              : "Could not load products.",
        });
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  const matches = result?.query === debouncedQuery;
  const errorMessage = error?.query === debouncedQuery ? error.message : null;

  const products = matches && result ? result.products : [];

  return {
    products,
    count: products.length,
    isLoading: !result && !errorMessage,
    isSearching: Boolean(result) && !matches && !errorMessage,
    error: errorMessage,
  };
}

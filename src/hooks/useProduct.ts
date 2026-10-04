import { useEffect, useState } from "react";
import { isAbortError } from "@/lib/http/apiError";
import { getProduct } from "@/services/products";
import type { ProductDetail } from "@/lib/types/product";

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<{ id: string; message: string } | null>(
    null,
  );

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    getProduct(id, controller.signal)
      .then((data) => {
        setProduct(data);
      })
      .catch((reason: unknown) => {
        if (isAbortError(reason)) return;
        setError({
          id,
          message:
            reason instanceof Error
              ? reason.message
              : "Could not load the product.",
        });
      });

    return () => controller.abort();
  }, [id]);

  const matches = Boolean(id) && product?.id === id;
  const errorMessage = id && error?.id === id ? error.message : null;

  return {
    product: matches ? product : null,
    isLoading: Boolean(id) && !matches && !errorMessage,
    error: errorMessage,
  };
}

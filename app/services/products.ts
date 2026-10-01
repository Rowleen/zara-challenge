import { ApiError } from "@/lib/http/apiError";
import { apiGet } from "@/lib/http/client";
import type { ProductEntity, ProductListEntity } from "@/lib/types/product";

const CATALOG_LIMIT = 20;

export async function getProducts(
  search = "",
  signal?: AbortSignal,
): Promise<ProductListEntity[]> {
  const params = new URLSearchParams({ limit: String(CATALOG_LIMIT) });
  const query = search.trim();
  if (query) params.set("search", query);

  const data = await apiGet<ProductListEntity[]>(
    `/api/products?${params.toString()}`,
    signal,
  );

  if (!Array.isArray(data)) {
    throw new ApiError("Invalid catalog response.", 500);
  }

  return data;
}

export async function getProduct(
  id: string,
  signal?: AbortSignal,
): Promise<ProductEntity> {
  const data = await apiGet<ProductEntity>(
    `/api/products/${encodeURIComponent(id)}`,
    signal,
  );

  if (!data?.id) {
    throw new ApiError("Invalid product response.", 500);
  }

  return data;
}

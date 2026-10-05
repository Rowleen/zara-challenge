import type { ErrorEntity } from "@/lib/types/product";
import { ApiError } from "./apiError";
import { apiUrl } from "./config";

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as ErrorEntity;
    const message = body.message ?? body.error ?? "Request failed.";

    return new ApiError(message, response.status);
  } catch {
    return new ApiError("Request failed.", response.status);
  }
}

export async function apiGet<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(apiUrl(path), { signal, cache: "no-store" });

  if (!response.ok) {
    throw await toApiError(response);
  }

  return response.json() as Promise<T>;
}

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getProducts } from "@/services/products";
import type { ProductSummary } from "@/lib/types/product";
import { useProductSearch } from "./useProductSearch";

vi.mock("@/services/products", () => ({
  getProducts: vi.fn(),
}));

const mockedGetProducts = vi.mocked(getProducts);

const iphone: ProductSummary = {
  id: "1",
  brand: "Apple",
  name: "iPhone 15",
  basePrice: 999,
  imageUrl: "/iphone.jpg",
};

const redmi: ProductSummary = {
  id: "2",
  brand: "Xiaomi",
  name: "Redmi Note",
  basePrice: 199,
  imageUrl: "/redmi.jpg",
};

describe("useProductSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockedGetProducts.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function advanceDebounce() {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
  }

  it("loads products for the initial trimmed query", async () => {
    mockedGetProducts.mockResolvedValue([iphone]);

    const { result } = renderHook(() => useProductSearch("  iphone  "));

    expect(mockedGetProducts).toHaveBeenCalledWith(
      "iphone",
      expect.any(AbortSignal),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.products).toEqual([iphone]);
    expect(result.current.count).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it("shows searching state without stale products while a new query loads", async () => {
    mockedGetProducts.mockResolvedValueOnce([redmi]);

    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(query),
      { initialProps: { query: "xiaomi" } },
    );

    await advanceDebounce();
    expect(result.current.products).toEqual([redmi]);

    let resolveApple!: (products: ProductSummary[]) => void;
    mockedGetProducts.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveApple = resolve;
        }),
    );

    rerender({ query: "apple" });
    await advanceDebounce();

    expect(result.current.products).toEqual([]);
    expect(result.current.isSearching).toBe(true);
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      resolveApple([iphone]);
    });

    expect(result.current.products).toEqual([iphone]);
    expect(result.current.isSearching).toBe(false);
  });

  it("ignores stale responses that resolve out of order", async () => {
    let resolveXiaomi!: (products: ProductSummary[]) => void;
    let resolveApple!: (products: ProductSummary[]) => void;

    mockedGetProducts.mockImplementation((query = "") => {
      if (query === "xiaomi") {
        return new Promise((resolve) => {
          resolveXiaomi = resolve;
        });
      }

      if (query === "apple") {
        return new Promise((resolve) => {
          resolveApple = resolve;
        });
      }

      return Promise.resolve([]);
    });

    const { result, rerender } = renderHook(
      ({ query }) => useProductSearch(query),
      { initialProps: { query: "xiaomi" } },
    );

    await advanceDebounce();
    rerender({ query: "apple" });
    await advanceDebounce();

    await act(async () => {
      resolveApple([iphone]);
    });
    expect(result.current.products).toEqual([iphone]);

    await act(async () => {
      resolveXiaomi([redmi]);
    });
    expect(result.current.products).toEqual([iphone]);
    expect(result.current.count).toBe(1);
  });

  it("exposes an error for the current query", async () => {
    mockedGetProducts.mockRejectedValueOnce(new Error("Network down"));

    const { result } = renderHook(() => useProductSearch("iphone"));
    await advanceDebounce();

    expect(result.current.error).toBe("Network down");
    expect(result.current.products).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSearching).toBe(false);
  });

  it("ignores AbortError responses", async () => {
    const abortError = new Error("Aborted");
    abortError.name = "AbortError";
    mockedGetProducts.mockRejectedValueOnce(abortError);

    const { result } = renderHook(() => useProductSearch("iphone"));
    await advanceDebounce();

    expect(result.current.error).toBeNull();
    expect(result.current.products).toEqual([]);
  });
});

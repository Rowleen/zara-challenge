import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getProduct } from "@services/products";
import { sampleProduct } from "@test/fixtures/product";
import { useProduct } from "./useProduct";

vi.mock("@services/products", () => ({
  getProduct: vi.fn(),
}));

const mockedGetProduct = vi.mocked(getProduct);

describe("useProduct", () => {
  beforeEach(() => {
    mockedGetProduct.mockReset();
  });

  it("loads a product by id", async () => {
    mockedGetProduct.mockResolvedValue(sampleProduct);

    const { result } = renderHook(() => useProduct("p1"));

    expect(result.current.isLoading).toBe(true);
    expect(mockedGetProduct).toHaveBeenCalledWith(
      "p1",
      expect.any(AbortSignal),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.product).toEqual(sampleProduct);
    expect(result.current.error).toBeNull();
  });

  it("does not fetch when id is missing", () => {
    const { result } = renderHook(() => useProduct(undefined));

    expect(mockedGetProduct).not.toHaveBeenCalled();
    expect(result.current.product).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("exposes an error for the current id", async () => {
    mockedGetProduct.mockRejectedValueOnce(new Error("Not found"));

    const { result } = renderHook(() => useProduct("missing"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBe("Not found");
    expect(result.current.product).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("ignores AbortError responses", async () => {
    const abortError = new Error("Aborted");
    abortError.name = "AbortError";
    mockedGetProduct.mockRejectedValueOnce(abortError);

    const { result } = renderHook(() => useProduct("p1"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.product).toBeNull();
  });

  it("ignores stale responses when the id changes", async () => {
    let resolveFirst!: (product: typeof sampleProduct) => void;
    let resolveSecond!: (product: typeof sampleProduct) => void;

    mockedGetProduct.mockImplementation((id: string) => {
      if (id === "p1") {
        return new Promise((resolve) => {
          resolveFirst = resolve;
        });
      }

      return new Promise((resolve) => {
        resolveSecond = resolve;
      });
    });

    const { result, rerender } = renderHook(({ id }) => useProduct(id), {
      initialProps: { id: "p1" },
    });

    rerender({ id: "p2" });

    const secondProduct = { ...sampleProduct, id: "p2", name: "Pixel 8" };

    await act(async () => {
      resolveSecond(secondProduct);
    });
    expect(result.current.product).toEqual(secondProduct);

    await act(async () => {
      resolveFirst(sampleProduct);
    });
    expect(result.current.product).toEqual(secondProduct);
  });
});

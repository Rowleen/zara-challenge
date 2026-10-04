import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import type { AddCartItemInput } from "@/lib/types/cart";
import { CartProvider } from "./CartProvider";
import { useCart } from "./useCart";

const STORAGE_KEY = "zara-challenge-cart";

const sampleItem: AddCartItemInput = {
  productId: "p1",
  brand: "Apple",
  name: "iPhone 15",
  storage: "128 GB",
  color: "Black",
  price: 999,
  imageUrl: "/iphone.jpg",
};

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("CartProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("throws when useCart is used outside the provider", () => {
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart must be used within CartProvider.",
    );
  });

  it("adds items, updates totals and persists to localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);

    act(() => {
      result.current.addItem(sampleItem);
      result.current.addItem({ ...sampleItem, price: 50, name: "Case" });
    });

    expect(result.current.count).toBe(2);
    expect(result.current.total).toBe(1049);
    expect(result.current.items[0]).toMatchObject(sampleItem);
    expect(result.current.items[0]?.cartItemId).toBeTruthy();

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toHaveLength(2);
  });

  it("removes an item by cartItemId", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(sampleItem);
      result.current.addItem({ ...sampleItem, name: "Case", price: 50 });
    });

    const [first, second] = result.current.items;
    expect(first && second).toBeTruthy();

    act(() => {
      result.current.removeItem(first!.cartItemId);
    });

    expect(result.current.items).toEqual([second]);
    expect(result.current.count).toBe(1);
    expect(result.current.total).toBe(50);
  });

  it("hydrates items from localStorage on mount", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...sampleItem, cartItemId: "stored-1" }]),
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([
      { ...sampleItem, cartItemId: "stored-1" },
    ]);
    expect(result.current.count).toBe(1);
    expect(result.current.total).toBe(999);
  });

  it("starts empty when localStorage has invalid data", () => {
    localStorage.setItem(STORAGE_KEY, "{not-json");

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
  });
});

import { useEffect, useState, type ReactNode } from "react";
import type { AddCartItemInput, CartItem } from "@/lib/types/cart";
import { CartContext } from "./cartContext";

const STORAGE_KEY = "zara-challenge-cart";

function readStoredItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(readStoredItems);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: AddCartItemInput) => {
    setItems((current) => [
      ...current,
      { ...item, cartItemId: crypto.randomUUID() },
    ]);
  };

  const removeItem = (cartItemId: string) => {
    setItems((current) =>
      current.filter((item) => item.cartItemId !== cartItemId),
    );
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count: items.length,
        total,
        addItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

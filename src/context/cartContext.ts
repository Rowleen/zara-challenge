import { createContext } from "react";
import type { AddCartItemInput, CartItem } from "@/lib/types/cart";

export type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (cartItemId: string) => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

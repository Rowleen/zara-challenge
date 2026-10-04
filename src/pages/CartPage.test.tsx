import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { CartProvider } from "@context/CartProvider";
import type { CartItem } from "@lib/types/cart";

import { CartPage } from "./CartPage";

const STORAGE_KEY = "zara-challenge-cart";

const cartItem: CartItem = {
  cartItemId: "c1",
  productId: "p1",
  brand: "Apple",
  name: "iPhone 15",
  storage: "128 GB",
  color: "Black",
  price: 999,
  imageUrl: "/iphone.jpg",
};

function renderCartPage(items: CartItem[] = []) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  return render(
    <MemoryRouter>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </MemoryRouter>,
  );
}

describe("CartPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows empty state without checkout actions", () => {
    renderCartPage();

    expect(
      screen.getByRole("heading", { name: "CART (0)" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Your cart is empty.");
    expect(
      screen.getByRole("link", { name: "CONTINUE SHOPPING" }),
    ).toHaveAttribute("href", "/");
    expect(screen.queryByText("TOTAL")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "PAY" }),
    ).not.toBeInTheDocument();
  });

  it("renders items with total and pay action", () => {
    renderCartPage([
      cartItem,
      { ...cartItem, cartItemId: "c2", name: "Case", price: 50 },
    ]);

    expect(
      screen.getByRole("heading", { name: "CART (2)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "iPhone 15" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Case" })).toBeInTheDocument();
    expect(screen.getByText("TOTAL")).toBeInTheDocument();
    expect(screen.getByText("1049 EUR")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "PAY" })).toBeInTheDocument();
  });

  it("removes an item from the cart", async () => {
    const user = userEvent.setup();
    renderCartPage([cartItem]);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      screen.getByRole("heading", { name: "CART (0)" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Your cart is empty.");
    expect(
      screen.queryByRole("button", { name: "PAY" }),
    ).not.toBeInTheDocument();
  });
});

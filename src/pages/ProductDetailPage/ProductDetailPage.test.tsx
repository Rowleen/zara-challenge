import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CartProvider } from "@context/CartProvider";
import { useProduct } from "@hooks/useProduct";

import { sampleProduct } from "@test/fixtures/product";

import { ProductDetailPage } from "./ProductDetailPage";

vi.mock("@/hooks/useProduct", () => ({
  useProduct: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
  },
}));

const mockedUseProduct = vi.mocked(useProduct);

function renderDetailPage() {
  return render(
    <MemoryRouter initialEntries={["/products/p1"]}>
      <CartProvider>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>,
  );
}

describe("ProductDetailPage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedUseProduct.mockReset();
    vi.mocked(toast.success).mockReset();
  });

  it("shows loading state", () => {
    mockedUseProduct.mockReturnValue({
      product: null,
      isLoading: true,
      error: null,
    });

    renderDetailPage();

    expect(screen.getByRole("status")).toHaveTextContent("Loading…");
  });

  it("shows error state", () => {
    mockedUseProduct.mockReturnValue({
      product: null,
      isLoading: false,
      error: "Could not load the product.",
    });

    renderDetailPage();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load the product.",
    );
  });

  it("keeps Add to Cart disabled until storage and color are selected", async () => {
    const user = userEvent.setup();
    mockedUseProduct.mockReturnValue({
      product: sampleProduct,
      isLoading: false,
      error: null,
    });

    renderDetailPage();

    const addButton = screen.getByRole("button", { name: "Add to Cart" });
    expect(addButton).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "128 GB" }));
    expect(addButton).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "Black" }));
    expect(addButton).toBeEnabled();
  });

  it("adds the selected configuration to the cart", async () => {
    const user = userEvent.setup();
    mockedUseProduct.mockReturnValue({
      product: sampleProduct,
      isLoading: false,
      error: null,
    });

    renderDetailPage();

    await user.click(screen.getByRole("radio", { name: "256 GB" }));
    await user.click(screen.getByRole("radio", { name: "Blue" }));
    await user.click(screen.getByRole("button", { name: "Add to Cart" }));

    expect(toast.success).toHaveBeenCalledWith("Item added to cart");

    const stored = JSON.parse(
      localStorage.getItem("zara-challenge-cart") ?? "[]",
    );
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      productId: "p1",
      brand: "Apple",
      name: "iPhone 15",
      storage: "256 GB",
      color: "Blue",
      price: 1099,
      imageUrl: "/blue.jpg",
    });
  });
});

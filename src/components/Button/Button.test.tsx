import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button and handles clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Add to Cart</Button>);

    const button = screen.getByRole("button", { name: "Add to Cart" });
    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders as a link when `to` is provided", () => {
    render(
      <MemoryRouter>
        <Button to="/cart">CONTINUE SHOPPING</Button>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: "CONTINUE SHOPPING" }),
    ).toHaveAttribute("href", "/cart");
  });

  it("does not navigate when a link button is disabled", () => {
    render(
      <MemoryRouter>
        <Button to="/cart" disabled>
          CONTINUE SHOPPING
        </Button>
      </MemoryRouter>,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("CONTINUE SHOPPING")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

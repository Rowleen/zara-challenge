import { expect, test, type Page } from "@playwright/test";
import { mockApi } from "./helpers/mockApi";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await page.goto("/");
});

async function addConfiguredProduct(
  page: Page,
  storage: string,
  color: string,
) {
  await page.getByRole("radio", { name: storage }).click();
  await page.getByRole("radio", { name: color }).click();
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByText("Item added to cart").last()).toBeVisible();
}

test("lists smartphones from the catalog", async ({ page }) => {
  await expect(page.getByText("3 RESULTS")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Apple iPhone 15/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Samsung Galaxy S24/i }),
  ).toBeVisible();
});

test("filters the catalog by search", async ({ page }) => {
  await page.getByLabel("Search for a smartphone").fill("xiaomi");

  await expect(page.getByText("1 RESULTS")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Xiaomi Redmi Note/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Apple iPhone 15/i }),
  ).toHaveCount(0);
});

test("adds a configured product to the cart and removes it", async ({
  page,
}) => {
  await page.getByRole("link", { name: /Apple iPhone 15/i }).click();

  await expect(page.getByRole("heading", { name: "iPhone 15" })).toBeVisible();

  const addButton = page.getByRole("button", { name: "Add to Cart" });
  await expect(addButton).toBeDisabled();

  await addConfiguredProduct(page, "256 GB", "Blue");
  await expect(page.getByRole("link", { name: "Cart, 1 items" })).toBeVisible();

  await page.getByRole("link", { name: "Cart, 1 items" }).click();

  await expect(page.getByRole("heading", { name: "CART (1)" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "iPhone 15" })).toBeVisible();
  await expect(page.getByText("256 GB | Blue")).toBeVisible();
  await expect(page.getByRole("article").getByText("1099 EUR")).toBeVisible();
  await expect(page.locator(".cart-page__total")).toContainText("1099 EUR");
  await expect(page.getByRole("button", { name: "PAY" })).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).click();

  await expect(page.getByRole("heading", { name: "CART (0)" })).toBeVisible();
  await expect(page.getByText("Your cart is empty.")).toBeVisible();
  await expect(page.getByRole("button", { name: "PAY" })).toHaveCount(0);
});

test("adds a product and a similar one, then removes one from the cart", async ({
  page,
}) => {
  await page.getByRole("link", { name: /Apple iPhone 15/i }).click();
  await expect(page.getByRole("heading", { name: "iPhone 15" })).toBeVisible();

  await addConfiguredProduct(page, "128 GB", "Black");
  await expect(page.getByRole("link", { name: "Cart, 1 items" })).toBeVisible();

  await page
    .getByRole("list", { name: "Similar smartphones" })
    .getByRole("link", { name: /Samsung Galaxy S24/i })
    .click();

  await expect(page.getByRole("heading", { name: "Galaxy S24" })).toBeVisible();
  await addConfiguredProduct(page, "256 GB", "Gray");
  await expect(page.getByRole("link", { name: "Cart, 2 items" })).toBeVisible();

  await page.getByRole("link", { name: "Cart, 2 items" }).click();

  await expect(page.getByRole("heading", { name: "CART (2)" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "iPhone 15" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Galaxy S24" })).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).first().click();

  await expect(page.getByRole("heading", { name: "CART (1)" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(1);
  await expect(page.getByRole("button", { name: "PAY" })).toBeVisible();
});

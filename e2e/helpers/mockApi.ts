import type { Page } from "@playwright/test";
import { catalog, productDetailsById } from "../fixtures/catalog";

export async function mockApi(page: Page) {
  await page.route("**/api/products**", async (route) => {
    const url = new URL(route.request().url());
    const detailMatch = url.pathname.match(/\/api\/products\/([^/]+)$/);

    if (detailMatch) {
      const id = decodeURIComponent(detailMatch[1] ?? "");
      const product = productDetailsById[id];

      if (!product) {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ message: "Product not found." }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(product),
      });
      return;
    }

    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const products = search
      ? catalog.filter((item) =>
          `${item.brand} ${item.name}`.toLowerCase().includes(search),
        )
      : catalog;

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(products),
    });
  });
}

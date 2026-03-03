import { expect, test } from "./fixtures";

test("/dekujeme page loads and shows thank you content", async ({ page }) => {
  const response = await page.goto("/dekujeme");
  expect(response?.status()).toBe(200);
  const heading = page.locator("h1, h2").first();
  await expect(heading).toBeVisible();
});

import { expect, test } from "./fixtures";

test.describe("PPC landing page", () => {
  test("loads with UTM params preserved", async ({ page }) => {
    const response = await page.goto(
      "/ppc?utm_source=google&utm_medium=cpc&utm_campaign=test",
    );
    expect(response?.status()).toBe(200);
    expect(page.url()).toContain("utm_source=google");
  });

  test("contains lead form", async ({ page }) => {
    await page.goto("/ppc");
    const form = page.locator("form");
    await expect(form.first()).toBeVisible();
  });
});

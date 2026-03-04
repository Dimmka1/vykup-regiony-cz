import { expect, test } from "./fixtures";

test.describe("Lead form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("happy path: 3 steps → submit → redirect to /dekujeme", async ({
    page,
  }) => {
    const nextButton = page.getByRole("button", {
      name: "Pokračovat",
      exact: true,
    });

    await nextButton.click();
    await page.locator("#address").fill("Vodičkova 30");
    await page.locator("#postal-code").fill("110 00");
    await page.locator("#city").fill("Praha");
    await nextButton.click();

    await page.locator("#lead-name").fill("E2E Test");
    await page.locator("#lead-phone").fill("+420 777 888 999");

    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          lead_id: "test-123",
          message: "Lead accepted",
        }),
      }),
    );

    await page.getByLabel(/souhlasím se zpracováním/i).check();
    await page.getByRole("button", { name: /odeslat/i }).click();

    await expect(page).toHaveURL(/\/dekujeme/, { timeout: 10_000 });
  });

  test("form validation: missing required fields shows errors", async ({
    page,
  }) => {
    const nextButton = page.getByRole("button", {
      name: "Pokračovat",
      exact: true,
    });

    await nextButton.click();
    await nextButton.click();

    const hasError = await page.locator(".text-red-500, [role=alert]").count();
    const stillOnStep1 = await page.locator("#address").isVisible();
    expect(hasError > 0 || stillOnStep1).toBeTruthy();
  });
});

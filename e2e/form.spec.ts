import { expect, test } from "./fixtures";

test.describe("Lead form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Close any popups/dialogs that may appear
    const dialog = page.locator("[role=dialog]");
    if (await dialog.isVisible({ timeout: 2000 }).catch(() => false)) {
      const closeBtn = dialog.getByRole("button", { name: /zavřít|close|×/i });
      if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeBtn.click();
      }
    }
  });

  test("happy path: 3 steps → submit → redirect to /dekujeme", async ({
    page,
  }) => {
    // Step 1: property type is pre-selected (byt), click Pokračovat
    await page
      .getByRole("button", { name: "Pokračovat", exact: true })
      .click({ force: true });

    // Step 2: address
    await page.locator("#address").fill("Vodičkova 30");
    await page.locator("#postal-code").fill("110 00");
    await page.locator("#city").fill("Praha");
    await page
      .getByRole("button", { name: "Pokračovat", exact: true })
      .click({ force: true });

    // Step 3: contact
    await page.locator("#lead-name").fill("E2E Test");
    await page.locator("#lead-phone").fill("+420 777 888 999");

    // Mock API
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

    await page.getByLabel(/souhlasím se zpracováním/i).check({ force: true });
    await page.getByRole("button", { name: /odeslat/i }).click({ force: true });

    await expect(page).toHaveURL(/\/dekujeme/, { timeout: 10_000 });
  });

  test("form validation: missing required fields shows errors", async ({
    page,
  }) => {
    // Step 1 → Step 2 (type pre-selected)
    await page
      .getByRole("button", { name: "Pokračovat", exact: true })
      .click({ force: true });

    // Try to advance without filling address
    await page
      .getByRole("button", { name: "Pokračovat", exact: true })
      .click({ force: true });

    // Should show error or stay on step 2
    const hasError = await page.locator(".text-red-500, [role=alert]").count();
    const stillOnStep2 = await page.locator("#address").isVisible();
    expect(hasError > 0 || stillOnStep2).toBeTruthy();
  });
});

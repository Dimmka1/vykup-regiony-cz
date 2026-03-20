import { expect, test } from "./fixtures";

const FORM_SELECTOR = 'form[aria-label="Formulář poptávky výkupu nemovitosti"]';

test.describe("Lead form", () => {
  // Multi-step form with lazy loading needs more time in CI
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Dismiss exit-intent popup and overlays if present
    await page.evaluate(() => {
      document.querySelector("[role=dialog]")?.remove();
      document
        .querySelectorAll("[aria-modal=true]")
        .forEach((el) => el.remove());
    });
    // Scroll to the lazy-loaded lead form to trigger IntersectionObserver
    const form = page.locator(FORM_SELECTOR);
    await form.scrollIntoViewIfNeeded({ timeout: 15_000 });
  });

  test("happy path: 3 steps → submit → redirect to /dekujeme", async ({
    page,
  }) => {
    // Mock API before interacting so it's ready on submit
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

    // Step 1: property type pre-selected, advance
    await page.getByRole("button", { name: "Pokračovat", exact: true }).click();

    // Step 2: address
    await page.locator("#address").fill("Vodičkova 30");
    await page.locator("#postal-code").fill("110 00");
    await page.locator("#city").fill("Praha");
    await page.getByRole("button", { name: "Pokračovat", exact: true }).click();

    // Step 3: contact
    await page.locator("#lead-name").fill("E2E Test");
    await page.locator("#lead-phone").fill("+420 777 888 999");

    await page.getByLabel(/souhlasím se zpracováním/i).check({ force: true });
    await page.getByRole("button", { name: /odeslat/i }).click();

    await expect(page).toHaveURL(/\/dekujeme/, { timeout: 10_000 });
  });

  test("form validation: missing required fields shows errors", async ({
    page,
  }) => {
    // Step 1 → Step 2
    await page.getByRole("button", { name: "Pokračovat", exact: true }).click();

    // Try advancing without filling required fields
    await page.getByRole("button", { name: "Pokračovat", exact: true }).click();

    // Should show error or stay on step 2
    const hasError = await page.locator(".text-red-500, [role=alert]").count();
    const stillOnStep2 = await page.locator("#address").isVisible();
    expect(hasError > 0 || stillOnStep2).toBeTruthy();
  });
});

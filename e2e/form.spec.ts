import { expect, test } from "./fixtures";

const FORM_SELECTOR = 'form[aria-label="Formulář poptávky výkupu nemovitosti"]';

test.describe("Lead form", () => {
  // Multi-step form with lazy loading needs more time in CI
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Prevent exit-intent popup from triggering when we scroll to the form
    await page.evaluate(() => {
      localStorage.setItem("exit_popup_shown", String(Date.now()));
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

    // Check GDPR consent via evaluate to avoid Firefox controlled-input quirk
    await page.locator(FORM_SELECTOR).evaluate((form) => {
      const cb = form.querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;
      if (cb && !cb.checked) {
        cb.click();
      }
    });

    await page.getByRole("button", { name: /odeslat/i }).click();

    await expect(page).toHaveURL(/\/dekujeme/, { timeout: 10_000 });
  });

  test("form validation: empty fields disable advance button on step 2", async ({
    page,
  }) => {
    // Step 1 → Step 2
    await page.getByRole("button", { name: "Pokračovat", exact: true }).click();

    // On step 2 with empty fields, button should be visually disabled
    const btn = page.getByRole("button", { name: "Pokračovat", exact: true });
    await expect(btn).toHaveClass(/pointer-events-none/);
    await expect(btn).toHaveClass(/cursor-not-allowed/);

    // Should still be on step 2 (address field visible)
    await expect(page.locator("#address")).toBeVisible();
  });
});

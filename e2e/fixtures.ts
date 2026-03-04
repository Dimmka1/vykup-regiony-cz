import { test as base } from "@playwright/test";

/**
 * Extended test fixture that dismisses the GDPR cookie consent banner
 * before every test by setting the cookie_consent cookie.
 */

export const test = base.extend({
  page: async ({ page }, run) => {
    const consent = JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    await page.context().addCookies([
      {
        name: "cookie_consent",
        value: encodeURIComponent(consent),
        domain: "localhost",
        path: "/",
      },
    ]);
    await run(page);
  },
});

export { expect } from "@playwright/test";

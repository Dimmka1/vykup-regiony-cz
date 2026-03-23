import { expect, test } from "./fixtures";

const KEY_PAGES = [
  "/",
  "/jak-to-funguje",
  "/garance-vykupu",
  "/proc-my",
  "/kraje",
  "/dekujeme",
];

for (const path of KEY_PAGES) {
  test(`page ${path} returns 200`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
  });
}

import { test, expect } from "@playwright/test";

test.describe("links page", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("serves at the clean /links URL with all four buttons in order", async ({ page }) => {
    await page.goto("/links");
    await expect(page).toHaveTitle(/Links/);
    const labels = page.locator("#links-root a > span:first-child");
    await expect(labels).toHaveText(["GitHub", "LinkedIn", "Main site", "Email"]);
  });

  test("buttons are comfortably tappable", async ({ page }) => {
    await page.goto("/links");
    for (const link of await page.locator("#links-root a").all()) {
      const box = await link.boundingBox();
      expect(box, "link should be visible").not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(48);
    }
  });

  test("email button is assembled at runtime and absent from static HTML", async ({ page, request }) => {
    await page.goto("/links");
    await expect(page.locator("#links-root a").last()).toHaveAttribute("href", /^mailto:.+@.+\..+/);
    // The inline script keeps the address in two parts; the joined form
    // must never appear in the served HTML.
    const html = await (await request.get("/links.html")).text();
    expect(html).not.toMatch(/qasim\.mahmood13@/);
    expect(html).not.toMatch(/@alumni\.imperial\.ac\.uk/);
  });

  test("dark-mode toggle switches and persists", async ({ page }) => {
    await page.goto("/links");
    const html = page.locator("html");
    const wasDark = await html.evaluate((el) => el.classList.contains("dark"));
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.reload();
    if (wasDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }
  });
});

import { test, expect } from "@playwright/test";

test.describe("page structure", () => {
  test("loads with the right title and all sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Qasim Mahmood/);
    for (const id of ["about", "approach", "skills", "experience", "certifications", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("renders every certification group and card", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#certs-root h3")).toHaveText(["Cloud", "Testing", "DevOps", "AI", "Other"]);
    await expect(page.locator("#certs-root li")).toHaveCount(18);
    // Credential IDs render where known
    await expect(page.locator("#certs-root")).toContainText("id 00525854");
    await expect(page.locator("#certs-root")).toContainText("ExamPro / Apr 2026");
    // Cards with verify URLs are links that open safely in a new tab
    const verifyLinks = page.locator("#certs-root a[href]");
    await expect(verifyLinks).toHaveCount(9);
    await expect(verifyLinks.first()).toHaveAttribute("target", "_blank");
    await expect(verifyLinks.first()).toHaveAttribute("rel", "noopener");
  });

  test("renders colleague testimonials", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#experience figure blockquote")).toHaveCount(3);
    await expect(page.locator("#experience figcaption").first()).toContainText("CTO");
  });

  test("experience timeline is in reverse chronological order", async ({ page }) => {
    await page.goto("/");
    const employers = page.locator("#experience article h3 + p");
    await expect(employers.first()).toHaveText(/Zodia Custody/);
    await expect(employers.last()).toHaveText(/Wyman Gordon/);
  });
});

test.describe("email obfuscation", () => {
  test("mailto links and visible address are assembled at runtime", async ({ page }) => {
    await page.goto("/");
    for (const link of await page.locator("a.js-email").all()) {
      await expect(link).toHaveAttribute("href", /^mailto:.+@.+\..+/);
    }
    await expect(page.locator("#email-text")).toContainText("@");
  });

  test("the raw address is not present in the static HTML", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).not.toMatch(/mailto:/);
    expect(html).not.toMatch(/@alumni\.imperial\.ac\.uk/);
  });
});

test.describe("theme", () => {
  test("toggle switches the theme and persists across reloads", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const wasDark = await html.evaluate((el) => el.classList.contains("dark"));
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await expect(html).toHaveClass(wasDark ? /^(?!.*dark).*$/ : /dark/);
    await page.reload();
    if (wasDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }
  });
});

test.describe("command palette", () => {
  test("opens with ctrl+k, filters, and jumps to a section", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.locator("#cmdk");
    await expect(dialog).toHaveJSProperty("open", true);

    await page.locator("#cmdk-input").fill("experience");
    await expect(page.locator("#cmdk-list button")).toHaveCount(1);
    await page.keyboard.press("Enter");

    await expect(dialog).toHaveJSProperty("open", false);
    await expect(page.locator("#experience")).toBeInViewport();
  });

  test("closes on escape", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await page.keyboard.press("Escape");
    await expect(page.locator("#cmdk")).toHaveJSProperty("open", false);
  });
});

test.describe("scroll effects", () => {
  test("sections gain their check mark when scrolled into view", async ({ page }) => {
    await page.goto("/");
    const check = page.locator("#skills .js-check");
    await expect(check).toHaveClass(/opacity-0/);
    await page.locator("#skills").scrollIntoViewIfNeeded();
    await expect(check).not.toHaveClass(/opacity-0/);
  });

  test("scrollspy marks the visible section in the nav", async ({ page }) => {
    await page.goto("/");
    await page.locator("#certifications").scrollIntoViewIfNeeded();
    await expect(page.locator('#nav-links a[aria-current="location"]')).toHaveAttribute("href", "#certifications");
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger menu opens, navigates, and closes", async ({ page }) => {
    await page.goto("/");
    const menu = page.locator("#nav-mobile");
    await expect(menu).toBeHidden();
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "approach" }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator("#approach")).toBeInViewport();
  });
});

test("custom 404 page renders", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.getByRole("heading", { name: "Element not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "rerun from the start" })).toHaveAttribute("href", "/");
});

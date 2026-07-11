import { test, expect } from "@playwright/test";

test.describe("topographic background", () => {
  for (const path of ["/", "/links", "/404.html"]) {
    test(`on ${path}: decorative, non-interactive, and motion-safe`, async ({ page }) => {
      await page.goto(path);

      const topo = page.locator(".topo").first();
      await expect(topo).toHaveAttribute("aria-hidden", "true");
      expect(await topo.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
      expect(await topo.evaluate((el) => getComputedStyle(el).zIndex)).toBe("-1");

      await expect(page.locator(".topo-layer")).toHaveCount(3);

      const layer = page.locator(".topo-layer").first();
      expect(await layer.evaluate((el) => getComputedStyle(el).animationName)).toBe("topo-drift");

      // The accent index contours must animate in lockstep with layer A,
      // or the highlighted lines drift off their grey counterparts.
      const accent = page.locator(".topo-layer.topo-accent");
      for (const prop of ["animationName", "animationDuration", "animationDirection", "animationTimingFunction"] as const) {
        expect(await accent.evaluate((el, p) => getComputedStyle(el)[p], prop))
          .toBe(await layer.evaluate((el, p) => getComputedStyle(el)[p], prop));
      }

      await page.emulateMedia({ reducedMotion: "reduce" });
      expect(await layer.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    });
  }

  test("contour mask assets are served", async ({ request }) => {
    for (const asset of ["/assets/topo-a.svg", "/assets/topo-b.svg", "/assets/topo-c.svg"]) {
      const res = await request.get(asset);
      expect(res.status()).toBe(200);
      expect(await res.text()).toContain("<svg");
    }
  });

  test("hero contours parallax with scroll", async ({ page }) => {
    await page.goto("/");
    const topo = page.locator("#top .topo");
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect
      .poll(async () => topo.evaluate((el) => getComputedStyle(el).transform))
      .toMatch(/matrix\(1, 0, 0, 1, 0, 7[0-9](\.\d+)?\)/); // 400 * 0.18 = 72
  });

  test("parallax is disabled under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const topo = page.locator("#top .topo");
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(200);
    expect(await topo.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  });
});

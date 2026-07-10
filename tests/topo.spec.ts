import { test, expect } from "@playwright/test";

test.describe("topographic background", () => {
  for (const path of ["/", "/links", "/404.html"]) {
    test(`on ${path}: decorative, non-interactive, and motion-safe`, async ({ page }) => {
      await page.goto(path);

      const topo = page.locator(".topo").first();
      await expect(topo).toHaveAttribute("aria-hidden", "true");
      expect(await topo.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
      expect(await topo.evaluate((el) => getComputedStyle(el).zIndex)).toBe("-1");

      const layer = page.locator(".topo-layer").first();
      expect(await layer.evaluate((el) => getComputedStyle(el).animationName)).toBe("topo-drift");

      await page.emulateMedia({ reducedMotion: "reduce" });
      expect(await layer.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    });
  }

  test("contour mask assets are served", async ({ request }) => {
    for (const asset of ["/assets/topo-a.svg", "/assets/topo-b.svg"]) {
      const res = await request.get(asset);
      expect(res.status()).toBe(200);
      expect(await res.text()).toContain("<svg");
    }
  });
});

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

  test("contour layers parallax with scroll at layered speeds", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 400));

    const layerA = page.locator(".topo-fixed .topo-layer").first();
    const layerB = page.locator(".topo-fixed .topo-layer.topo-b");
    const accent = page.locator(".topo-fixed .topo-layer.topo-accent");

    await expect.poll(() => layerA.evaluate((el) => el.style.maskPosition)).toBe("0px -40px"); // 400 * 0.10
    await expect.poll(() => layerB.evaluate((el) => el.style.maskPosition)).toBe("0px -64px"); // 400 * 0.16
    // Accent must track layer A exactly, or the highlighted lines detach.
    expect(await accent.evaluate((el) => el.style.maskPosition)).toBe("0px -40px");
  });

  test("parallax is disabled under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(200);
    const layerA = page.locator(".topo-fixed .topo-layer").first();
    expect(await layerA.evaluate((el) => el.style.maskPosition)).toBe("");
  });

  test("section reveal replays when a section re-enters the viewport", async ({ page }) => {
    await page.goto("/");
    const skills = page.locator("#skills");
    await skills.scrollIntoViewIfNeeded();
    await expect(skills).toHaveClass(/revealed/);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(skills).not.toHaveClass(/revealed/);
    await skills.scrollIntoViewIfNeeded();
    await expect(skills).toHaveClass(/revealed/);
  });
});

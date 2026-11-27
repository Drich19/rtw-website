import { test, expect } from "@playwright/test";
import { products, looks } from "../src/lib/collection";
test("classroom walkthrough with external requests blocked", async ({
  page,
}) => {
  const external: string[] = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1") return route.continue();
    external.push(url.href);
    return route.abort();
  });
  for (const p of products) {
    await page.goto("/shop/" + p.slug);
    await expect(page.locator("h1")).toHaveText(p.name);
    await expect
      .poll(() =>
        page
          .locator(".product-photo img")
          .evaluate((img) => (img as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  for (const [i, look] of looks.entries()) {
    await page.goto("/lookbook?look=" + i);
    await expect(page.locator(".ensemble-detail h2")).toHaveText(look.name);
  }
  for (const path of ["/", "/shop", "/cart", "/checkout", "/login", "/signup"])
    await page.goto(path);
  expect(external).toEqual([]);
});
test("storage recovery and in-memory fallback", async ({ page }) => {
  await page.goto("/cart");
  await page.evaluate(() => localStorage.setItem("rtw.bag", "bad json"));
  await page.reload();
  await expect(page.getByText("Your bag is empty.")).toBeVisible();
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Full", "QuotaExceededError");
    };
  });
  await page.goto("/shop/poplin-shirt");
  await page.getByLabel("Size").selectOption("M");
  await page.getByText("Add to bag", { exact: true }).click();
  await page.getByText("View bag", { exact: true }).click();
  await expect(page.locator(".bag-row")).toHaveCount(1);
});
test("native touch swipe and reduced-motion stage", async ({ browser, baseURL }) => {
  const page = await browser.newPage({
    baseURL,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  const cdp = await page.context().newCDPSession(page);
  for (const [path, next] of [
    ["/", "Studio Tee"],
    ["/lookbook", "After Light"],
  ]) {
    await page.goto(path);
    await expect(page.getByLabel("Previous", { exact: true })).toBeEnabled();
    await page
      .locator(path === "/" ? ".mobile-stage" : ".campaign-stage")
      .evaluate((el) => el.scrollIntoView({ block: "center" }));
    const stage = (await page
      .locator(path === "/" ? ".mobile-stage" : ".campaign-stage")
      .boundingBox())!;
    const y = stage.y + stage.height / 2;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 320, y }],
    });
    for (let x = 300; x >= 70; x -= 10) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y }],
      });
      await page.waitForTimeout(12);
    }
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(
      page.locator(path === "/" ? ".dossier h2" : ".ensemble-detail h2"),
    ).toHaveText(next);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.getByLabel("Select Knit Polo", { exact: true }).click();
  await expect(page.locator(".dossier h2")).toHaveText("Knit Polo");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".specimen")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  await page.close();
});

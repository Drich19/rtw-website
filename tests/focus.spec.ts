import { test, expect } from "@playwright/test";
import { looks } from "../src/lib/collection";
test("the focus stays centered through 04 → 01 and rapid reversals", async ({
  page,
}) => {
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/lookbook?look=3");
    const nav = page.locator(".run-controls");
    for (const index of [3, 0, 3, 0]) {
      if (index === 0) await nav.getByLabel("Next", { exact: true }).click();
      else if (
        (await nav.locator("[aria-pressed=true]").textContent()) === "01"
      )
        await nav.getByLabel("Previous", { exact: true }).click();
      await expect(page.locator(".ensemble-detail h2")).toHaveText(
        looks[index].name,
      );
      await page.waitForTimeout(750);
      const geometry = await page
        .locator(".campaign-stage")
        .evaluate((stage) => {
          const stageBox = stage.getBoundingClientRect(),
            middle = stageBox.left + stageBox.width / 2;
          return [...stage.querySelectorAll(".figure")].map((el) => {
            const b = el.getBoundingClientRect();
            return {
              x: (b.left + b.width / 2 - middle) / stageBox.width,
              height: b.height,
            };
          });
        });
      expect(Math.abs(geometry[index].x)).toBeLessThan(0.02);
      const others = geometry
        .filter((_, i) => i !== index)
        .sort((a, b) => a.x - b.x);
      expect(others[0].x).toBeLessThan(-0.24);
      expect(others[2].x).toBeGreaterThan(0.24);
      expect(others[1].x - others[0].x).toBeGreaterThan(0.1);
      expect(geometry[index].height).toBeGreaterThan(
        Math.max(...others.map((o) => o.height)) * 1.15,
      );
    }
    await nav.getByLabel("Next", { exact: true }).click();
    await nav.getByLabel("Next", { exact: true }).click();
    await nav.getByLabel("Previous", { exact: true }).click();
    await expect(page.locator(".ensemble-detail h2")).toHaveText(looks[1].name);
  }
});
test("account contact sheets include every current look", async ({ page }) => {
  for (const route of ["/login", "/signup"]) {
    await page.goto(route);
    for (const look of looks)
      await expect(
        page
          .locator(".account-print")
          .getByRole("img", { name: look.name, exact: true }),
      ).toBeVisible();
  }
});

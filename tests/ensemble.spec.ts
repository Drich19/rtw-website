import { test, expect } from "@playwright/test";
import { looks } from "../src/lib/collection";
test("four persistent photographic layers, reveal reversal and shoppable mappings", async ({
  page,
}) => {
  for (const width of [1440, 1280, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const reveal = page.locator(".reveal-control"),
      stage = page.locator(".campaign-stage");
    await expect(
      page.getByRole("link", { name: "Shop all garments" }),
    ).toBeInViewport();
    await page.screenshot({
      path: "evidence/revision-private/grounded/arrival-" + width + ".jpg",
    });
    await reveal.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    await stage.screenshot({
      path: "evidence/revision-private/grounded/reveal-motion-" + width + ".jpg",
    });
    await page.waitForTimeout(850);
    await stage.screenshot({
      path: "evidence/revision-private/grounded/expanded-" + width + ".jpg",
    });
    for (const look of looks) {
      await page
        .getByRole("button", { name: "Show " + look.name, exact: true })
        .click();
      await expect(page.locator(".ensemble-detail h2")).toHaveText(look.name);
      for (const slug of look.pieces)
        await expect(
          page.locator('.ensemble-items a[href="/shop/' + slug + "?look=" + looks.indexOf(look) + '"]'),
        ).toBeVisible();
    }
    await reveal.click();
    await reveal.click();
    await reveal.click();
    await expect(reveal).toHaveAttribute("aria-expanded", "false");
    await expect(stage.locator("button:disabled")).toHaveCount(4);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".reveal-control").click();
  expect(
    await page
      .locator(".figure")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  await page.getByRole("button", { name: "Show Transit Line" }).click();
  await page.locator(".ensemble-items a").first().click();
  await expect(page).toHaveURL(/shop\/transit-jacket\?look=3$/);
});
test("physical stages retain intermediate motion evidence", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 850 });
    for (const [path, stage] of [
      ["/", ".rack"],
      ["/lookbook", ".campaign"],
    ]) {
      await page.goto(path);
      const surface = page.locator(
        stage === ".rack" ? ".rack .stage-shell" : ".campaign-stage",
      );
      await surface.scrollIntoViewIfNeeded();
      await surface.screenshot({
        path:
          "evidence/revision-private/grounded/" +
          stage.slice(1) +
          "-before-" +
          width +
          ".jpg",
      });
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page.waitForTimeout(220);
      await surface.screenshot({
        path:
          "evidence/revision-private/grounded/" +
          stage.slice(1) +
          "-moving-" +
          width +
          ".jpg",
      });
      await page.waitForTimeout(550);
      await surface.screenshot({
        path:
          "evidence/revision-private/grounded/" +
          stage.slice(1) +
          "-settled-" +
          width +
          ".jpg",
      });
    }
  }
});

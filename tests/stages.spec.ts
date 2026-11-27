import { test, expect } from "@playwright/test";
import { products, looks, peso } from "../src/lib/collection";
import { normalize } from "../src/lib/cart";
test("variant validation", () => {
  const line = {
    slug: products[0].slug,
    color: products[0].color,
    size: "M",
    quantity: 56,
  };
  expect(
    normalize([
      null,
      line,
      line,
      { ...line, size: "Z" },
      { ...line, color: "red" },
      { ...line, quantity: -1 },
    ]),
  ).toEqual([{ ...line, quantity: 99 }]);
});
test("production stages and responsive routes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  for (const width of [1440, 1280, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const path of [
      "/",
      "/lookbook",
      "/shop",
      "/shop/field-overshirt",
      "/cart",
      "/login",
      "/signup",
      "/checkout",
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path + " " + width,
      ).toBeTruthy();
      if (path !== "/" && path !== "/lookbook") continue;
      await page.waitForTimeout(200);
      await page.screenshot({
        path:
          "evidence/revision-private/grounded/" +
          (path === "/" ? "rack" : "runway") +
          "-" +
          width +
          ".jpg",
        quality: 82,
      });
      const names = path === "/" ? products.slice(0, 5) : looks;
      for (const [i, item] of names.entries()) {
        await page
          .getByRole("button", { name: "Show " + item.name, exact: true })
          .click();
        await expect(
          page.locator(path === "/" ? ".dossier h2" : ".ensemble-detail h2"),
        ).toHaveText(item.name);
        if (path === "/")
          await expect(page.getByText("View product")).toHaveAttribute(
            "href",
            "/shop/" + products[i].slug,
          );
        else {
          const pieces = looks[i].pieces.map(
            (slug) => products.find((p) => p.slug === slug)!,
          );
          await expect(page.locator(".look-total strong")).toHaveText(
            peso(pieces.reduce((n, p) => n + p.price, 0)),
          );
          for (const p of pieces)
            await expect(
              page.locator(".ensemble-items a").filter({ hasText: p.name }),
            ).toHaveAttribute("href", "/shop/" + p.slug + "?look=" + i);
        }
      }
      await page.keyboard.press("ArrowLeft");
      await expect(
        page.locator(path === "/" ? ".dossier h2" : ".ensemble-detail h2"),
      ).toHaveText(names[names.length - 2].name);
    }
  }
  expect(errors).toEqual([]);
});

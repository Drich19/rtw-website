import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`reversible reveal and outfit shopping at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto("/");
    const stage = page.locator(".campaign-stage");
    const rear = stage.locator(".figure").nth(2);
    const toggle = page.locator(".reveal-control");
    const box = (await stage.boundingBox())!;
    await expect(rear).toHaveCSS("opacity", "1");
    await toggle.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(350);
    const progress = () => stage.evaluate(el => Number(getComputedStyle(el).getPropertyValue("--reveal")));
    expect(await progress()).toBeGreaterThan(0);
    expect(await progress()).toBeLessThan(1);
    await page.keyboard.press("Enter");
    await expect.poll(progress).toBe(0);
    await page.keyboard.press("Enter");
    await expect.poll(progress).toBe(1);
    const settled = (await rear.boundingBox())!;
    expect(settled.x).toBeGreaterThan(box.x);
    expect(settled.x + settled.width).toBeLessThan(box.x + box.width);
    expect((await stage.boundingBox())!.height).toBe(box.height);
    await expect(toggle).toBeFocused();
    await page.getByRole("button", { name: "Show After Light" }).click();
    await page.locator(".ensemble-items").getByRole("link", { name: /Pleat Trouser/ }).click();
    await page.getByRole("link", { name: "Back to After Light" }).click();
    await expect(page.locator(".ensemble-detail h2")).toHaveText("After Light");
    await page.locator(".ensemble-items").getByRole("link", { name: /Pleat Trouser/ }).click();
    await page.getByLabel("Size").selectOption("M");
    await page.getByText("Add to bag", { exact: true }).click();
    await page.getByText("View bag").click();
    await expect(page.locator(".bag-row")).toContainText("Espresso / M");
    await page.getByText("Demo checkout", { exact: true }).click();
    await page.getByText("Confirm demo order").click();
    await expect(page.locator(".receipt")).toContainText("Espresso / M");
    for (const query of ["", "?look=1", "?look=invalid"]) {
      await page.goto("/shop/pleat-trouser" + query);
      await expect(page.locator(".styled-link")).toHaveText("See it styled in Soft Structure");
    }

    await page.goto("/shop");
    const filters = page.getByRole("button", { name: /Filter & sort/ });
    await expect(page.getByRole("button", { name: "Reset" })).toHaveCount(0);
    if (width === 390) {
      await expect(page.getByLabel("Category")).toBeHidden();
      await filters.press("Enter");
    }
    await page.getByLabel("Category").selectOption("Bottoms");
    if (width === 390) {
      await filters.press("Enter");
      await expect(filters).toContainText("Bottoms");
      await expect(page.getByLabel("Sort")).toBeHidden();
    }
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByRole("status")).toHaveText("10 garments");
  });
}

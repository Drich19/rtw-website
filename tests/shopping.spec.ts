import { test, expect } from "@playwright/test";
test("catalog and variant purchase", async ({ page }) => {
  await page.goto("/shop");
  await page.getByLabel("Search").fill("zzz");
  await expect(page.getByRole("status")).toHaveText("0 garments");
  await page.getByText("Reset", { exact: true }).click();
  await page.getByLabel("Category").selectOption("Outerwear");
  await page.getByLabel("Sort").selectOption("high");
  await expect(page.locator(".grid h2").first()).toHaveText("Transit Jacket");
  await page.getByRole("link", { name: /Field Overshirt/ }).click();
  await expect(page).toHaveURL(/shop\/field-overshirt$/);
  await page.goBack();
  await expect(page.getByLabel("Category")).toHaveValue("Outerwear");
  await page.goto("/shop/field-overshirt");
  const add = page.getByText("Add to bag", { exact: true });
  await add.click();
  await expect(page.getByLabel("Size")).toBeFocused();
  await page.getByLabel("Size").selectOption("M");
  await add.click();
  await add.click();
  await page.getByLabel("Size").selectOption("L");
  await add.click();
  await page.getByText("View bag", { exact: true }).click();
  await page.reload();
  await expect(page.locator(".bag-row")).toHaveCount(2);
  await expect(page.getByLabel("Quantity").first()).toHaveValue("2");
  await page.getByText("Remove", { exact: true }).last().click();
  await page.getByLabel("Quantity").selectOption("3");
  await expect(page.locator(".total strong")).toHaveText("₱7,470");
  await page.getByText("Demo checkout", { exact: true }).click();
  await expect(page.locator(".bag-row")).toHaveCount(1);
  await page.getByText("Confirm demo order").click();
  await expect(
    page.getByRole("heading", { name: /Order confirmed/ }),
  ).toBeVisible();
  await page.goto("/cart");
  await expect(page.getByText("Your bag is empty.")).toBeVisible();
  expect((await page.goto("/shop/no-such-garment"))?.status()).toBe(404);
});
test("account and mobile controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.click();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await page
    .locator(".mobile-stage")
    .evaluate(
      (el) =>
        (el.scrollLeft =
          el.querySelector(".slide")!.getBoundingClientRect().width * 3),
    );
  await expect(page.locator(".dossier h2")).toHaveText("Knit Polo");
  await menu.click();
  await page.getByRole("dialog").getByText("Account", { exact: true }).click();
  await page.getByText("Create an account").click();
  await page.getByLabel("Demo email").fill("student@example.test");
  await page.getByLabel(/Demo password/).fill("fictional123");
  await page.getByLabel("Confirm password").fill("different");
  await page.getByText("Create demo account").click();
  await expect(page.getByText("Passwords must match.")).toBeVisible();
  await page.getByLabel("Confirm password").fill("fictional123");
  await page.getByText("Show password").click();
  await expect(page.getByLabel(/Demo password/)).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByText("Create demo account").click();
  await expect(page.getByRole("status")).toHaveText("Demo signup complete.");
  await page.getByText("Go to login").click();
  await page.getByLabel("Demo email").fill("student@example.test");
  await page.getByLabel(/Demo password/).fill("fictional123");
  await page.getByRole("button", { name: "Demo login" }).click();
  await expect(page.getByRole("status")).toHaveText("Demo login complete.");
});

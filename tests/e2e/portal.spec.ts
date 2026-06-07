import { expect, test } from "@playwright/test";

test("public portal is available without authentication", async ({ browser }) => {
  const context = await browser.newContext({
    storageState: {
      cookies: [],
      origins: []
    }
  });
  const page = await context.newPage();

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Manage GitHub Stars with AI" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in with GitHub" }).first()).toBeVisible();

  await context.close();
});

test("authenticated portal links to the console", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome E2E User")).toBeVisible();
  await page.getByRole("link", { name: "Goto" }).click();
  await expect(page).toHaveURL(/\/console/);
});

import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const authFile = "tests/e2e/.auth/user.json";

test("authenticate as the e2e user", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign in with GitHub" }).first().click();
  await expect(page).toHaveURL(/\/console/);
  await expect(page.getByRole("button", { name: "Frontend" })).toBeVisible();

  mkdirSync(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});

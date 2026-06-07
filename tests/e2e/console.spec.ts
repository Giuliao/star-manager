import { expect, test } from "@playwright/test";

test("console renders seeded tags and starred repositories", async ({ page }) => {
  await page.goto("/console");

  await expect(page.getByRole("button", { name: "Frontend" })).toBeVisible();
  await expect(page.getByRole("button", { name: "AI" })).toBeVisible();
  await expect(page.getByText("alpha-ui")).toBeVisible();
  await expect(page.getByText("beta-api")).toBeVisible();
  await expect(page.getByText("gamma-worker")).toBeVisible();
});

test("repo search filters the starred repository list", async ({ page }) => {
  await page.goto("/console");

  await page.getByPlaceholder("Please input repo name or description").fill("beta");
  await expect(page.getByText("beta-api")).toBeVisible();
  await expect(page.getByText("alpha-ui")).toBeHidden();
});

test("tag filter narrows the repository list", async ({ page }) => {
  await page.goto("/console");

  await page.getByText("Frontend").first().click();
  await expect(page.getByText("alpha-ui")).toBeVisible();
  await expect(page.getByText("beta-api")).toBeHidden();
});

test("selecting a repository renders its README", async ({ page }) => {
  await page.goto("/console");

  await page.getByText("Reusable UI primitives for dashboards").click();
  await expect(page).toHaveURL(/\/console\/octo%2Falpha-ui/);
  await expect(page.getByRole("heading", { name: "E2E Fixture README" })).toBeVisible();
  await expect(page.getByText("This README is served from an e2e fixture.")).toBeVisible();
  await expect(page.getByText("README rendering")).toBeVisible();
});

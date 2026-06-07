import { expect, test } from "@playwright/test";

test("console redirects anonymous users to the portal", async ({ browser }) => {
  const context = await browser.newContext({
    storageState: {
      cookies: [],
      origins: []
    }
  });
  const page = await context.newPage();

  await page.goto("/console");
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: "Sign in with GitHub" }).first()).toBeVisible();

  await context.close();
});

test("github stream rejects anonymous requests", async ({ browser }) => {
  const context = await browser.newContext({
    storageState: {
      cookies: [],
      origins: []
    }
  });
  const response = await context.request.get("/api/github?per_page=20&page=1");

  await expect(response).toBeOK();
  expect(await response.text()).toContain("You need to be authenticated");

  await context.close();
});

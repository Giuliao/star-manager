import { expect, test } from "@playwright/test";

test("github stream returns deterministic fixture data", async ({ page }) => {
  await page.goto("/console");

  const response = await page.request.get("/api/github?per_page=20&page=2");
  await expect(response).toBeOK();

  const body = await response.text();
  expect(body).toContain("gamma-worker");
  expect(body.trim().split("\n")).toHaveLength(1);
});

test("github stream validates pagination params", async ({ page }) => {
  await page.goto("/console");

  const response = await page.request.get("/api/github");
  await expect(response).toBeOK();
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(await response.json()).toEqual({
    message: "per_page and page are required"
  });
});

test("chat stream uses the e2e response without calling the model provider", async ({ page }) => {
  await page.goto("/console");

  const response = await page.request.post("/api/chat", {
    data: {
      messages: [
        {
          role: "user",
          content: "Summarize this repository"
        }
      ]
    }
  });

  await expect(response).toBeOK();
  expect(await response.text()).toContain("E2E summary stream");
});

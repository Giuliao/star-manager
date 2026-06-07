import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test.local" });
dotenv.config({ path: ".env.local" });

const port = Number(process.env.PORT || 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: "bun run start",
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
    env: {
      ...process.env,
      PORT: String(port),
      E2E_TEST: "1",
      NODE_OPTIONS: "",
      AUTH_SECRET: process.env.AUTH_SECRET || "e2e-auth-secret",
      AUTH_URL: baseURL,
      AUTH_TRUST_HOST: "true",
      OPENAI_MODEL: process.env.OPENAI_MODEL || "e2e-model",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "e2e-api-key",
      OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || "http://127.0.0.1:9"
    }
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/e2e/.auth/user.json"
      },
      dependencies: ["setup"]
    }
  ]
});

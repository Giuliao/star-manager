import { execFileSync } from "node:child_process";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test.local" });
dotenv.config({ path: ".env.local" });

const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${process.env.PORT || 3000}`;

const env = {
  ...process.env,
  E2E_TEST: "1",
  NODE_OPTIONS: "",
  AUTH_SECRET: process.env.AUTH_SECRET || "e2e-auth-secret",
  AUTH_URL: baseURL,
  AUTH_TRUST_HOST: "true",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "e2e-model",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "e2e-api-key",
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || "http://127.0.0.1:9"
};

function run(command: string, args: string[]) {
  execFileSync(command, args, {
    stdio: "inherit",
    env
  });
}

export default async function globalSetup() {
  run("bun", ["run", "db:migrate"]);
  run("bun", ["run", "e2e:db:reset"]);
  run("bun", ["run", "e2e:db:seed"]);
}
